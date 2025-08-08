// Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import * as Device from 'expo-device';
import { Platform } from 'react-native';

const Pulse = require('react-native-pulse').default;

// Define the LoginScreen component
export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    
    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    const handleLogin = async () => {
        try{
            setSpinnerIsVisible(true);
            
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application.json"
                }, 
                body: JSON.stringify({
                    email: email,
                    password: password,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo,
                })
            })

            console.log("Login Response:", response)
            const login = await response.json()

            if (response.status === 201){
                const token = login;
                if(token){
                    await AsyncStorage.setItem("userToken", token);
                    console.log("Token almacenado exitosamente")
                } else {
                    console.log("No se almacenó el token de sesión")
                }
            }

        } catch(error){
            console.error("Hubo un error en el inicio de sesión: ", error);
            Alert.alert("Error en inicio de sesión")
        } finally {
            router.push('/');
            setSpinnerIsVisible(false);
        }
    };

    if(spinnerIsVisible){
        <View>
            <Pulse 
                color="#d1821cff"
                numPulses={3}
                diameter={100}
                speed={1}
            />
        </View>
    } else {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.topImageContainer}>
                    <Image source={require('../../assets/images/userBlue.png')} style={styles.topImageImage} resizeMode="contain" />
                </View>
                <View style={styles.loginAreaRows}>
                    <View style={styles.userEmailRow}>
                        <Image source={require('../../assets/images/email.png')} style={styles.userEmailImage} resizeMode="contain" />
                        <TextInput
                            style={styles.userEmailText}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.passwordRow}>
                        <Image source={require('../../assets/images/lock.png')} style={styles.passwordImage} resizeMode="contain" />
                        <TextInput
                            style={styles.passwordText}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.loginButtonRow}>
                        <Button title="Login" onPress={handleLogin} />
                    </View>
                </View>
                <View style={styles.linkToRegister}>
                    <Text>
                        Don&#39;t have an account? 
                    </Text>
                    <Text onPress={() => router.push('/register/RegisterGeneralScreen')} style={styles.linkToRegisterText}>
                        Register here
                    </Text>
                </View>
            </ScrollView>
        );
    }

    
};

// Define styles for the component
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#85bee1',
        flex: 1, // Fill the screen
    },
    topImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        width: '100%', // Container occupies full width, image is viewed as centered
        height: 150,
    },
    topImageImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        padding: 10,
    },
    loginAreaRows: {
        flexDirection: 'column',  // Each sub-block is in a different row
        justifyContent: 'center',
        padding: 20,
    },
    userEmailRow: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',     // Container items are in the same row
        alignItems: 'center',
        marginBottom: 30,
    },
    userEmailImage:{
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    userEmailText:{
        fontSize: 16,
        flex: 1,
        borderWidth: 2,
        borderColor: '#fff',
        padding: 5,
        marginLeft: 10,
        height: 40,
    },
    passwordRow: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',     // Container items are in the same row
        alignItems: 'center',
        marginBottom: 20,
    },
    passwordImage:{
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    passwordText:{
        fontSize: 16,
        flex: 1,
        borderWidth: 2,
        borderColor: '#fff',
        padding: 5,
        marginLeft: 10,
        height: 40,
    },
    loginButtonRow:{
        padding: 15,
        justifyContent: 'center',
    },
    linkToRegister:{
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkToRegisterText:{
        fontSize: 16,
        color: '#0032fa',
    },
});
