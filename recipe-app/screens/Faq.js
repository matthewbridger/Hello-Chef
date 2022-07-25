import React, { useState, Component } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { globleStyles } from "../styles/global";
import { useAuth } from "../firebase";
import axios from "axios";
//import for the animation of Collapse and Expand
import * as Animatable from "react-native-animatable";
//import for the Accordion view
import Accordion from "react-native-collapsible/Accordion";
import { data } from "../locale";
import LocalizedStrings from "react-localization";

const faqPopup = [
  {
    title: "Can I Inform the App of any allergies I might have?",
    content: "You can proceed to the preferences page in Settings",
  },
  {
    title: "How do I use the Barcode scanner?",
    content: "With your phone you can personally scan items with the QR code",
  },
  {
    title: "Where can I see my favourited recipes?",
    content:
      "Simply navigate to the favourites page and you should see all the recipes you liked!",
  },
  {
    title: "Can I sign in via Google or Facebook?",
    content:
      "When you enter the App you have several options such as login in as a guest, making your own account or login in through Facebook or Google!",
  },
  {
    title: "Contact Us!",
    content:
      "If you require any help or have any questions please email us at HelloChef@gmail.com !",
  },
  {
    title: "Version",
    content:
      "This is the first version of the app (1.0) and we are looking forward to releasing new updates!",
  },
];

const Faq = ({ navigation, route }) => {
  const { param1 } = route.params;

  const locales = new LocalizedStrings(data);
  const [locale, setLocale] = useState("en");
  locales.setLanguage(locale);

  const currentUser = useAuth();
  const [activeSections, setActiveSections] = useState([]);
  // MultipleSelect is for the Multiple Expand allowed
  // True: Expand multiple at a time
  // False: One can be expand at a time
  const [multipleSelect] = useState(false);

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

  const goHomePage = () => {
    navigation.navigate("HomePageScreen", {
      param1: currentUser?.email,
    });
  };

  const goToSettings = () => {
    navigation.navigate("SettingsScreen", {
      param1: currentUser?.email,
    });
  };

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    return (
      <Animatable.View
        duration={400}
        style={[styles.header, isActive ? styles.active : styles.inactive]}
        transition='backgroundColor'
      >
        <Text style={styles.headerText}>{section.title}</Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    //Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition='backgroundColor'
      >
        <Animatable.Text
          animation={isActive ? "bounceIn" : undefined}
          style={{ textAlign: "center" }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>{locales.frequentquestions}</Text>

          <View
            style={{
              backgroundColor: "#000",
              height: 1,
              marginTop: 16,
              marginBottom: 18,
            }}
          />

          <Accordion
            activeSections={activeSections}
            //for any default active section
            sections={faqPopup}
            //title and content of accordion
            touchableComponent={TouchableOpacity}
            expandMultiple={multipleSelect}
            // expand mutiple at a time or single at a time
            renderHeader={renderHeader}
            //Header Component(View) to render
            renderContent={renderContent}
            //Content Component(View) to render
            duration={400}
            //Duration for Collapse and expand
            onChange={setSections}
            //setting the state of active sections
          />

          <View
            style={{
              backgroundColor: "#000",
              height: 0.5,
              marginTop: 16,
              marginBottom: 18,
            }}
          />
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <TouchableOpacity
              onPress={goHomePage}
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
                {locales.settings}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Faq;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#A6CED4",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#A6CED4",
    padding: 10,
  },
  headerText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    padding: 20,
  },
  active: {
    backgroundColor: "#A6CED4",
  },
  inactive: {
    backgroundColor: "#A6CED4",
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: "500",
    padding: 10,
    textAlign: "center",
  },
  button: {
    width: 200,
    fontSize: 18,
    backgroundColor: "#7CC3CE",
  },
});
