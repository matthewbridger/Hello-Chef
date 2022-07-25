import { getAuth } from "@firebase/auth";
import React, { useState, useEffect, useCallback } from "react";
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
  ImageBackground,
  Button,
  Alert,
} from "react-native";
import { useAuth, signOut } from "../firebase";
import { Avatar, SearchBar } from "react-native-elements";
import axios from "axios";
import LikeButton from "../components/LikeButton";
//import Video from "react-native-video";
import { Video, AVPlaybackStatus } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";
import { setMaxListeners } from "../backend/models/recipe.model";
import { SwiperFlatList } from "react-native-swiper-flatlist";
//import Swiper from 'react-native-swiper';
//import Tts from 'react-native-tts';
import * as Speech from 'expo-speech';
import { TouchableHighlight } from "react-native";


const RecipeScreen = ({ navigation, route }) => {
  const { param1, param2, param3, param4, param5, servingNum } = route.params;
  const [recipeContents, setRecipeContents] = useState([]);
  const [likeData, setLikeData] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([]);
  const [likes, setLikes] = useState();
  const [hView, sethView] = useState([]);
  // Number of people serving (aka multiplier)
  const [servings, setServings] = useState(1);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  //const [currentVideoId, setCurrentVideoID] = useState
  console.log(param1);
  const [playing, setPlaying] = useState(false);
  var count;
  useEffect(() => {
    //alert(param3);
    setLikes(param3); // - matt adds the lenngth of likes array into the variable
    // fetch("https://recipebackendyear3proj.herokuapp.com/recipe/" + param2) // matt - param2 is the recipe ID
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log([responseJson.steps]);
    //     count = Object.keys(responseJson.steps).length;
    //     console.log(count);
    //     setRecipeContents([responseJson]);
    //     setRecipeSteps([responseJson.steps]);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    //http://129.12.135.20:5000/
    // http://localhost:3000/
    // https://recipebackendyear3proj.herokuapp.com/recipe/
    fetch("https://recipebackendyear3proj.herokuapp.com/recipe/" + param2) // matt - param2 is the recipe ID
      .then((response) => response.json())
      .then((responseJson) => {
        console.log([responseJson.steps]);
        count = Object.keys(responseJson.steps).length;
        console.log(count);
        setRecipeIngredients([responseJson.ingredients]);
        console.log([responseJson.ingredients]);
        setRecipeContents([responseJson]);
        // adding spacers
        setRecipeSteps([{key: "leftSpacer"}, {key: "banner"}, {key: "ingredients"}, ...responseJson.steps, {key: "rightSpacer"}]);
      })
      .catch((error) => {
        console.error(error);
      });
    setLikeData([param1, param2, param3, param4, param5]);
    console.log("test");
  }, []);

  useEffect(() => {
    fetch("https://recipebackendyear3proj.herokuapp.com/users/setView/" + param1) 
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.horizontalView);
        sethView(responseJson.horizontalView);
      })
      .catch((error) => {
        console.error(error); 
      });
      axios.put("https://recipebackendyear3proj.herokuapp.com/users/recentlyViewed/add/" + param1 + "/" + param2); 
  }, []);

  // Sets the multi to current multi
  // useEffect(() => {
  //   setMulti(JSON.parse(window.localStorage.getItem('multi')));
  // }, []);

  // useEffect(() => {
  //   window.localStorage.setItem('multi', multi);
  // }, [multi]);


  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const getLikes = () => {
    console.log("HEARE " + recipeContents.data);
    // return likes;
  };

  const speak = text => {
    Speech.speak(text);
  };

  const win = Dimensions.get("window");
  const ttsText = "";


  // const reloadPage = () => {
  //   navigation.replace("RecipeScreen", {
  //     param1: param1,
  //     param2: param2,
  //     param3: param3,
  //     param4: param4,
  //     param5: param5,
  //     servingNum: servings,
  //   });
  //   console.log(servingNum)
  // };
  
  // async function updateServing() {
  //   console.log(servings)
  //   reloadPage();
  // }

  const ingredientList = ({ item }) => {
    return (
      <View>
        <Text style={styles.ingredientText}>• {servings * item.amount}{item.measurement} {item.name}</Text>
      </View>
    );
  };

  const renderView = ({ item }) => {
    return (
      <View style={styles.container1}>
        {/* Banner and Title/Details */}
        <ImageBackground style={styles.banner} source={{ uri: item.image }}>
          <View style={styles.leftBlock2}>
            <Text style={styles.leftText}>{item.title}</Text>
          </View>
          <View style={styles.rightBlock}>
            <Text style={styles.rightText}>
              Cooking Time: {item.cookingTime}
            </Text>
            <Text style={styles.rightText}>Likes: {likes}</Text>
            <LikeButton parentToChild={likeData} />
          </View>
        </ImageBackground>
        {/* Ingredients */}
        <View style = {styles.ingredientsContainer}>
          <Text style={[styles.ingredientTitleText]}>Ingredients</Text>
          <FlatList
            data={recipeIngredients[0]}
            keyExtractor={(item, index) => item._id}
            renderItem={ingredientList}
          />
        </View>
        {/* Number of servings */}
        <View style = {styles.servingsContainer}>
          <Text style = {{fontSize:20, fontWeight:"bold"}}>Number of Servings</Text>
          <TextInput
            placeholder="Number of people"
            onChangeText = {(text) => setServings(text)} // needs to check its not 0
            style = {styles.input}
          />
        </View>
        {/* Steps */}
        <Text>{console.log(item.steps)}</Text>
          <FlatList
            data={item.steps}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(step, index) => {
              return (
                <View style={{width: cardSize}}>
                  <View style={{alignItems: "center"}}>
                    <Text>{console.log(step.item)}</Text>
                    <Text style={styles.stepTitleText}>Step {step.item[0]}:</Text>
                    <Text style={styles.stepText}>{step.item[1]}</Text>
                    {/* tts feature */}
                    {/* <TouchableHighlight onPress={()=> handleVoice()}>
                      <Text>SPEAK</Text>
                    </TouchableHighlight> */}
                    <Button title="TTS" onPress={() => speak(step.item[1])} />
                    <View style = {{marginTop:20}}>
                      <YoutubePlayer
                        height={cardSize * 0.5}
                        width={width * 0.8}
                        play={playing}
                        mute={true}
                        videoId={step.item[2]}
                        onChangeState={onStateChange}
                      />
                    </View>
                  </View>
                </View>
              );  
            }}
          />
        </View>
    );
  };

  const renderSwipeView = ({ item }) => {
    console.log(recipeContents)
    return(
      <FlatList
        data={recipeSteps}
        // Only for phone, otherwise can't scroll on pc
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToInterval={cardSize}
        decelerationRate={0}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          console.log(item)
          if (item.key == "banner") {
            return (
              <View style={{width: cardSize}}>
                <View style={styles.child}>
                  {/* <Text>{recipeContents[0].title}</Text> */}
                  <ImageBackground style={styles.banner2} source={{ uri: recipeContents[0].image }}>
                    <View style={styles.leftBlock2}>
                      <Text style={styles.leftText}>{recipeContents[0].title}</Text>
                    </View>
                    <View style={styles.rightBlock}>
                      <Text style={styles.rightText}>
                        Cooking Time: {recipeContents[0].cookingTime}
                      </Text>
                      <LikeButton parentToChild={likeData} />
                    </View>
                  </ImageBackground>
                </View>
              </View>
            );
          } else if (item.key == "ingredients") {
              return (
                <View style={{width: cardSize}}>
                  <View style={styles.child}>
                    <Text style={[styles.ingredientTitleText]}>Ingredients</Text>
                    <FlatList
                      data={recipeIngredients[0]}
                      keyExtractor={(item, index) => item._id}
                      renderItem={ingredientList}
                    />
                    <View style = {styles.servingsContainer}>
                      <Text style = {{fontSize:20, fontWeight:"bold"}}>Number of Servings</Text>
                      <TextInput
                        placeholder="Number of people"
                        onChangeText = {(text) => setServings(text)} // needs to check its not 0
                        style = {styles.input}
                      />
                    </View>
                  </View>
                </View>
              );
          // Checks if the spacer object is a element by checking the array value
          // If not it will place a invisible block on the starting left side so the object will be centered
          // Then returns the rest of the cards
          } else if (!item[0]) {
              return (
                <View style={{width: spacerSize, height: 200}}/>
              );
          } else {
              return (
                <View style={{width: cardSize}}>
                  <View style={styles.child}>
                      <Text>{console.log(item)}</Text>
                      {/* <Text>{console.log(v[1])}</Text>
                      <Text>{console.log(v[2])}</Text> */}
                      <Text style={styles.stepTitleText}>Step {item[0]}:</Text>
                      <Text style={styles.stepText}>{item[1]}</Text>
                      <Button title="TTS" onPress={() => speak(item[1])} />
                      <View style = {{marginTop:20}}>
                        <YoutubePlayer
                          height={cardSize * 0.5}
                          width={width * 0.8}
                          //resizeMode= {cover}
                          play={playing}
                          mute={true}
                          videoId={item[2]}
                          onChangeState={onStateChange}
                        />
                      </View>
                  </View>    
                </View>
              );
          }
        }}
      />     
    );     
  };

  if (hView) {
    return (
      <View style={styles.container2}>
        {/* New Swiper View */}
        {/* <FlatList
          data={recipeSteps}
          horizontal
          snapToInterval={cardSize}
          decelerationRate={0}
          keyExtractor={(item) => item._id}
          renderItem={renderSwipeView}
        />         */}
        <FlatList
          data={recipeContents}
          keyExtractor={(item) => item._id}
          renderItem={renderSwipeView}
        />
      </View>
    )
  } else {
    return (
      <View style={styles.container2}>
        <FlatList
          data={recipeContents}
          keyExtractor={(item) => item._id}
          renderItem={renderView}
        />
      </View>
    );
  }

  // return (
  //   <View style={styles.container2}>
  //     <FlatList
  //       data={recipeContents}
  //       keyExtractor={(item) => item._id}
  //       renderItem={renderView}
  //     />

  //     {/* New Swiper View */}
  //     <FlatList
  //       data={recipeSteps}
  //       horizontal
  //       snapToInterval={cardSize}
  //       decelerationRate={0}
  //       keyExtractor={(item) => item._id}
  //       renderItem={renderSwipeView}
  //     />
  //     {/* Swiper View */}
  //     {/* <SwiperFlatList
  //       index={0}
  //       showPagination
  //       data={recipeSteps[0]}
  //       renderItem={renderSwipeView}
  //     /> */}
  //   </View>
  // );
};

