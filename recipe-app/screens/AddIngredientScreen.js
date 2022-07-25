import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Picker,
} from "react-native";
import { globleStyles } from "../styles/global.js";
import axios from "axios";
import { useAuth } from "../firebase";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
//We add navigation to the start of this function call so that we can change between screens

const AddIngredientScreen = ({ route, navigation, props }) => {
  const currentUser = useAuth();
  const {param1, qrData, useQR} = route.params;

  const [user, setUser] = useState("");
  const userRef = useRef();
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en"); // LINK TO PREFERENCES
  locales.setLanguage(locale);

  const [IngredientID, setIngredID] = useState("");
  const [IngredientName, setIngred] = useState("");
  const [IngredientDescription, setIngredDescription] = useState("");
  const [IngredientWeight, setIngredWeight] = useState("");
  const [IngredientExpDate, setIngredExpDate] = useState("");
  const [qrStatus, setQrStatus] = useState(useQR);
  //const [IngredientUser, setIngredUser] = useState("");

  const IngredientIDRef = useRef();
  const IngredientNameRef = useRef();
  const IngredientDescRef = useRef();
  const IngredientWeightRef = useRef();
  const IngredientExpDateRef = useRef();
  const IngredientUser = currentUser?.email;

  useEffect(() => {
    useTheQRData();
  }, [qrStatus]);

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

  async function onSubmit(e) {
    e.preventDefault();
    //console.log("HERERERERERER:" + currentUser?.email);
    //
    //How to update a specific persons fridge
    const ingredient = {
      ingredientID: IngredientID,
      ingredient: IngredientName,
      description: IngredientDescription,
      weight: IngredientWeight,
      expiryDate: IngredientExpDate,
      user: IngredientUser,
    };
    console.log(ingredient);
    // window.location = "/";
    // axios
    //   .post("http://localhost:5000/ingredient/add", ingredient)
    //   .then((res) => console.log(res.data));

    //ADD TO THE CORRECT FRIDGE
    // const addToFridge = {
    //   username: currentUser,
    //   $push: { ingredients: IngredientName },
    // };
    // axios
    //   .post(
    //     "http://localhost:5000/fridge/update/61a86fdcc5c1152f9e0ebd8c",
    //     addToFridge
    //   )
    //   .then((res) => console.log(res.data));
    axios
      .put(
        //http://localhost:3000/
        //https://recipebackendyear3proj.herokuapp.com/fridge/update/
        "https://recipebackendyear3proj.herokuapp.com/fridge/update/" +
          IngredientUser +
          "/" +
          IngredientName +
          "." +
          IngredientExpDate +
          "." +
          IngredientWeight
      )
      .then((res) => console.log(res.data));
      
      //Clears the feilds
      clearText();
      

    //Create a fridge when the user signs in
    //Add the users objectid/email as a
  }

  //Navigation functions
  const goToFridge = () => {
    navigation.replace("FridgeScreen", {
      param1: currentUser?.email,
      param2: "Hello1",
      param3: "",
    });
  };


  const clearText = () => {
    //Keyboard.dismiss();
        setIngred('');
        setIngredWeight('');
        setIngredExpDate('');
       
  };


  const useTheQRData = () => {
    if(qrStatus){
      setIngred(qrData);
      setQrStatus(status => !status);
    }
  }

  return (
    <View style={styles.inputContainer}>
        <Text style={[globleStyles.headerStyle1]}>
          {locales.addIngredients}
        </Text>
        {/* <Text>IngredientID</Text>
        <TextInput
          placeholder='IngredientID'
          ref={IngredientIDRef}
          value={IngredientID}
          onChangeText={(text) => setIngredID(text)}
          style={styles.input}
        /> */}
        <Text>{locales.ingredient}</Text>
        <TextInput
          placeholder={locales.ingredientName}
          ref={IngredientNameRef}
          onChangeText={(text) => setIngred(text)}
          value={IngredientName}
          style={styles.input}
        />
        {/* <Text>Description</Text> */}
        {/* <TextInput
          placeholder='IngredientDescription'
          ref={IngredientDescRef}
          value={IngredientDescription}
          onChangeText={(text) => setIngredDescription(text)}
          style={styles.input}
        /> */}
        <Text>{locales.weight}</Text>
        <TextInput
          placeholder={locales.ingredientWeight}
          ref={IngredientWeightRef}
          value={IngredientWeight}
          onChangeText={(text) => setIngredWeight(text)}
          style={styles.input}
        />

        


        <Text>{locales.expiryDate}</Text>
        <TextInput
          placeholder={locales.date}
          ref={IngredientExpDateRef}
          value={IngredientExpDate}
          onChangeText={(text) => setIngredExpDate(text)}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onSubmit} style={styles.button}>
            <Text style={[styles.button, styles.buttonOutlineText]}>
              {locales.addIngredient}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={goToFridge} style={styles.button}>
            <Text style={[styles.button, styles.buttonOutlineText]}>
              {locales.back}
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

export default AddIngredientScreen;

const styles = StyleSheet.create({
  //fridgeImage: {
  //width: win.width,
  //height: 500,
  //},
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
