import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseSetup";
import PressableButton from "../components/PressableButton";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    if (!email || !password) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      //console.log(userCred);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-login-credentials") {
        alert("Invalid email or password");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email");
      } else {
        alert("Error logging in: " + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Log in</Text>
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="#aaa"
          />

          <PressableButton
            customStyle={styles.buttonDefault}
            pressedFunction={loginHandler}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </PressableButton>

          <PressableButton
            customStyle={styles.buttonDefault}
            pressedFunction={() => navigation.replace("Signup")}
          >
            <Text style={styles.buttonText}>Not registered yet?</Text>
          </PressableButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    justifyContent: 'center'
  },
  header: {
    width: "80%",
    alignSelf: "center",
  },
  footer: {
    width: "100%",
    paddingVertical: 30,
    alignItems: "center",
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 30,
  },
  input: {
    height: 50,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 10,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 20,
  },
  buttonDefault: {
    width: "80%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    borderColor: "#000",
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
  }
});