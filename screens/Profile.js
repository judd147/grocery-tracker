import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Image } from 'react-native';
import { query,collection,where, getDocs } from 'firebase/firestore';
import { database,auth } from "../firebase/firebaseSetup";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../styles/Colors';
import LottieView from "lottie-react-native";
import { Dimensions } from 'react-native';
import LinearGradientComp from '../components/LinearGradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Profile = ({navigation,route}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userUid = auth.currentUser.uid;
  const [user, setUser] = useState(auth.currentUser);
  const [updatedUsername, setUpdatedUsername] = useState(null);
  

  // set updated user name every time the user updates the profile
  useEffect(() => {
    if (route.params?.updateProfile) {
      console.log("profile is updated");
      setUpdatedUsername(user.displayName);
  
      // Set the update flag to false after handling the update
      navigation.setParams({ updateProfile: false });
    }
  }, [route.params?.updateProfile]);
  
  

  const handleEditProfilePress = () => {
    // Navigate to the "Edit Profile" screen
    navigation.navigate('Edit Profile');
  };

  const handleWatchListPress = () => {
    // Navigate to the "Edit Profile" screen
    navigation.navigate('Watch List');
  };



  const handleMyContributionsPress = () => {
    // Navigate to the "My Contributions" screen
    navigation.navigate('My Contributions');
  }


  return (
    <LinearGradientComp>
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
    <View style={styles.userInfoContainer}>
      {/* Left side: Display Name */}
      <View style={styles.leftContent}>
        <View style={styles.displayNameContainer}>
          {/* Welcome message */}
          <Text style={[styles.displayNameText, { fontSize: 20 }]}>
            Hello, {user.displayName || updatedUsername}
          </Text>
        </View>
        <View style={styles.emailContainer}>
          {/* User's email */}
          <View style={styles.emailButton}>
            <MaterialIcons name="email" size={24} />
            <Text style={[styles.myEmailText, { fontSize: 16 }]}>
              {auth.currentUser.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Right side: Avatar */}
      <View style={styles.avatarContainer}>
        {auth.currentUser.photoURL ? (
          <Image source={{ uri: auth.currentUser.photoURL }} style={styles.avatarImage} />
        ) : (
          <Image source={require('../images/default-avatar.jpg')} style={styles.avatarImage} />
        )}
      </View>
    </View>

      
      <View style={{flex:0.1, justifyContent:'space-between', width:'100%', alignSelf:'center'}}>
        <TouchableOpacity 
        onPress={() => handleEditProfilePress()} 
        style={styles.EditLimitContainer}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
          <AntDesign name="edit" size={24} color="#163020" />
          <Text style={styles.EditLimitText}> Edit Profile</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{flex:0.1,justifyContent:'space-between', width:'100%', alignSelf:'center'}}>
        <TouchableOpacity 
        onPress={() => handleWatchListPress()} 
        style={styles.EditLimitContainer}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
          <MaterialCommunityIcons name="playlist-edit" size={24} color="#163020" /> 
          <Text style={styles.EditLimitText}> My Watch List</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{flex:0.1,justifyContent:'space-between', width:'100%', alignSelf:'center'}}>
  <TouchableOpacity 
    onPress={() => handleMyContributionsPress()} 
    style={styles.EditLimitContainer}
  >
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <AntDesign name="star" size={24}  />
      <Text style={styles.EditLimitText}> My Contributions</Text>
    </View>
    <MaterialIcons name="keyboard-arrow-right" size={26} color="black" />
  </TouchableOpacity>
</View>


      <View style={{flex:0.3,justifyContent:'space-between', width:'100%', alignSelf:'center'}}>
        <LottieView
              source={require('../images/Animation22.json')}
              autoPlay
              loop
              style={styles.analysisLottie}
            />
      </View>         
    </View>
    </LinearGradientComp>
  );
};

export default Profile;


const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:"90%",
    padding: 8,
    marginTop: "3%",
    // marginBottom: "5%",
    alignSelf:'center',
    backgroundColor: '#fff', 
    borderRadius: 8,
    elevation: 4,
  },
  leftContent: {
    flex: 1,
  },
  displayNameContainer: {
    flex: 1, // Takes 1/2 of the available space when name is too long
  },
  displayNameText: {
    marginTop: '8%',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: '5%',
    color: 'black',
  },
  emailContainer:{
    marginBottom: '3%',
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    //marginBottom: '10%',
    width:"85%",
    borderRadius: 5,
    padding:5,
    marginLeft: '5%',
    marginTop: '-35%',
    backgroundColor: 'white',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  },
  myEmailText: {
    fontSize: 14,
    marginLeft: '2%',
    color: '#163020',
  },

  avatarContainer: {
    width: 120, 
    height: 120, 
    borderRadius: 10, 
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    marginVertical: '6%',
    marginRight: '3%',
    backgroundColor: 'gray',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

avatarImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover', // maintains aspect ratio while covering the container
},
  EditLimitContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    width: "90%",
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 4,
    // marginVertical: "1%",
    // marginHorizontal:"2%",
    borderWidth: 0.5,  // Add border
    borderColor: 'lightgray',
    alignSelf:'center',
  },
  EditLimitText: {
    color: '#163020',
    fontSize: 18,
    padding: 3,
    fontWeight: 'bold',
  },

  analysisLottie: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
  },
});