export default RecipeScreen;

const { width, height } = Dimensions.get("window");
// Width of each card
const cardSize = width * 0.98;
// Width of the invisible spacer blockers
const spacerSize = (width - cardSize) / 2;
const styles = StyleSheet.create({
  // For vertical view
  container1: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
    // width: "100%",
  },
  // For horizontal view
  container2: {
    flex: 1,
  },
  ingredientsContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  servingsContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  stepsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    width: width,
    height: 250,
  },
  banner2: {
    width: cardSize * 0.95,
    height: 250,
  },
  leftBlock: {
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,.5)",
    color: "white",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  leftBlock2: {
    borderRadius: 10,
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,.5)",
    color: "white",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  rightBlock: {
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,.5)",
    color: "white",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  leftText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  rightText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
  ingredientTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  ingredientText: {
    fontSize: 15,
  },
  stepTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    // textAlign: "center",
  },
  stepText: {
    fontSize: 15,
    padding: 15,
  },
  testSwiper: {
    width: 400,
    height: 1000,
    justifyContent: "center",
  },
  testText: {
    fontSize: width * 0.5,
    textAlign: "center",
  },
  wrapper: {},
  slide: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
    width: "100%",
    // flexWrap: "wrap",
  },
  child: { 
    marginHorizontal: 10, 
    padding: 10 * 2,
    alignItems:"center",
    backgroundColor: "#FFFFEC",
    borderRadius: 34,
  },
  swiperContainer: { flex: 1, backgroundColor: "white" },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
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
});
