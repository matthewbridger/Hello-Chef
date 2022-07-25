import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';


let Fade = new Animated.Value(0);




const SplashScreen = ( {navigation} ) => {
    
    useEffect(()=>{
        Animated.timing(Fade,{
           toValue:1,
           duration:2000, 
           useNativeDriver: true 
         }).start()
     },[Fade])
    

    useEffect(() => {
        
        setTimeout(() => navigation.navigate("LoginScreen"), 4000);
        
      }, []);

    return (
        <View style={styles.logoContainer}>
        <Animated.View style={{opacity:Fade}}>
        
            <Text style={styles.logoText}>Hello-Chef</Text>
        
        </Animated.View>
        </View>
    )
};


export default SplashScreen;

const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    }, 
    logoContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',    
        
  },
  logoText:{
      fontSize: 64,
      //fontFamily: "Poppins",
      
  }

  

  


});