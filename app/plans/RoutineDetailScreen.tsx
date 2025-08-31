import { router, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Pulse = require('react-native-pulse').default;

/* Mostrar los datos sobre una rutina específica de un plan */
export default function RoutineDetailScreen() {

    const { routineData, activitiesData, activitiesValues, isThisPlanActive } = useLocalSearchParams();
    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    const routineDataAdapted = routineData
        ? JSON.parse(Array.isArray(routineData) ? routineData[0]: routineData)
        : [];

    const activitiesDataAdapted = activitiesData
        ? JSON.parse(Array.isArray(activitiesData) ? activitiesData[0]: activitiesData)
        : [];

    const activitiesValuesAdapted = activitiesValues
        ? JSON.parse(Array.isArray(activitiesValues) ? activitiesValues[0]: activitiesValues)
        : [];

    const isPlanActive = isThisPlanActive === 'true';

    // @ts-ignore
    const handleActivityAccess = async (activity, activityValues) => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`http://localhost:3000/material/${activity.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if(response.ok) {
                const material = await response.json();
                router.push({
                    pathname: '/plans/ActivityDetailScreen',
                    params: {
                        activitiesData: JSON.stringify(activity),
                        activitiesValues: JSON.stringify(activityValues),
                        materialData: JSON.stringify(material)
                    }
                })
            }

        } catch(error){
            console.error(error);
            Alert.alert('Error accediendo a la actividad');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleActivityStart = async() => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/routine/start', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    routineId: routineDataAdapted.id
                })
            })

            if(response.ok) {
                const data = await response.json();
                router.push({
                    pathname: '/plans/WellnessTestInitialScreen',
                    params: {
                        routineData: JSON.stringify(routineDataAdapted),
                        routineStartData: JSON.stringify(data)
                    }
                })
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error accediendo al inicio de la rutina a realizar');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    if(spinnerIsVisible){
        return(
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
                <View style={styles.header}>
                    <Text style={styles.titleText}>{routineDataAdapted.nombre}</Text>
                    <Text style={styles.subTitleText}>{routineDataAdapted.descripcion}</Text>
                </View>

                <View style={styles.startButtonSection}>
                    {isPlanActive ? (
                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => handleActivityStart()}
                        >
                            <Text style={styles.startButtonText}>¡Comenzar Misión!</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.infoText}>
                            Activa este plan para comenzar esta rutina.
                        </Text>
                    )}
                </View>

                <View style={styles.activitiesSection}>
                    <Text style={styles.sectionTitle}>
                        Actividades ({activitiesDataAdapted.length})
                    </Text>
                    {/* @ts-ignore */}
                    {activitiesDataAdapted.map((activity, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.activityCard}
                            onPress={() => handleActivityAccess(activity, activitiesValuesAdapted[index])}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.activityName}>{activity.nombre}</Text>
                                {/* Un placeholder para un ícono de actividad */}
                                <View style={styles.activityIconPlaceholder}>
                                    <Text style={styles.activityIconText}>
                                        {activity.tipo_actividad?.slice(0, 1).toUpperCase() || 'A'}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.cardDetails}>
                                {activitiesValuesAdapted[index].numero_series > 0 && (
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Series:</Text> {activitiesValuesAdapted[index].numero_series}
                                    </Text>
                                )}
                                {activitiesValuesAdapted[index].repeticiones > 0 && (
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Repeticiones:</Text> {activitiesValuesAdapted[index].repeticiones}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.cardButton}>
                                <Text style={styles.cardButtonText}>Ver Detalles</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    subTitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 5,
    },
    startButtonSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    startButton: {
        backgroundColor: '#01b888',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    activitiesSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#26a2fa',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    activityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    activityIconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityIconText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cardDetails: {
        marginBottom: 15,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginVertical: 2,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#333',
    },
    cardButton: {
        backgroundColor: '#01b888',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    cardButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
