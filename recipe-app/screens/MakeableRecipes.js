import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useAuth, signOut } from "../firebase";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Avatar } from "react-native-elements";

const makeableRecipes = ({ navigation, route }) => {
  const { param1, param2, param3 } = route.params;
  const currentUser = useAuth();

  const [makeableData, setMakeableData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);
  //Within this useEffect a async function will be called to retrieve
  //an array with all the recipes the user can make based on their fridge
  useEffect(() => {
    //This function retrieves the object ID's of all the recipes the user can make
    console.log("MAKEABLERECIPES PAGE ERRORS");

    async function fetchMakeableRecipesData() {
      const query1 =
        "https://recipebackendyear3proj.herokuapp.com/users/makeable/" + param1;

      const request = await axios.get(query1);
      setMakeableData(request["data"]);
      console.log(request["data"]);
      //setSLD(request.data);
    }
    fetchMakeableRecipesData();

    //This function retreives information on all the recipes the user can make
    //This will be the basic information such as the name of the recipe, the image
    //When the recipe section is clicked/touched then the user will be directed to
    // the corresponding recipe screen
    //Develop another route within the API that will return an array of the
    // The necessary information
    async function fetchRecipesData() {
      const query2 =
        "https://recipebackendyear3proj.herokuapp.com/api/makeableRecipes/" +
        param1;

      const request = await axios.get(query2);
      setRecipesData(request["data"]);
      console.log(request["data"]);
      //setSLD(request.data);
    }
    fetchRecipesData();

    //I have
  }, []);

  //The function here renders each item that the flat list passes it

  const displayRecipeView = ({ item }) => {
    return (
      // Flat List Item
      // item.title.toUpperCase()
      // <Text style={styles.itemStyle} onPress={() => getItem(item)}>
      //   {item.id}
      //   {item.title}
      // </Text>
      <TouchableOpacity onPress={() => passRecipeID(item)}>
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

  const separateRecipeView = () => {
    return (
      <View>
        style=
        {{
          height: 0.2,
          width: "75%",
          backgroundColor: "#C8C8C8",
        }}
      </View>
    );
  };

  const passRecipeID = (item) => {
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
      //   param3: item.likes.length,
      param5: item.title,
    });
  };

  return (
    <View>
      <FlatList
        data={recipesData}
        keyExtractor={(index) => index.toString()}
        ItemSeparatorComponent={separateRecipeView}
        renderItem={displayRecipeView}
      />
    </View>
  );
};

export default makeableRecipes;

//Some other time
const styles = StyleSheet.create({
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
