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
//import { Formik } from 'formik';
import { signUp } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { globleStyles } from "../styles/global";

//const SignUpScreen = () => {
//const [email, setEmail] = useState("");
//const [password, setPassword] = useState("");
//const [cpassword, setcPassword] = useState("");

//https://stackoverflow.com/questions/39631895/how-to-set-image-width-to-be-100-and-height-to-be-auto-in-react-native
const win = Dimensions.get("window");
const ratio = win.width / 5229;

const SignUpScreen = ({ navigation }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  //var user = firebase.auth().currentUser;

  function resetSignUpForm() {
    emailRef.current.value = "";
    passwordRef.current.value = "";
    confirmPasswordRef.current.value = "";
  }

  async function handleSignUp() {
    //Check if password is less than 6 characters as that is the minumum
    if (passwordRef.current.value.length < 6) {
      resetSignUpForm();
      alert("Password is needs to be longer than 6 characters!");
      //Check if passwords match
    } else if (passwordRef.current.value != confirmPasswordRef.current.value) {
      resetSignUpForm();
      alert("Passwords do not match!");

      //Else attempt to create account
    } else
      try {
        //Check that the email field isn't empty
        //check if the 2 passwords are the
        if (passwordRef.current.value === confirmPasswordRef.current.value) {
          let response = await signUp(
            emailRef.current.value,
            passwordRef.current.value
          );
          console.log(response);
          alert(
            "Account successfully created please check " +
              emailRef.current.value +
              " to confirm your account"
          );
          // Create a request here where you add a user and a fridge to MONGODB
          let userRespose = await axios.post(
            "https://recipebackendyear3proj.herokuapp.com/users/add/" +
              emailRef.current.value
          );
          let fridgeRespose = await axios.post(
            "https://recipebackendyear3proj.herokuapp.com/fridge/add/" +
              emailRef.current.value
          );

          // emailRef.current.value = "";
          // passwordRef.current.value = "";
          // confirmPasswordRef.current.value = "";
          resetSignUpForm();
          // emailRef.current.value = "";
          // passwordRef.current.value = "";
          // confirmPasswordRef.current.value = "";
          //Reset just the password
          navigation.navigate("LoginScreen");
        }
      } catch (err) {
        alert(err);
        let email = emailRef.current.value;
        if (!email.includes("@")) {
          alert("Please enter a valid email");
          resetSignUpForm();
        }
        //Add a check for email in database
        //alert("The email " + emailRef.current.value + " is already in use");
      }
  }
  return (
    <KeyboardAvoidingView style={globleStyles.container} behavior='padding'>
      <View style={{ paddingBottom: 40 }}>
        <Image
          style={{ width: win.width, height: 250 }}
          source={require("../assets/Fridge.jpg")}
        />
      </View>

      <View>
        <Text>Sign Up</Text>
      </View>

      <View style={globleStyles.inputContainer}>
        {/* <Formik
          initialValues={{email: '', password: ''}}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({handleChange, handleBlur, handleSubmit, values}) => (
            
            <TextInput
              label='Email Address'
              ref={emailRef} 
              placeholder='Email'
              style={globleStyles.input}
            />)}

            <TextInput
              label='Password'
              ref={passwordRef}
              placeholder='Password'
              style={globleStyles.input}
              //Makes the password unviewable
             secureTextEntry
            />

           <TextInput
            abel='Confirm Password'
            ref={confirmPasswordRef}
            placeholder='Confirm Password'
            style={globleStyles.input}
            //Makes the password unviewable
            secureTextEntry
          />
        </Formik>   */}

        <Text>Email</Text>

        <TextInput
          placeholder='Email'
          ref={emailRef}
          //value={email}
          //onChangeText={(text) => setEmail(text)}
          style={globleStyles.input}
        />

        <Text>Password</Text>
        <TextInput
          ref={passwordRef}
          placeholder='Password'
          style={globleStyles.input}
          //Makes the password unviewable
          secureTextEntry
        />

        <Text>Confirm Password</Text>
        <TextInput
          ref={confirmPasswordRef}
          placeholder='Confirm Password'
          style={globleStyles.input}
          //Makes the password unviewable
          secureTextEntry
        />
      </View>

      <View style={globleStyles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[globleStyles.button, globleStyles.buttonOutline]}
        >
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={globleStyles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={[globleStyles.button, globleStyles.buttonOutline]}
        >
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

// const styles = StyleSheet.create({
//   //fridgeImage: {
//   //width: win.width,
//   //height: 500,
//   //},
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   inputContainer: {
//     flex: 1,
//     width: "80%",
//   },
//   input: {
//     backgroundColor: "white",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 5,
//   },
//   buttonContainer: {
//     width: "60%",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 40,
//   },
//   button2: {
//     borderRadius: 25,
//     marginTop: 5,
//     marginBottom: 5,
//     alignItems: "center",
//   },
//   button: {
//     backgroundColor: "#A7D2CB",
//     width: "80%",
//     padding: 5,
//     borderRadius: 50,
//     borderRadius: 25,
//     marginTop: 5,
//     marginBottom: 5,
//     alignItems: "center",
//     textAlign: "center",
//   },
//   buttonOutLine: {
//     backgroundColor: "white",
//     marginTop: 0,
//     borderColor: "#0782F9",
//     borderWidth: 2,
//   },
//   buttonText: {
//     color: "#167070",
//     fontWeight: "700",
//     fontSize: 16,
//     // position: "relative",
//   },
//   buttonOutlineText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });
