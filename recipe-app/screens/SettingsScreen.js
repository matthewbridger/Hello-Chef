import React, { useState, Component, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Picker,
  TouchableOpacity,
} from "react-native";
import NavigationBar from "../NavigationBar";
import { globleStyles } from "../styles/global";
import { useAuth } from "../firebase";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import axios from "axios";
import { getAuth } from "@firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";

// import { forgetPassword } from "../firebase.js";

const SettingsScreen = ({ navigation, route }) => {
  const { param1, param2, param3 } = route.params;
  const currentUser = useAuth();
  const auth = getAuth();
  // View state
  const [userView, setUserView] = useState([]);
  const [hView, sethView] = useState(false);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("");
  const [email, setEmail] = useState("");
  const emailRef = useRef();

  console.log(param1);

  useEffect(() => {
    fetch("https://recipebackendyear3proj.herokuapp.com/users/setView/" + param1)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.horizontalView);
        setUserView(responseJson.horizontalView);
      })
      .catch((error) => {
        console.error(error);
      });

    async function fetchLanguageData() {
      const languageQuery =
        "https://recipebackendyear3proj.herokuapp.com/users/getLanguage/" +
        param1;
      const request = await axios.get(languageQuery);
      setLocale(request["data"]["languagePreference"]);
      console.log(request["data"]["languagePreference"]);
      //setSLD(request.data);
    }
    fetchLanguageData();

    // axios
    //   .get(langugeQuery)
    //   .then((res) => {
    //     console.log(res.data.languagePreference);
    //   })
    //   .catch((err) => console.log(err));
  }, []);

  async function onSubmit(val) {
    //val => onSubmit(val);
    setLocale(val);
    let query =
      "https://recipebackendyear3proj.herokuapp.com/users/setLanguage/" +
      currentUser?.email +
      "/" +
      val;
    axios
      .put(query)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  const goToFridge = () => {
    navigation.navigate("FridgeScreen", {
      param1: currentUser?.email,
    });
  };

  const goToDiet = () => {
    navigation.navigate("DietScreen", {
      param1: currentUser?.email,
    });
  };

  const goToPreferenceScreen = () => {
    navigation.navigate("PreferenceScreen", {
      param1: currentUser?.email,
    });
  };

  const goToCookingTimer = () => {
    navigation.navigate("CookingTimer", {
      param1: currentUser?.email,
    });
  };

  const goToSettings = () => {
    navigation.navigate("SettingsScreen", {
      param1: currentUser?.email,
    });
  };

  const goToFavourites = () => {
    // navigation.navigate("FavouritesScreen")
    navigation.navigate("FavouritesScreen", {
      param1: currentUser?.email,
    });
  };

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert("Error when logging out"));
  };

  const goToFaq = () => {
    // navigation.navigate("FavouritesScreen")
    navigation.navigate("Faq", {
      param1: currentUser?.email,
    });
  };

  const goToHome = () => {
    navigation.navigate("HomePageScreen", {
      username: currentUser?.email,
      param2: "",
      lan: "",
    });
  };

  const toggleView = () => {
    console.log(userView);
    if (userView == false) {
      // THIS IS THE PROBLEM
      // useState hooks aren't immediate, so doesn't update the userView value instantly
      setUserView(true);
      // This calls an updater to get the latest value
      setUserView((state) => {
        console.log(state);

        // attempt at using useEffect hook to update value
        // useEffect(() => {
        //   console.log(userView)
        // });

        //const hori = await axios.put("http://localhost:3000/users/setView/" + param1 + "/" + userView);
        axios
          .put("https://recipebackendyear3proj.herokuapp.com/users/setView/" + param1 + "/" + state)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        return state;
      });
    }
    if (userView == true) {
      setUserView(false);
      setUserView((state) => {
        console.log(state);

        // useEffect(() => {
        //   console.log(userView)
        // });
        //const vert = await axios.put("http://localhost:3000/users/setView/" + param1 + "/" + userView);
        axios
          .put("https://recipebackendyear3proj.herokuapp.com/users/setView/" + param1 + "/" + state)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        return state;
      });
    }
  };

  locales.setLanguage(locale);

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={[styles.heading, { marginBottom: 12 }, { marginTop: 20 }]}
          >
            {locales.changePassword}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: 400,
            }}
          >
            <TextInput
              placeholder={locales.email}
              ref={emailRef}
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={[
                globleStyles.input,
                {
                  margin: 10,
                  flexGrow: 2,
                  fontSize: 18,
                },
              ]}
            />
            <TouchableOpacity
              style={[globleStyles.button, { width: 100 }]}
              onPress={resetPassword}
            >
              <Text
                style={[globleStyles.button, globleStyles.buttonOutlineText]}
              >
                {locales.submit}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.line}></View>

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={goToCookingTimer}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {locales.cookingtimer}
            </Text>
          </TouchableOpacity>

          <View
            style={[styles.line, { marginBottom: 10 }, { marginTop: 9 }]}
          ></View>

          <Text
            style={[styles.heading, { marginBottom: 5 }, { marginTop: 15 }]}
          >
            {locales.horizontal}
          </Text>
          {/* <Switch
        style={styles.switch}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        onValueChange={toggleView()}
        value={userView}
      /> */}

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={toggleView}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {userView ? "Horizontal" : "Vertical"}
            </Text>
          </TouchableOpacity>

          {/* <button style={{width: 90}} onClick={toggleView}>
        
        <Text>{userView ? "Horizontal" : "Vertical"}</Text>
      </button> */}

          <View
            style={[styles.line, { marginBottom: 10 }, { marginTop: 9 }]}
          ></View>

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={goToPreferenceScreen}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {locales.preferences}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={goToDiet}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {locales.diets}
            </Text>
          </TouchableOpacity>

          <View style={styles.line}></View>

          <Text
            style={[styles.heading, { marginBottom: 15 }, { marginTop: 15 }]}
          >
            {locales.language}
          </Text>
          <Picker
            style={[
              globleStyles.buttonOutlineText,
              {
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#A7D2CB",
                border: "none",
                width: 200,
              },
            ]}
            onValueChange={(val) => onSubmit(val)}
          >
            <Picker.Item label='English' value='en' />
            <Picker.Item label='Spanish' value='es' />
            <Picker.Item label='Chinese' value='cn' />
            <Picker.Item label='French' value='fr' />
          </Picker>

          <View style={styles.line}></View>

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={goToFaq}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {locales.faq}
            </Text>
          </TouchableOpacity>

          <View style={styles.line}></View>

          <TouchableOpacity
            style={[globleStyles.button, styles.button]}
            onPress={signOut}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              {locales.logout}
            </Text>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <View style={styles.line}></View>
          <View style={styles.line}></View>
        </View>
      </ScrollView>

      <View>
        <NavigationBar
          homeNav={goToHome}
          fridgeNav={goToFridge}
          favNav={goToFavourites}
          setNav={goToSettings}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    width: 200,
    marginTop: 20,
  },

  heading: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  switch: {
    marginBottom: 20,
    width: 60,
    height: 30,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 400,
    marginTop: 20,
  },
});
