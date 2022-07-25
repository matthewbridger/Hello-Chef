import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { data } from "../locale";
import LocalizedStrings from "react-localization";
import axios from "axios";

const screen = Dimensions.get('window');

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time - mins * 60;
    return { mins: formatNumber(mins), secs: formatNumber(secs) };
}

export default function CountdownTimer({route}) {
  const {param1} = route.params;
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const { mins, secs } = getRemaining(remainingSecs);
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

  const reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  }

  const toggle = () => {
    setIsActive(!isActive);
  }


  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);


  return (
    <View style={timer.container}>
      <StatusBar barStyle="light-content" />  
      <Text style={timer.timerText}>{`${mins}:${secs}`}</Text>
  <TouchableOpacity onPress={toggle} style={timer.button}>
          <Text style={timer.buttonText}>{isActive ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={reset} style={[timer.button, timer.buttonReset]}>
          <Text style={[timer.buttonText, timer.buttonTextReset]}>{locales.reset}</Text>
      </TouchableOpacity>
    </View>
  );
}

const timer = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      borderWidth: 10,
      borderColor: '#adebeb',
      width: screen.width / 2,
      height: screen.width / 2,
      borderRadius: screen.width / 2,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText: {
      fontSize: 45,
      color: '#adebeb'
  },
  timerText: {
      color: '#fff',
      fontSize: 90,
      marginBottom: 20
  },
  buttonReset: {
      marginTop: 20,
      borderColor: "#b3ffb3"
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 400,
    marginTop: 40
  },
  buttonTextReset: {
    color: "#99ff99"
  }
});