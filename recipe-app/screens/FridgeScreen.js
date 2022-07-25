import React, { useState, useRef, useEffect } from "react";
//import DatePicker from "react-datepicker";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";

import axios from "axios";
import { useAuth, signOut } from "../firebase";
import AddIngredientScreen from "./AddIngredientScreen";
import NavigationBar from "../NavigationBar";
import { globleStyles } from "../styles/global";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import { DataTable, IconButton, Colors } from "react-native-paper";
import { Touchable } from "react-native";

const FridgeScreen = ({ navigation, route }) => {
  const { param1, param2, param3 } = route.params;

  const currentUser = useAuth();
  const IngredientUser = currentUser?.email;
  const [user, setUser] = useState("");
  const userRef = useRef();

  const [filteredFridgeContents, setFridgeFilter] = useState([]);
  const [fridgeContents, setFridgeContents] = useState([]);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  locales.setLanguage(locale);

  useEffect(() => {
    console.log("FRIDGE SCREEN ERRORS");
    // const query =
    //   "https://recipebackendyear3proj.herokuapp.com/fridge/" + param1;
    // //console.log("Test " + Math.random());
    // axios.get(query).then((response) => {
    //   setFridgeFilter(response["data"]);
    //   console.log(response["data"]);
    // });
    // http://localhost:3000/
    // https://recipebackendyear3proj.herokuapp.com/
    fetch("https://recipebackendyear3proj.herokuapp.com/fridge/" + param1) // matt - param2 is the recipe ID
      .then((response) => response.json())
      .then((responseJson) => {
        console.log([responseJson.ingredients]);
        setFridgeContents([responseJson.ingredients]);
        // Testing dynamic update
        //console.log(fridgeContents.splice())
      })
      .catch((error) => {
        console.error(error);
      });
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

  function getUserFridge() {
    // var array = Object.values(fridgeContents).toString();
    // var arr = array.split(",");
    // setFridgeContents(arr);
    // console.log("HERE" + filteredFridgeContents);
    showAllParams();
  }

  const goToCalender = () => {
    navigation.navigate("CalenderScreen", {
      param1: currentUser?.email,
      param2: "Hello2",
    });
  };

  function showAllParams() {
    console.log("All params");
    console.log(param1);
    console.log(param2);
    console.log(param3);
  }
  async function save() {}

  const IngredientView = ({ item }) => {
    console.log("Flatlist: " + item);
    return (
      <View key={item["ingredientID"]}>
        <DataTable.Row key={item.index}>
          <DataTable.Cell>{item.ingredientName}</DataTable.Cell>
          <DataTable.Cell>{item.ingredientWeight}</DataTable.Cell>
          <DataTable.Cell>{item.ingredientExpiry}</DataTable.Cell>
          <DataTable.Cell>
            <IconButton
              icon='close-circle-outline'
              color={Colors.red500}
              size={20}
              onPress={() => remove(item.ingredientName)}
            />
          </DataTable.Cell>
        </DataTable.Row>
      </View>
    );
  };

  // Parse item name/id
  // Need a way to determine exact ingredient
  async function remove(itemName) {
    console.log(itemName);
    const removeQuery =
      "https://recipebackendyear3proj.herokuapp.com/fridge/remove/" +
      param1 +
      "/" +
      itemName;
    axios.put(removeQuery);
    console.log(removeQuery);
    //updateState(itemName);
    // Reloads page
    // window.location.reload(false);
    reloadPage();
  }

  const reloadPage = () => {
    navigation.replace("FridgeScreen", {
      param1: param1,
      param2: "Hello1",
      param3: "",
    });
  };

  async function updateState(i) {
    // fetch("https://recipebackendyear3proj.herokuapp.com/fridge/" + param1) // matt - param2 is the recipe ID
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log([responseJson.ingredients]);
    //     setFridgeContents([responseJson.ingredients]);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //  });
    var updatedItems = fridgeContents;
    setFridgeContents(updatedItems.splice(i, updatedItems));
  }

  //Navigation functions
  const goToFridge = () => {
    navigation.navigate("FridgeScreen", {
      param1: currentUser?.email,
      param2: "Hello2",
    });
  };

  const goToFavourites = () => {
    // navigation.navigate("FavouritesScreen")
    navigation.navigate("FavouritesScreen", {
      param1: currentUser?.email,
      param2: "Hello2",
    });
  };

  const goToHome = () => {
    navigation.navigate("HomePageScreen", {
      username: currentUser?.email,
      param2: "",
      lan: "",
    });
  };

  const goToSettings = () => {
    navigation.navigate("SettingsScreen", {
      param1: currentUser?.email,
    });
  };

  const goToShoppingList = () => {
    navigation.navigate("ShoppingList", {
      param1: currentUser?.email,
    });
  };

  const goToAddIng = () => {
    navigation.navigate("AddIngred", {
      param1: currentUser?.email,
      qrData: "",
      useQR: "",
    });
  };

  const goToMakeableRecipes = () => {
    navigation.navigate("MakeableRecipes", {
      param1: currentUser?.email,
    });
  };

  return (
    <View style={[styles.container]}>
      {/* The contents of the users fridge */}
      {/* <Text>{param1}</Text> */}
      <View style={styles.flatList}>
        <Text style={[globleStyles.headerStyle1]}>{locales.fridge}</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>{locales.ingredient}</DataTable.Title>
            <DataTable.Title>{locales.weight}</DataTable.Title>
            <DataTable.Title>{locales.expiryDate}</DataTable.Title>
            <DataTable.Title></DataTable.Title>
          </DataTable.Header>
          <FlatList
            data={fridgeContents[0]}
            keyExtractor={(item, index) => item._id}
            //ItemSeparatorComponent={ItemSeparatorView}
            renderItem={IngredientView}
          />
        </DataTable>
        <Text>{console.log(fridgeContents[0])}</Text>
      </View>

      <View>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("QRScanner")}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
                {locales.scan}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => goToAddIng()}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
                {locales.addIngredient}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => goToCalender()}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
                {locales.calendar}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => goToShoppingList()}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
                {locales.shopping}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => goToMakeableRecipes()}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
                {locales.make}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => getUserFridge()}
              style={styles.button}
            >
              <Text style={[styles.button, styles.buttonOutlineText]}>
              {locales.refresh}
              </Text>
            </TouchableOpacity>
          </View> */}
          {/* <View>
            <Text></Text>
          </View> */}
        </View>
      </View>
      {/* Navigation */}
      <NavigationBar
        homeNav={goToHome}
        fridgeNav={goToFridge}
        favNav={goToFavourites}
        setNav={goToSettings}
      />
    </View>
  );
};

export default FridgeScreen;

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
  flatList: {
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
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 10,
  },
  button2: {
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#A7D2CB",
    width: "60%",
    // padding: 5,
    // borderRadius: 50,
    borderRadius: 20,
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
  containerheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerbottom: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#A7D2CB",
  },
  container: {
    flex: 1,
  },
  buttonHomeScreen: {
    backgroundColor: "#A7D2CB",
    width: "20%",
  },
});
