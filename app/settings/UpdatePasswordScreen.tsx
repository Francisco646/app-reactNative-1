
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

export default function UpdatePasswordScreen() {

    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleChangePassword = async () => {
        
        if(newPassword !== confirmPassword) {
            Alert.alert("Las contraseñas no coinciden");
            return;
        }
        
        try{

            const token = await AsyncStorage.getItem('userToken');
            
            const response = await fetch('http://localhost:3000/setting/user/change-password', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                })
            })

            if(response.status === 204) {
                console.log('Cambio de contraseña exitoso');
                router.push('/');
            }

        } catch(error) {
            console.error("Error actualizando la contraseña: ", error);
            Alert.alert("Error en actualización de contraseña");
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topImageContainer}>
                <Image source={require('../../assets/images/userBlue.png')} style={styles.topImageImage} resizeMode="contain" />
            </View>
            <View style={styles.changePasswordAreaRows}>
                <View style={styles.passwordRow}>
                    <Image source={require('../../assets/images/lock.png')} style={styles.passwordImage} resizeMode="contain" />
                    <TextInput
                        style={styles.passwordText}
                        placeholder="Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={styles.passwordRow}>
                    <Image source={require('../../assets/images/lock.png')} style={styles.passwordImage} resizeMode="contain" />
                    <TextInput
                        style={styles.passwordText}
                        placeholder="Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>
                <View style={styles.changePasswordButtonRow}>
                    <Button title="Change Password" onPress={handleChangePassword} />
                </View>
            </View>
        </ScrollView>
    );

};

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
    changePasswordAreaRows: {
        flexDirection: 'column',  // Each sub-block is in a different row
        justifyContent: 'center',
        padding: 20,
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
    changePasswordButtonRow:{
        padding: 15,
        justifyContent: 'center',
    }
});