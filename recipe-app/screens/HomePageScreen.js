import { getAuth } from "@firebase/auth";
import React, { useState, useEffect } from "react";
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
import { useAuth, signOut } from "../firebase";
import { Avatar, SearchBar } from "react-native-elements";
import axios from "axios";
import { globleStyles } from "../styles/global.js";
import NavigationBar from "../NavigationBar";
import { data } from "../locale";
import LocalizedStrings from "react-localization";

const HomePageScreen = ({ navigation, route }) => {
  const { param1 } = route.params;

  const currentUser = useAuth();
  const auth = getAuth();
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [userPref, setUserPref] = useState([]);
  const [userFridge, setUserFridge] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en"); // LINK TO PREFERENCES
  locales.setLanguage(locale);

  useEffect(() => {
    //https://jsonplaceholder.typicode.com/posts\
    //Test api data ^
    // fetch("http://localhost:5000/recipe/")
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     setFilteredDataSource(responseJson);
    //     setMasterDataSource(responseJson);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    //Check the user exists
    //If the user doesn't exist then add them to the mongodb and the fridge
    async function checkUserExists() {

      




    }
    checkUserExists();
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
    // http://localhost:3000/
    // https://recipebackendyear3proj.herokuapp.com/
    fetch("https://recipebackendyear3proj.herokuapp.com/recipe/")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
    //Need to acquire the number of likes the documnet current has

    //Get the users ingredeints
    //Find a way to get username from login screen
    //Maybe use REDUX
  }, []);

  //console.log("Current language: " + locale);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  //Navigation methods
  const goToFridge = () => {
    navigation.navigate("FridgeScreen", {
      param1: currentUser?.email,
      param2: "Hello2",
      lan: "",
    });
  };

  const goToPreferenceScreen = () => {
    navigation.navigate("PreferenceScreen", {
      param1: currentUser?.email,
    });
  };

  const goToSettings = () => {
    navigation.navigate("SettingsScreen", {
      param1: currentUser?.email,
    });
  };

  const goToFavourites = () => {
    //navigation.navigate("FavouritesScreen");
    navigation.navigate("FavouritesScreen", {
      param1: currentUser?.email,
    });
  };

  const goToHome = () => {
    navigation.navigate("HomepageScreen", {
      param1: currentUser?.email,
    });
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      // item.title.toUpperCase()
      // <Text style={styles.itemStyle} onPress={() => getItem(item)}>
      //   {item.id}
      //   {item.title}
      // </Text>
      <TouchableOpacity onPress={() => getItem(item)}>
        <View
          style={{
            flexDirection: "row",
            padding: 13,
            alignItems: "center",
          }}
        >
          <Avatar rounded size='large' source={{ uri: item.image }} />
          <View style={{ margin: 10 }}>
            <Text style={[styles.searchResultTitle]}> {item.title}</Text>
            {/* Attempt at description */}
            <Text style={[styles.searchResultDesc]}> {item.Description}</Text>
            <Text style={[styles.searchResultDesc]}>
              {" "}
              Time to cook: {item.cookingTime}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  const getItem = (item) => {
    // Function for click on an item
    // alert(
    //   "Title : " +
    //     item.title +
    //     "\nIngredients: " +
    //     item.Ingredients +
    //     "\nLikes: " +
    //     item.likes.length
    // );

    navigation.navigate("RecipeScreen", {
      param1: currentUser?.email,
      param2: item._id,
      param3: item.likes.length,
      param5: item.title,
    });
  };

  //Code for handling sign out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert("Error when logging out"));
  };

  async function onSubmit(e) {
    e.preventDefault();
  }

  return (
    //Header, contains the log out button and tells user they are logged in as account name
    <View style={[styles.container]}>
      <View style={[styles.containerheader]}>
        {/* <View>
          <Text style={[globleStyles.headerStyle2]}>
            Currently logged in as: {currentUser?.email}{" "}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={[styles.logoutbutton, globleStyles.buttonOutline]}
          >
            <Text style={[globleStyles.button, globleStyles.buttonOutlineText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Search Bar*/}
      <View style={styles.searchContainer}>
        <SearchBar
          round
          lightTheme
          cancelButtonTitle='Cancel'
          searchIcon={{ size: 26 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={(text) => searchFilterFunction("")}
          placeholder={locales.search}
          value={search}
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>

      {/* <TouchableOpacity
        onPress={onSearch}
        style={[styles.logoutbutton, styles.buttonOutline]}
      >
        <Text style={[styles.button, styles.buttonOutlineText]}>Search</Text>
      </TouchableOpacity> */}

      {/* Go to Fridge Button */}
      {/* Navigation
      Probably could be exported from a component */}

      <NavigationBar
        homeNav={goToHome}
        fridgeNav={goToFridge}
        favNav={goToFavourites}
        setNav={goToSettings}
      />
    </View>
  );
};

export default HomePageScreen;

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 5,
    padding: 2,
  },
  inputContainer: {
    flex: 1,
    width: "80%",
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  buttonHomeScreen: {
    backgroundColor: "#A7D2CB",
    width: "20%",

    borderRadius: 20,
    margin: 10,
    alignItems: "center",
    textAlign: "center",
  },
  logoutbutton: {
    backgroundColor: "#A7D2CB",
    padding: 5,
    borderRadius: 50,
    borderRadius: 25,
    margin: 10,
    alignItems: "center",
    textAlign: "center",
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
  searchResultTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  searchResultDesc: {
    fontSize: 13,
    opacity: 0.8,
    color: "#000",
  },
});
