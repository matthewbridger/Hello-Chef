import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Switch } from "react-native";
import { useAuth, signOut } from "../firebase";
import axios from "axios";
import { globleStyles } from "../styles/global";
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import { Checkbox } from "antd";

const PreferenceChecklist = ({ navigation, route }) => {
  const { param1, param2, param3 } = route.params;
  const currentUser = useAuth();

  const [peanutSelected, peanutsetSelection] = useState(false);
  const [fishSelected, fishSelection] = useState(false);
  const [eggsSelected, eggsSelection] = useState(false);
  const [wheatSelected, wheatSelection] = useState(false);
  const [soybeansSelected, soybeansSelection] = useState(false);
  const [shellfishSelected, shellSelection] = useState(false);
  const [treenutsSelected, treenutsSelection] = useState(false);
  const [milkSelected, milkSelection] = useState(false);
  const [halalSelected, halalSelection] = useState(false);
  const [hinduSelected, hinduSelection] = useState(false);

 
  const toggleSwitch = () => peanutsetSelection(previousState => !previousState);
  const toggleSwitch2 = () => fishSelection(previousState => !previousState);
  const toggleSwitch3 = () => eggsSelection(previousState => !previousState);
  const toggleSwitch4 = () => wheatSelection(previousState => !previousState);
  const toggleSwitch5 = () => soybeansSelection(previousState => !previousState);
  const toggleSwitch6 = () => shellSelection(previousState => !previousState);
  const toggleSwitch7 = () => treenutsSelection(previousState => !previousState);
  const toggleSwitch8 = () => milkSelection(previousState => !previousState);
  const toggleSwitch9 = () => halalSelection(previousState => !previousState);
  const toggleSwitch10 = () => hinduSelection(previousState => !previousState);
  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en"); // LINK TO PREFERENCES
  locales.setLanguage(locale);

  async function onSubmit(e) {
    e.preventDefault();
    //When we submit we want to pass the parameters to the backend so that they can be added to the
    //database
    const query =
      "http://localhost:5000/users/preferences/" +
      param1 +
      "/" +
      peanutSelected +
      "." +
      fishSelected +
      "." +
      eggsSelected +
      "." +
      wheatSelected +
      "." +
      soybeansSelected +
      "." +
      shellfishSelected +
      "." +
      treenutsSelected +
      "." +
      milkSelected +
      "." +
      halalSelected +
      "+" +
      hinduSelected;

    axios.put(query).then((res) => console.log(res.data));
  }

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
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkboxer}>
      <Text style={styles.text}>{locales.allergies}</Text>
      
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={peanutSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={peanutSelected}
      />
        <Text style={styles.label}>
          {locales.peanut} 
        </Text>
      </View>
      
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={fishSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch2}
        value={fishSelected}
      />
        <Text style={styles.label}>
          {locales.fish} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={eggsSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch3}
        value={eggsSelected}
      />
        <Text style={styles.label}>
          {locales.eggs} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={wheatSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch4}
        value={wheatSelected}
      />
        <Text style={styles.label}>
          {locales.wheat} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={soybeansSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch5}
        value={soybeansSelected}
      />
        <Text style={styles.label}>
          {locales.soybeans} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={shellfishSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch6}
        value={shellfishSelected}
      />
        <Text style={styles.label}>
          {locales.shell} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={treenutsSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch7}
        value={treenutsSelected}
      />
        <Text style={styles.label}>
          {locales.treenut} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={milkSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch8}
        value={milkSelected}
      />
        <Text style={styles.label}>
          {locales.milk} 
        </Text>
      </View>
      <View style={styles.line}></View>
      <Text style={styles.text2}>{locales.dietoptions}</Text>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={halalSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch9}
        value={halalSelected}
      />
        <Text style={styles.label}>
          {locales.halal} 
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={hinduSelected ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch10}
        value={hinduSelected}
      />
        <Text style={styles.label}>
          {locales.hindu} 
        </Text>
      </View>
      
      
      
      </View>
      

      <View style={{ marginTop: 800}}>
        <TouchableOpacity
          onPress={goToSettings}
          style={[globleStyles.button, styles.button]}
        >
          <Text
            style={[
              globleStyles.button,
              globleStyles.buttonOutlineText,
              styles.button,
            ]}
          >
            {locales.submit}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={skipToHomePage}
          style={[globleStyles.button, styles.button]}
        >
          <Text
            style={[
              globleStyles.button,
              globleStyles.buttonOutlineText,
              styles.button,
            ]}
          >
            {locales.home}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    
    
    
  );
};

//MILK , TREE NUTS, EGGS, FISH, WHEAT, SHELLFISH, SOYBEANS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    
    backgroundColor: "#A6CED4",
  },
  checkboxer:{
  flexDirection: "column",
  marginLeft: 300,

  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  checkboxer2:{
    flexDirection: "column",
    marginLeft: 300,
    marginBottom: 500,
    },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    width: 200,
    alignItems: "center",
  },

  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
    marginLeft: 500,
  },
  
  label: {
    margin: 8,
    fontSize: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 3,
  },
  text2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 400,
    marginTop: 5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 500,
    
    
    marginTop: 1,
    marginBottom: 5
  },
  button: {
    width: 200,
    fontSize: 18,
    backgroundColor: "#4D6897",
  },
});

export default PreferenceChecklist;
