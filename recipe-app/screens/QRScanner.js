import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../firebase";

const QRScanner = ({ props, navigation }) => {
  const currentUser = useAuth();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [title, setTitle] = useState();
  const [text, setText] = useState("Nothing has been scanned");
  const [useQR, setUseQR] = useState(false);

  const askForPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission of the user
  useEffect(() => {
    askForPermission();
  }, [useQR, title]);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    setText(data);
    //console.log("Type: " + type + "\nData: " + data); // Prints the data type
  };

  async function retrieveIngredientInfo() {
    let response = await getJsonData();
    console.log(response);
  }

  async function getJsonData() {
    setUseQR((current) => !current);
    fetch(
      "https://cors-anywhere.herokuapp.com/https://api.upcitemdb.com/prod/trial/lookup?upc=9002490206000"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.items[0].title);
        //  setUseQR(current => !current)
        setTitle(responseJson.items[0].title);
        return responseJson;
      });
  }

  const goToAddIngredient = () => {
    console.log(title);
    navigation.navigate("AddIngred", {
      param1: currentUser?.email,
      qrData: title,
      useQR: useQR,
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  return (
    //Should not be using undefined utilize useful error messages
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.barcodebox}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Text style={styles.maintext}>{text}</Text>

        {scanned && (
          <Button title={"Scan again?"} onPress={() => setScanned(false)} />
        )}
      </View>

      <TouchableOpacity onPress={retrieveIngredientInfo}>
        <Text style={styles.button}> Use this code</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity onPress={goToAddIngredient}>
          <Text style={styles.button}>Add to ingredients</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QRScanner;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#A7D2CB",
    padding: 10,
    borderRadius: 50,
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 10,
    alignItems: "center",
    textAlign: "center",
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    backgroundColor: "tomato",
  },
});
