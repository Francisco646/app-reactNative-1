import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// @ts-ignore
export default function DrawerContent({ openDrawer, closeDrawer }) {

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const info = {
            plataforma: Platform.OS,
            modelo_dispositivo: Device.modelName,
            os: Device.osName,
            osVersion: Device.osVersion,
        };

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

    const handleRegistration = async () => {
        try{
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
                router.push('/register/RegisterGeneralScreen');
                return;
            }

        } catch (error) {
            console.error('Error intentando acceder al registro:', error);
            Alert.alert('Se ha producido un error intentando acceder al registro');
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
            } else if(response.status === 401) {
                router.push('/login/LoginScreen');
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
            } else if(response.status === 401) {
                router.push('/login/LoginScreen');
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
            } else if(responseUserPlans.status === 401) {
                router.push('/login/LoginScreen');
            }

        } catch(error) {
            console.error('Error accediendo a los planes:', error);
            Alert.alert('Se ha producido un error intentando acceder a los planes');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleCalendarAccess = async () => {
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

            if (response.status === 200){
                router.push('/calendar/Calendar');
            } else {
                router.push('/login/LoginScreen');
            }

        } catch (error) {
            console.error('Error accediendo al calendario:', error);
            Alert.alert('Se ha producido un error intentando acceder al calendario');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    return (
        <View style={drawerStyles.container}>
            <Text style={drawerStyles.title}>Menú</Text>
            <Pressable style={drawerStyles.item} onPress={() => { router.push('/settings/SettingsLandingScreen'); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Ajustes</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handleLoginStatus(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Iniciar Sesión</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handleRegistration(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Registrarse</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handlePlanAccess(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Planes</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handleRewardsAccess(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Logros</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handleHistoryAccess(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Historial</Text>
            </Pressable>
            <Pressable style={drawerStyles.item} onPress={() => { handleCalendarAccess(); closeDrawer(); }}>
                <Text style={drawerStyles.itemText}>Calendario</Text>
            </Pressable>
        </View>
    );
}

const drawerStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 18,
    }
});
