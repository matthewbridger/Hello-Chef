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
  ScrollView,
} from "react-native";
import NavigationBar from "../NavigationBar";
import { useAuth, signOut } from "../firebase";
import RecipeList from "../components/RecipeList";
import { Avatar, SearchBar } from "react-native-elements";
import axios from "axios";
import { remove } from "../backend/models/user.model";
import { globleStyles } from "../styles/global";
import Item from "antd/lib/list/Item";
import LocalizedStrings from "react-localization";
import { data } from "../locale";
//import response  from "express"; // Gives an error

const FavouritesScreen = ({ navigation, route }) => {
  const { param1 } = route.params;
  const currentUser = useAuth();

  const title1 = [];

  const [likedMeals, setlikedMeals] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  locales.setLanguage(locale);
  const [search, setSearch] = useState("");

  useEffect(() => {
    //Need to acquire the number of likes the documnet current has

    //Get the users ingredeints
    //Find a way to get username from login screen
    //Maybe use REDUX

    const query =
      "https://recipebackendyear3proj.herokuapp.com/api/favourites/" + param1; // Going into users databse with the userID
    fetch(query)
      .then((response) => response.json())
      .then((responseJson) => {
        setlikedMeals(responseJson);
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  //async function reloadPage() {
  // const query =
  //   "https://recipebackendyear3proj.herokuapp.com/api/favourites/" + param1; // Going into users databse with the userID
  // fetch(query)
  //   .then((response) => response.json())
  //   .then((responseJson) => {
  //     setlikedMeals(responseJson);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  //}
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

  async function remove(recID) {
    const removeQuery =
      "https://recipebackendyear3proj.herokuapp.com/users/unliked/" +
      param1 +
      "/" +
      recID;
    axios.put(removeQuery).then(() => {
      navigation.replace("FavouritesScreen", {
        param1: currentUser?.email,
      });
    });
    //reloadPage();
    reloadP();
  }

  const reloadP = () => {
    navigation.replace("FavouritesScreen", {
      param1: param1,
      param2: "Hello1",
      param3: "",
    });
  };

  const FavouritesView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => getItem(item)}>
        <View
          style={{
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Avatar rounded size='large' source={{ uri: item.image }} />
          <View style={{ margin: 10 }}>
            <Text style={[styles.searchResultTitle]}> {item.title}</Text>
            {/* Attempt at description */}
          </View>
          <TouchableOpacity
            onPress={() => remove(item._id)}
            style={[styles.buttonOutlineText, styles.removeButton]}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getItem = (item) => {
    navigation.navigate("RecipeScreen", {
      param1: currentUser?.email,
      param2: item._id,
      param5: item.title,
    });
  };

  //Navigation functions
  const goToFridge = () => {
    navigation.navigate("FridgeScreen", {
      param1: currentUser?.email,
      param2: "Hello2",
    });
  };

  const goToFavourites = () => {
    navigation.navigate("FavouritesScreen", {
      param1: currentUser?.email,
    });
  };

  const goToHome = () => {
    navigation.navigate("HomePageScreen", {
      username: currentUser?.email,
    });
  };

  const goToSettings = () => {
    navigation.navigate("SettingsScreen", {
      param1: currentUser?.email,
    });
  };

  const goToRecentlyViewed = () => {
    navigation.navigate("RecentlyViewed", {
      param1: currentUser?.email,
    });
  };

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

  return (
    <View style={[styles.container]}>
      <View style={{ textAlign: "center", margin: 20 }}>
        <Text style={[globleStyles.headerStyle1]}>{locales.favourites}</Text>
        {/* <Text>Currently logged in as: {currentUser?.email} </Text> */}
        <TouchableOpacity onPress={goToRecentlyViewed}>
          <Text style={styles.buttonOutlineText}>View Recent Activity</Text>
        </TouchableOpacity>
      </View>

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
          keyExtractor={(index) => index}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={FavouritesView}
        />
      </View>

      {/* <View style={styles.header}>
        <FlatList
          data={likedMeals}
          keyExtractor={(index) => index}
          renderItem={FavouritesView}
        /> */}

      {/* </View> */}
      <NavigationBar
        homeNav={goToHome}
        fridgeNav={goToFridge}
        favNav={goToFavourites}
        setNav={goToSettings}
      />
    </View>
  );
};

export default FavouritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginTop: 5,
    padding: 2,
  },
  searchResultTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  header: {
    margin: 20,
    padding: 2,
  },
  removeButton: {
    textAlign: "right",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 21,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
