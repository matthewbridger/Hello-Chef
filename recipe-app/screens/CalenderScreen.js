import React, { useState, useRef, useEffect } from "react";
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
import { globleStyles } from "../styles/global";
import WeekDay from "../components/WeekDay";
import RecipeList from "../components/RecipeList";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import axios from "axios";

const CalenderScreen = ({ navigation, route }) => {
  const { param1 } = route.params;
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  const [calenders, setCalenders] = useState([]);
  locales.setLanguage(locale);
  useEffect(() => {
    fetch(
      "https://recipebackendyear3proj.herokuapp.com/users/calendar/get/" +
        param1
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setCalenders(responseJson.calendar);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("Test");
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

  return (
    <View style={[styles.container]}>
      <Text style={styles.sectionTitle}>{locales.calendar}</Text>

      <WeekDay days={locales.monday} meals={calenders ? calenders[0] : []} />
      <WeekDay days={locales.tuesday} meals={calenders ? calenders[1] : []} />
      <WeekDay days={locales.wednesday} meals={calenders ? calenders[2] : []} />
      <WeekDay days={locales.thursday} meals={calenders ? calenders[3] : []} />
      <WeekDay days={locales.friday} meals={calenders ? calenders[4] : []} />
      <WeekDay days={locales.saturday} meals={calenders ? calenders[5] : []} />
      <WeekDay days={locales.sunday} meals={calenders ? calenders[6] : []} />
    </View>
  );
};
export default CalenderScreen;

{
  /* <WeekDay days = {'Tuesday'}/>
        <WeekDay days = {'Wednesday'}/>
        <WeekDay days = {'Thursday'}/>
        <WeekDay days = {'Friday'}/>
        <WeekDay days = {'Saturday'}/>
        <WeekDay days = {'Sunday'}/> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  day: {
    backgroundColor: "grey",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  itemLeft: {
    flexDirection: "row",
    alignSelf: "flex-start",
    flexWrap: "wrap",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  weekContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
});
