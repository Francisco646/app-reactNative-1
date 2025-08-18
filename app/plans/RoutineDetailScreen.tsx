import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";

const Pulse = require('react-native-pulse').default;
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Mostrar los datos sobre una rutina específica de un plan */
export default function RoutineDetailScreen() {

    const { routineData, activitiesData, isThisPlanActive } = useLocalSearchParams();
    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    const routineDataAdapted = routineData
        ? JSON.parse(Array.isArray(routineData) ? routineData[0]: routineData)
        : [];

    const activitiesDataAdapted = activitiesData
        ? JSON.parse(Array.isArray(activitiesData) ? activitiesData[0]: activitiesData)
        : [];

    const isPlanActive = isThisPlanActive === 'true';

    // @ts-ignore
    const handleActivityAccess = async (activity) => {
        try {
            setSpinnerIsVisible(true);
            router.push({
                pathname: '/plans/ActivityDetailScreen',
                params: {
                    activitiesData: JSON.stringify(activity)
                }
            })

        } catch(error){
            console.error(error);
            Alert.alert('Error accediendo a la actividad');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    // @ts-ignore
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

            if(response.status === 201) {
                const data = await response.json();
                console.log('Datos de la rutina a realizar:', data);

                const actividadesRutina = data.activitiesOfRoutine;
                const rutinaRealizar = data.routineToDo;

                router.push({
                    pathname: '/plans/RoutineStartScreen',
                    params: {
                        activitiesOfRoutine: JSON.stringify(actividadesRutina),
                        routineToDo: JSON.stringify(rutinaRealizar)
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
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{routineDataAdapted.nombre}</Text>
                    <Text style={styles.subTitleText}>{routineDataAdapted.descripcion}</Text>
                    <Text style={styles.subTitleText}>Numero de ejercicios: {routineDataAdapted.numero_ejercicios}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    {isPlanActive ? (
                        <TouchableOpacity style={styles.buttonAccess} onPress={() => handleActivityStart()}>
                            <Text style={styles.buttonText}>Iniciar rutina</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text></Text>
                    )}
                </View>
                <View style={styles.routineActivitiesContainer}>
                    <Text style={styles.routineActivitiesTitle}>Actividades de la Rutina</Text>
                    { /* @ts-ignore */}
                    {activitiesDataAdapted.map((activity) => (
                        // eslint-disable-next-line react/jsx-key
                        <View style={styles.routineActivitiesSubContainer}>
                            <Text>{activity.nombre}</Text>
                            <Text>{activity.tipo_actividad}</Text>
                            <Text>{activity.numero_series} {activity.numero_repeticiones} {activity.duracion_minutos}</Text>
                            <TouchableOpacity style={styles.buttonAccess} onPress={() => handleActivityAccess(activity)}>
                                <Text style={styles.buttonText}>Ver actividad</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    titleContainer:{
        margin: 20,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    subTitleText: {
        fontSize: 20,
        color: '#000000'
    },
    routineActivitiesContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    routineActivitiesTitle: {
        fontSize: 24,
        color: '#000000',
        marginVertical: 15,
    },
    routineActivitiesSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    buttonAccess: {
        backgroundColor: '#01b888',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
