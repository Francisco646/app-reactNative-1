import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from './DrawerContent'; // Assuming DrawerContent is in the same directory

const Pulse = require('react-native-pulse').default;

export default function HomeScreen() {

    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [open, setOpen] = React.useState(false);

    const drawer = useRef<{ openDrawer: () => void } | null>(null);
    
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
            <Drawer
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderDrawerContent={() => <DrawerContent closeDrawer={() => setOpen(false)} openDrawer={undefined} />}
            >
                <View style={styles.appContainer}>
                    <View style={styles.header}>
                        <Pressable
                            style={styles.headerIcon}
                            onPress={() => setOpen(true)}
                        >
                            <Ionicons name="menu" size={32} color="black" />
                        </Pressable>
                        <Pressable onPress={()=> router.push('/settings/SettingsLandingScreen')} style={styles.headerIcon}>
                            <Ionicons name="settings-outline" size={32} color="black" />
                        </Pressable>
                    </View>
                    <ScrollView style={styles.container}>
                        <View style={styles.motivationalSection}>
                            <MaterialCommunityIcons name="image-outline" size={100} color="black" />
                            <Text style={styles.motivationalText}>Frase Motivadora</Text>
                        </View>

                        <Pressable style={styles.card} onPress={() => router.push('/calendar/Calendar')}>
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.cardTitle}>Calendario</Text>
                                    <Text style={styles.cardSubtitle}>Lunes, 12 de mayo</Text>
                                    <Text style={styles.cardSubtitle}>¿Qué tenemos que hacer hoy?</Text>
                                </View>
                                <Pressable style={styles.button} onPress={() => router.push('/calendar/Calendar')}>
                                    <Text style={styles.buttonText}>¡Vamos!</Text>
                                </Pressable>
                            </View>
                        </Pressable>

                        <Pressable style={styles.card} onPress={() => handlePlanAccess()}>
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.cardTitle}>Planes y actividades</Text>
                                    <Text style={styles.cardSubtitle}>Variedad de planes de{"\n"}ejercicio adaptados</Text>
                                </View>
                                <Pressable style={styles.button} onPress={() => handlePlanAccess()}>
                                    <Text style={styles.buttonText}>Descubrir</Text>
                                </Pressable>
                            </View>
                        </Pressable>

                        <Pressable style={styles.card} onPress={() => handleRewardsAccess()}>
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.cardTitle}>Logros</Text>
                                    <Text style={styles.cardSubtitle}>Un vistazo a los logros{"\n"}obtenidos durante tu viaje</Text>
                                </View>
                                <Pressable style={styles.button} onPress={() => handleRewardsAccess()}>
                                    <Text style={styles.buttonText}>Ver</Text>
                                </Pressable>
                            </View>
                        </Pressable>

                        {/* Controles para depuración, puedes eliminarlos después */}
                        <View style={styles.debugContainer}>
                            <Text style={styles.links} onPress={handleLoginStatus}>Login Status</Text>
                            <Text style={styles.links} onPress={handleLogout}>Logout</Text>
                            <Text style={styles.links} onPress={() => router.push('/register/RegisterGeneralScreen')}>Register</Text>
                            <Text style={styles.links} onPress={() => router.push('/settings/SettingsLandingScreen')}>Settings</Text>
                            <Text style={styles.links} onPress={handleHistoryAccess}>History</Text>
                        </View>
                    </ScrollView>
                </View>
            </Drawer>

        );
    }

}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        backgroundColor: '#D6FFB7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 10,
        width: '100%',
    },
    headerIcon: {
        padding: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    motivationalSection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    motivationalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    card: {
        backgroundColor: '#D6FFB7',
        borderRadius: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#007BFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    // Estilos de depuración, puedes eliminarlos si lo deseas
    debugContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    links: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 10,
    }
});
