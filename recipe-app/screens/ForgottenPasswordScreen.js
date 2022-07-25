import React, { useState, useRef } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import {
  NavigationContainer,
  NavigationHelpersContext,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { forgetPassword } from "../firebase.js";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgottenPasswordScreen = ({navigation }) => {
  const [email, setEmail] = useState("");
  //const [showLoading, setShowLoading] = useState(false);
  const emailRef = useRef();
  const win = Dimensions.get("window");
  const ratio = win.width / 5229;
  const auth = getAuth();

  async function reset() {
    //setShowLoading(true);
    try {
      await forgetPassword(emailRef.current.value);
      alert("Check your inbox for instructions");
      //setShowLoading(false);
    } catch (e) {
      //setShowLoading(false);
      alert("Email not found");
    }
  }

  async function resetPassword() {
    // const auth = getAuth();
    sendPasswordResetEmail(auth, emailRef.current.value)
      .then(() => {
        // Password reset email sent!
        // ..
        alert("Email has been sent to " + emailRef.current.value);
      })
      .catch((error) => {
        alert("Email not found");
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  function backButton() {}

  return (
    // Prevents the keyboard from coveri  ng the email and password input fields
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={{ paddingBottom: 40 }}>
        <Image
          style={{ width: win.width, height: 250 }}
          source={require("../assets/Fridge.jpg")}
        />
      </View>
      <Text>Enter Email Address:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Your Email'
          ref={emailRef}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={resetPassword}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={[styles.button, styles.buttonOutlineText]}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={[styles.button, styles.buttonOutlineText]}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgottenPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button2: {
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#A7D2CB",
    width: "80%",
    padding: 5,
    borderRadius: 50,
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    textAlign: "center",
  },
  buttonOutLine: {
    backgroundColor: "white",
    marginTop: 0,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "#167070",
    fontWeight: "700",
    fontSize: 16,
    // position: "relative",
  },
  buttonOutlineText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
