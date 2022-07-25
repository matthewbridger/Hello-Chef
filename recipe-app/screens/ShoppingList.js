import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { globleStyles } from "../styles/global.js";
import axios from "axios";
import { DataTable, IconButton, Colors } from "react-native-paper";
import { useAuth } from "../firebase";
import { data } from "../locale";
import LocalizedStrings from "react-localization";


const ShoppingList = ({ route, navigation }) => {
  //Collecting the parameters that is being passsed through
  //param1 contains the current username of the user logged in
  const { param1 } = route.params;
  const [shoppingLData, setSLD] = useState([]);
  const [addItem, setAddItem] = useState([]);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  locales.setLanguage(locale);
  useEffect(() => {
    console.log("SHOPPING LIST ERRORS");
    async function fetchData() {
      const query =
        "https://recipebackendyear3proj.herokuapp.com/users/shoppinglist/get/" +
        param1;
      const request = await axios.get(query);
      console.log(request["data"]["shoppingList"]);
      setSLD(request["data"]["shoppingList"]);
      // return request;
    }
    fetchData();
  }, []);

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

  // console.log(shoppingLData);

  const displayShoppingList = ({ item }) => {
    // console.log("Flatlist: " + item);
    return (
      <View>
        {/* <DataTable.Row key={item.index}>
          <DataTable.Cell> */}
        <Text style={styles.text1}>{item}</Text>
        <IconButton
          icon='close-circle-outline'
          color={Colors.red500}
          size={20}
          onPress={() => remove(item)}
        />
        {/* </DataTable.Cell>
        </DataTable.Row> */}
      </View>
    );
  };

  async function remove(itemName) {
    // console.log(itemName);
    const removeQuery =
      "https://recipebackendyear3proj.herokuapp.com/users/shoppinglist/remove/" +
      param1 +
      "/" +
      itemName;
    const request = await axios
      .put(removeQuery)
      .catch((err) => console.log(err));
    //console.log(removeQuery);
    //updateState(itemName);
    // Reloads page
    // window.location.reload(false);
    reloadPage();
  }

  async function add(itemName) {
    const query =
      "https://recipebackendyear3proj.herokuapp.com/users/shoppinglist/add/" +
      param1 +
      "/" +
      itemName;
    const request = await axios.put(query).catch((err) => console.log(err));
    // console.log(request);

    reloadPage();
  }

  const reloadPage = () => {
    navigation.replace("ShoppingList", {
      param1: param1,
      param3: "",
    });
  };

  const separateRecipeView = () => {
    return (
      <View
        style={{
          height: 0.2,
          width: "75%",
          backgroundColor: "#C8C8C8",
        }}
      ></View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={shoppingLData}
        keyExtractor={(item) => item.toString()}
        ItemSeparatorComponent={separateRecipeView}
        renderItem={displayShoppingList}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setAddItem}
          value={addItem}
          placeholder={locales.enteritem}
        />
        <TouchableOpacity style={styles.button} onPress={() => add(addItem)}>
          <Text styles={[styles.text2, styles.buttonOutline]}>{locales.additem}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
  },

  button: {
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#A7D2CB",
    width: "60%",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 0,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  text1: {
    textAlignVertical: "center",
    fontSize: 16,
  },
  text2: {
    textAlignVertical: "center",
    backgroundColor: "#A7D2CB",
    fontWeight: "700",
    fontSize: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  shoppingText: {
    fontSize: 25,
    textAlign: "center",
  },
});
export default ShoppingList;
