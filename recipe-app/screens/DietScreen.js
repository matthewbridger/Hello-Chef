import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../firebase";
import axios from "axios";
import { globleStyles } from "../styles/global";
import { data } from "../locale";
import LocalizedStrings from "react-localization";



  const Diet = ({ navigation, route }) => {
  const {param1} = route.params;
  const currentUser = useAuth();
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  locales.setLanguage(locale)
 
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

  const skipToHomePage = () => {
    navigation.navigate("HomePageScreen", {
      param1: currentUser?.email,
    });
  };

  const goToSettings = () => {
      navigation.navigate("SettingsScreen", {
        param1: currentUser?.email,
      })
};

  return (

   
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>  
      <Text style={styles.text}>{locales.paleo}</Text>
    <Text style={styles.short}>{locales.paleodef}</Text>
      <View style={styles.line}></View>
      <Text style={styles.text}>{locales.vegan}</Text>
      <Text style={styles.short}>{locales.vegandef}</Text>
      <View style={styles.line}></View>
      <Text style={styles.text}>{locales.atkins}</Text>
      <Text style={styles.short}>{locales.atkinsdef}</Text>
      <View style={styles.line}></View>
      
      
      
      <View style={{marginTop: 20}}>
        <TouchableOpacity onPress={goToSettings} style={[globleStyles.button, styles.button]}>
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText, styles.button]}>{locales.settings}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToHomePage} style={[globleStyles.button, styles.button]}>
          <Text style={[globleStyles.button, globleStyles.buttonOutlineText, styles.button]}>{locales.home}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
    
    
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#A6CED4',
  },

  short: {
    fontSize: 18,

  },

  scrollView: {
   marginHorizontal: 10,
    
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: 200,
    alignItems: "center",
  },
  checkbox: {
    width: 30,
    height: 30,
  },
  label: {
    margin: 8,
    fontSize: 20,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 400,
    marginTop: 20
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 200,
    fontSize: 18,
    backgroundColor: '#4D6897',
  },
});

export default Diet;