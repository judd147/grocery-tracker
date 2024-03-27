import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { doc,getDocs,query,collection,where,getDoc,onSnapshot } from "firebase/firestore";
import { database } from "../firebase/firebaseSetup";
import { auth,storage } from "../firebase/firebaseSetup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ref, getDownloadURL } from "firebase/storage";

const Profile = ({ navigation, route }) => {
  
  const user = auth.currentUser;
  const [updatedUsername, setUpdatedUsername] = useState(null);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    async function getImageURL() {
      if (auth.currentUser) {
        const userUid = auth.currentUser.uid;
        try {
          const userQuery = query(collection(database, 'users'), where('uid', '==', userUid));
          const querySnapshot = await getDocs(userQuery);

          let userId;
          querySnapshot.forEach(doc => {
            userId = doc.id;
          });
          const userRef = doc(database, 'users', userId);
          const userDocSnapshot = await getDoc(userRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const imageUri = userData.imageUri;
            const imageRef = ref(storage, imageUri);
            const imageDownloadURL = await getDownloadURL(imageRef);
            setImageURL(imageDownloadURL);
          } else {
            console.log("user document does not exist.");
          }
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      }
    }

    getImageURL();
  }, []);
  




  const handleEditProfilePress = () => {
    navigation.navigate("Edit Profile");
  };

  const handleWatchListPress = () => {
    navigation.navigate("Watch List");
  };

  const handleMyContributionsPress = () => {
    navigation.navigate("My Contributions");
  };

  const handleDeleteAvatar = async () => {
    try {
      setImageURL("");
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
     
        <Text style={styles.text}>Hello, {user.displayName}</Text>


        {imageURL && (
  <View>
    <Image
      style={styles.avatarImage}
      source={{
        uri: imageURL,
      }}
    />
    <TouchableOpacity
      style={styles.deleteIcon}
      onPress={handleDeleteAvatar}
    >
      <MaterialIcons name="delete" size={24} color="red" />
    </TouchableOpacity>
  </View>
)}

        <View style={styles.emailContainer}>
          <MaterialIcons name="email" size={24} />
          <Text style={[styles.emailText]}>
            {auth.currentUser.email}
          </Text>
        </View>
      </View>

      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => handleEditProfilePress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="edit" size={24} color="#163020" />
            <Text style={styles.text}> Edit Profile</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleWatchListPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="playlist-edit"
              size={24}
              color="#163020"
            />
            <Text style={styles.text}> My Watch List</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleMyContributionsPress()}
          style={styles.linkButton}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="star" size={24} />
            <Text style={styles.text}> My Contributions</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={26}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  userInfoContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: "25%",
    padding: 10,
    marginTop: "5%",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  displayNameText: {
    marginTop: "8%",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: "5%",
    color: "black",
  },
  emailContainer: {
    flexDirection: "row"
  },
  emailText: {
    fontSize: 14,
    color: "#163020",
  },
  linkContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  linkButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "lightgray",
  },
  text: {
    color: "#163020",
    fontSize: 18,
    padding: 3,
    fontWeight: "bold",
  },
  avatarImage: {
    width: 100, 
    height: 100,
    resizeMode: 'cover', 
    borderRadius: 8, 
  },
  deleteIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 5,
    borderRadius: 20,
  },
  
});
