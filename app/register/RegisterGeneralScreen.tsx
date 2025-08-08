import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RegisterGeneralScreen(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const handleRegister = async () => {

        setSpinnerIsVisible(true);

        if(password !== confirmPassword){
            Alert.alert('Las contraseñas no coinciden');
            return;
        }

        if(!email.includes('@')){
            Alert.alert('La dirección de email no es válida')
            return;
        }

        try{
            const response = await fetch('http://localhost:3000/register/general', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json()
            console.log('Registro completado con éxito: ', data)

            router.push({
                pathname: '/register/RegisterMedicalScreen',
                params: {
                    name,
                    email,
                    phone,
                    password
                }
            });

        } catch(error){
            console.error('Error rurante el registro: ', error)
            Alert.alert('Error durante el registro: ')
        } finally {
            setSpinnerIsVisible(false);
        }

    }

    if(spinnerIsVisible) {
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
            <ScrollView style={ styles.container }>
                <View style={styles.topImageContainer}>
                    <Image
                        source={require('../../assets/images/userBlue.png')}
                        style={styles.topImageImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.registerAreaRows}>
                    <View style={styles.registerRow}>
                        <Image style={styles.rowsImage} source={require('../../assets/images/message.png')} resizeMode="contain" />
                        <TextInput style={styles.rowsText} placeholder="Nombre y Apellidos" value={name} onChangeText={setName} />
                    </View>
                    <View style={styles.registerRow}>
                        <Image style={styles.rowsImage} source={require('../../assets/images/email.png')} resizeMode="contain" />
                        <TextInput style={styles.rowsText} placeholder="Correo Electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} />
                    </View>
                    <View style={styles.registerRow}>
                        <Image style={styles.rowsImage} source={require('../../assets/images/telephone.png')} resizeMode="contain" />
                        <TextInput style={styles.rowsText} placeholder="Número de Teléfono" value={phone} onChangeText={setPhone}/>
                    </View>
                    <View style={styles.registerRow}>
                        <Image style={styles.rowsImage} source={require('../../assets/images/lock.png')} resizeMode="contain" />
                        <TextInput style={styles.rowsText} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>
                    <View style={styles.registerRow}>
                        <Image style={styles.rowsImage} source={require('../../assets/images/lock.png')} resizeMode="contain" />
                        <TextInput style={styles.rowsText} placeholder="Confirmar la Contraseña" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
                    </View>
                    <View style={styles.registerButtonRow}>
                        <Button title="Continuar a Datos Médicos" onPress={() => handleRegister()} />
                    </View>
                </View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#85bee1',
    },
    topImageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    topImageImage: {
        width: 150,
        height: 150,
    },
    registerAreaRows: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    registerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    rowsImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    rowsText: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    registerButtonRow:{
        padding: 15,
        justifyContent: 'center',
    },
});
