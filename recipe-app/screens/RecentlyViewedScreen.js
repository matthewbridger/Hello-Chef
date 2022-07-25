import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";
import { globleStyles } from "../styles/global.js";
import axios from "axios";
import { useAuth } from "../firebase";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import { Avatar, SearchBar } from "react-native-elements";




const RecentlyViewed = ( {navigation,route} ) => {
    const { param1 } = route.params;
    const currentUser = useAuth();
    
  const [viewedRecipes, setViewedRecipes] = useState([]);


    useEffect(() => {
      const query =
      "https://recipebackendyear3proj.herokuapp.com/api/recentlyViewed/" + param1; // Going into users databse with the userID
    fetch(query)
      .then((response) => response.json())
      .then((responseJson) => {
        setViewedRecipes(responseJson);
        
      })
      .catch((error) => {
        console.error(error);
      });
        
        
      }, []);

      async function clearHistory() {
      axios.put("https://recipebackendyear3proj.herokuapp.com/users/recentlyViewed/clear/" + param1)
      .then(console.log("History Cleared"));

      navigation.replace("RecentlyViewed", {
        param1: param1,
        param2: "Hello1",
        param3: "",
      });
  
    
    };

    const HistoryView = ({ item }) => {
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
      navigation.navigate("RecipeScreen", {
        param1: currentUser?.email,
        param2: item._id,
        param5: item.title,
      });
    };
    
    return (
      <View >
      <View style={{ textAlign: "center", margin: 20 }}>
          
            <Text style={[globleStyles.headerStyle1]}>Recently Viewed</Text>
            <TouchableOpacity onPress={clearHistory}><Text style={styles.buttonOutlineText}>Clear Activity</Text></TouchableOpacity>
      </View>
      <FlatList
          data={viewedRecipes}
          keyExtractor={(index) => index}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={HistoryView}
        />
      </View>
    )
};



export default RecentlyViewed;

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    }, 
    buttonOutlineText: {
        color: "black",
        fontWeight: "700",
        fontSize: 16,
      },
    
  

  

  


});