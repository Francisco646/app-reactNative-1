import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import * as Device from 'expo-device';
import { Platform } from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function HomeScreen() {

    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const handleLoginStatus = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/login/status', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log(response)

            if (response.status === 204){
                router.push('/login/LoginScreen');
                return;
            }

            const sessionData = await response.json();

            if(sessionData.hasActiveSession){
                Alert.alert('Sesión ya activa');
                return;
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error obteniendo datos de sesión");
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleLogout = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');
            console.log('Token:', token);

            if (!token) {
                Alert.alert('No hay sesión activa');
                return;
            }

            // Fila en el historial
            const response = await fetch('http://localhost:3000/history/record', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    accion: 'Logout',
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo,
                })
            })

            await AsyncStorage.removeItem('userToken');

        } catch (error) {
            console.error(error);
            Alert.alert("Error logging out");
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleRewardsAccess = async () => {
        try{
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/reward/stats', {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`
                }
            });

            console.log("Response:", response);

            if(response.status === 200) {
                const data = await response.json()
                console.log(data);

                router.push({
                    pathname: '/rewards/RewardsLandingScreen',
                    params: {
                        numOfCompletedGeneralRewards: data.numOfCompletedGeneralRewards[0].total_completed,
                        numOfUncompletedGeneralRewards: data.numOfUncompletedGeneralRewards[0].total_uncompleted,
                        numOfTotalGeneralRewards: data.numOfTotalGeneralRewards[0].total,

                        numOfCompletedSpecificRewards: data.numOfCompletedSpecificRewards[0].total_completed,
                        numOfUncompletedSpecificRewards: data.numOfUncompletedSpecificRewards[0].total_uncompleted,
                        numOfTotalSpecificRewards: data.numOfTotalSpecificRewards[0].total
                    }
                })

            }

        } catch (error){
            Alert.alert('Se ha producido un error intentando acceder a los logros');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleHistoryAccess = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/history/user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("History Response:", response);

            if (response.status === 200) {
                const data = await response.json();
                console.log(data);

                const dates = [];
                const actions = [];
                for (const row of data) {
                    dates.push(row.timestamp);
                    actions.push(row.accion);
                }

                router.push({
                    pathname: '/history/HistoryScreen',
                    params: { dates: dates, actions: actions }
                });
            }

        } catch (error) {
            Alert.alert('Se ha producido un error intentando acceder al historial');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handlePlanAccess = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const responseAllPlans = await fetch('http://localhost:3000/plan', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const responseUserPlans = await fetch('http://localhost:3000/plan/user-plan', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(responseAllPlans.status === 200 && responseUserPlans.status === 200) {

                const dataAllPlans = await responseAllPlans.json();
                const dataUserPlans = await responseUserPlans.json();

                console.log('All plans: ', dataAllPlans);
                console.log('User plans: ', dataUserPlans);

                router.push({
                    pathname: '/plans/PlanLandingScreen',
                    params: {
                        allPlans: JSON.stringify(dataAllPlans),
                        userPlans: JSON.stringify(dataUserPlans.planOfUser),
                        userPlansData: JSON.stringify(dataUserPlans.planGeneralData)
                    }
                })
            }

        } catch(error) {
            console.error('Error accediendo a los planes:', error);
            Alert.alert('Se ha producido un error intentando acceder a los planes');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    if (spinnerIsVisible) {
        return (
            <View>
                <Pulse
                    color="#d1821cff"
                    numPulses={3}
                    diameter={100}
                    speed={1}
                />
            </View>
        );
    } else {
        return(
            <ScrollView style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Inicio</Text>
                </View>

                <Pressable onPress={() => handleLoginStatus()}>
                    <Text style={styles.links}> - Press here to login</Text>
                </Pressable>

                <Pressable onPress={() => handleLogout()}>
                    <Text style={styles.links}> - Press here to logout</Text>
                </Pressable>

                <Pressable onPress={() => router.push('/register/RegisterGeneralScreen')}>
                    <Text style={styles.links}> - Press here to register</Text>
                </Pressable>

                <Pressable onPress={() => handleRewardsAccess()}>
                    <Text style={styles.links}> - Press here to see your rewards</Text>
                </Pressable>

                <Pressable onPress={() => router.push('/settings/SettingsLandingScreen')} >
                    <Text style={styles.links}> - Press here to see settings</Text>
                </Pressable>

                <Pressable onPress={() => handleHistoryAccess()}>
                    <Text style={styles.links}> - Press here to see history</Text>
                </Pressable>

                <Pressable onPress={() => handlePlanAccess()}>
                    <Text style={styles.links}> - Press here to see plans</Text>
                </Pressable>

                <Text style={styles.links}> - Press here to see calendar</Text>

            </ScrollView>
        );
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4cd1ff',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#a7faa3',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
    },
    links:{
        marginTop: 20,
        fontSize: 16,
        color: 'rgba(0,0,255,0.84)',
    },
    topBarContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: '#a7faa3',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
