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
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth, login, GoogleProvider, FacebookProvider } from "../firebase.js";
import {
  getAuth,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import HomePageScreen from "./HomePageScreen.js";
import axios from "axios";
import { globleStyles } from "../styles/global.js";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
//import AsyncStorage from '@react-native-async-storage/async-storage'
//

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const auth = getAuth();
  const locales = new LocalizedStrings(data);
  const locale = "en"; // LINK TO PREFERENCES
  locales.setLanguage(locale);

  function AnonymousLogIn() {
    signInAnonymously(auth)
      .then(() => {
        navigation.navigate("HomePageScreen");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  //TO DO REWORK THIS TO ACTUALLY FUNCTION

  async function onSubmit(e) {
    e.preventDefault();
    //Adding fridge and users to mongoDB
    // const user = {
    //   username: email,
    // };

    // const usersFridge = {
    //   username: email,
    //   ingredients: "Test",
    // };
    // //console.log(user);
    // // window.location = "/";
    // // Check to see if username already exists
    // axios
    //   .post("http://localhost:5000/users/add", user)
    //   .then((res) => console.log(res.data))
    //   .catch((err) => console.log(err));

    // //creating a fridge where the fridgeid is also their email
    // axios
    //   .post("http://localhost:5000/fridge/add", usersFridge)
    //   .then((res) => console.log(res.data))
    //   .catch((err) => console.log(err));
  }

  async function processLoginIn() {
    //const auth = getAuth();
    // try {
    //   await login(emailRef.current.value, passwordRef.current.value);
    //   //alert("Logged in!");
    //   navigation.navigate("HomePageScreen");
    // } catch {
    //   alert(
    //     "Account assoicated with email " +
    //       emailRef.current.value +
    //       " doesn't exist"
    //   );
    // }
    // alert(email);
    // alert(password);
    // console.log(value);
    try {
      let value = await login(email, password);
      goToHomePageScreen(email);
    } catch (error) {
      alert("Account assoicated with email " + email + " doesn't exist");
    }

    //navigation.navigate("HomePageScreen"); //Should add parameters which are passed to the home page screen
  }

  const goToHomePageScreen = (paramEmail) => {
    navigation.navigate("HomePageScreen", {
      param1: paramEmail,
      param2: "",
      lan: "",
    });
  };

  //Combination of processLoginIn() and onSubmit(e)
  async function pressCombo(e) {
    //onSubmit(e);
    processLoginIn();
  }

  //Add await functions in here
  async function processGoogleAuth() {
    signInWithPopup(auth, GoogleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        axios.post(
          "https://recipebackendyear3proj.herokuapp.com/users/add/" + user.email
        );
        axios.post(
          "https://recipebackendyear3proj.herokuapp.com/fridge/add/" +
            user.email
        );
        alert("Success");
        console.log("HERE: " + user.email);

        goToHomePageScreen(user.email);
        //navigation.navigate("HomePageScreen");
      })
      .catch((error) => {
        console.log("fail");

        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  async function processFacebookAuth() {
    signInWithPopup(auth, FacebookProvider)
      .then((result) => {
        //The signed-in user info
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        navigation.navigate("HomePageScreen");
      })
      .catch((error) => {
        // Handle Errors here.
        console.log("fail");
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });
  }
  //https://stackoverflow.com/questions/39631895/how-to-set-image-width-to-be-100-and-height-to-be-auto-in-react-native
  const win = Dimensions.get("window");
  const ratio = win.width / 5229;
  //const ratio2 = win.height / 2000;
  return (
    // Prevents the keyboard from coveri  ng the email and password input fields

    <KeyboardAvoidingView style={globleStyles.container} behavior='padding'>
      <View style={{ paddingBottom: 40 }}>
        <Image
          style={{ width: win.width, height: 250 }}
          source={require("../assets/Fridge.jpg")}
        />
      </View>
      {/* <View style={globleStyles.inputContainer}> */}
      <Text>{locales.email}</Text>
      <TextInput
        placeholder={locales.email}
        ref={emailRef}
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={globleStyles.input}
      />
      <Text>{locales.password}</Text>
      <TextInput
        placeholder={locales.password}
        ref={passwordRef}
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={globleStyles.input}
        //Makes the password unviewable
        secureTextEntry
      />
      {/* //<Ionicons name='eye' size={20} /> */}
      {/* </View> */}
      <View style={globleStyles.buttonContainer}>
        {/* Creating the button for login */}
        <TouchableOpacity onPress={pressCombo} style={globleStyles.button}>
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
            {locales.login}
          </Text>
        </TouchableOpacity>
        {/* style = array allows inheritance of buttons */}
        {/* Creating the button for register */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={[globleStyles.button, globleStyles.buttonOutline]}
        >
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
            {locales.signUp}
          </Text>
        </TouchableOpacity>
        {/* Creating the button for forget password */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgottenPassword")}
          style={globleStyles.buttonStyles}
        >
          <Text style={[globleStyles.buttonText]}>
            {locales.forgotPassword}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={AnonymousLogIn}
          style={globleStyles.buttonStyles}
        >
          <Text style={[globleStyles.buttonText]}>{locales.guestLogin}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globleStyles.buttonStyles}>
          <Text style={[globleStyles.buttonText]}>{locales.signinWith}</Text>
        </TouchableOpacity>
        {/* Add google icon */}
        <TouchableOpacity
          onPress={processGoogleAuth}
          style={globleStyles.buttonStyles}
        >
          <View>
            <Image
              style={{ width: 170, height: 41 }}
              source={require("../assets/google_signin_button.png")}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={processFacebookAuth}
          style={globleStyles.buttonStyles}
        >
          <View>
            <Image
              style={{ width: 170, height: 40 }}
              source={require("../assets/facebook_signin_button.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
//   buttonStyles: {
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
