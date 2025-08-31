import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useMemo } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RoutineRealizationScreen() {

    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    const { currentRoutine, activitiesOfRoutine, activitiesValues, routineToDo } = useLocalSearchParams();
    const [isLoading, setIsLoading] = React.useState(true);

    const currentRoutineAdapted = useMemo(() => currentRoutine
        ? JSON.parse(Array.isArray(currentRoutine) ? currentRoutine[0] : currentRoutine)
        : {}, [currentRoutine]);

    const activitiesOfRoutineAdapted = useMemo(() => activitiesOfRoutine
        ? JSON.parse(Array.isArray(activitiesOfRoutine) ? activitiesOfRoutine[0] : activitiesOfRoutine)
        : [], [activitiesOfRoutine]);

    const routineToDoAdapted = useMemo(() => routineToDo
        ? JSON.parse(Array.isArray(routineToDo) ? routineToDo[0] : routineToDo)
        : [], [routineToDo]);

    const activitiesValuesAdapted = useMemo(() => activitiesValues
        ? JSON.parse(Array.isArray(activitiesValues) ? activitiesValues[0] : activitiesValues)
        : [], [activitiesValues]);

    /* Estados de la Rutina */
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [currentSeries, setCurrentSeries] = useState(1);
    const [numSeriesDone, setNumSeriesDone] = useState(0);
    const [loadedMaterials, setLoadedMaterials] = useState({});

    /* El resto de las variables */
    const currentActivity = useMemo(() => activitiesOfRoutineAdapted[currentActivityIndex], [activitiesOfRoutineAdapted, currentActivityIndex]);
    const currentActivityValues = useMemo(() => activitiesValuesAdapted[currentActivityIndex], [activitiesValuesAdapted, currentActivityIndex]);

    const totalActivities = activitiesOfRoutineAdapted.length;
    const isLastSeries = currentActivityValues && currentSeries >= currentActivityValues.numero_series;
    const isLastActivity = currentActivityIndex >= totalActivities - 1;

    {/* @ts-ignore */}
    const totalSeries = useMemo(() => activitiesValuesAdapted.reduce((acc, activity) => acc + (activity.numero_series || 0), 0), [activitiesValuesAdapted]);

    /* Cargar todos los materiales al inicio */
    useEffect(() => {
        const loadAllActivityMaterials = async () => {
            if (activitiesOfRoutineAdapted.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    console.error('No se encontró el token de usuario.');
                    return;
                }

                let materialsMap = {};
                for (let activity of activitiesOfRoutineAdapted) {
                    const response = await fetch(`http://localhost:3000/material/${activity.id}`, {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();

                        {/* @ts-ignore */}
                        materialsMap[activity.id] = Array.isArray(data) ? data : [data];
                    } else {
                        console.error(`Error al cargar los materiales de la actividad ${activity.id}:`, response.statusText);
                    }
                }
                setLoadedMaterials(materialsMap);
            } catch (error) {
                console.error('Error al obtener los materiales de la actividad:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAllActivityMaterials();
    }, [activitiesOfRoutineAdapted]);

    /* Necesario para registrar una actividad como completada */
    useEffect(() => {

        if (currentActivityIndex > 0) {
            const completedActivity = activitiesOfRoutineAdapted[currentActivityIndex - 1];
            handleActivityCompletion(completedActivity);
        }
    }, [currentActivityIndex, activitiesOfRoutineAdapted]);


    const handleNextSeries = () => {
        setNumSeriesDone(prevNum => prevNum + 1);

        if (!isLastSeries) {
            setCurrentSeries(prevSeries => prevSeries + 1);
        } else {
            handleNextActivity();
        }
    };

    const handleNextActivity = () => {
        if (!isLastActivity) {
            setCurrentActivityIndex(prevIndex => prevIndex + 1);
            setCurrentSeries(1);
        } else {
            handleActivityCompletion(currentActivity);
            handleRoutineEnd();
        }
    };

    {/* @ts-ignore */}
    const handleActivityCompletion = async (activityToComplete) => {
        if (!activityToComplete) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error('No se encontró el token de usuario.');
                return;
            }

            await fetch('http://localhost:3000/activity/completion', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    usuario_rutina_id: currentRoutineAdapted.id,
                    actividad_id: activityToComplete.id,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo
                })
            });
        } catch (error) {
            console.error('Error completando la actividad:', error);
        }
    }

    const handleRoutineEnd = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error('No se encontró el token de usuario.');
                setIsLoading(false);
                return;
            }

            const finalScoreSeries = totalSeries > 0 ? Math.round((numSeriesDone / totalSeries) * 100) : 0;

            const responseRoutineEnd = await fetch('http://localhost:3000/routine/end', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    usuarios_rutinas_id: currentRoutineAdapted.id,
                    porcentaje_completado: finalScoreSeries,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo
                })
            });

            if (responseRoutineEnd.ok) {
                router.push({
                    pathname: '/plans/WellnessTestEndScreen',
                    params: { currentRoutine: JSON.stringify(currentRoutineAdapted) }
                });
            } else {
                router.push('/');
            }

        } catch (error) {
            console.error('Error finalizando la rutina:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading || !currentActivity) {
        return (
            <View style={styles.loadingContainer}>
                <Pulse color="#d1821cff" numPulses={3} diameter={100} speed={10} duration={1000} />
                <ActivityIndicator size="large" color="#d1821cff" style={{marginTop: 20}}/>
            </View>
        )
    }
    {/* @ts-ignore */}
    const currentMaterials = loadedMaterials[currentActivity.id] || [];
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Text style={styles.routineTitle}>{routineToDoAdapted.nombre}</Text>
                <Text style={styles.activityTitle}>{currentActivity.nombre}</Text>
                {currentMaterials.length > 0 && (
                    <View style={{ marginBottom: 15 }}>
                        <Text style={styles.subtitle}>Materiales necesarios:</Text>

                        {/* @ts-ignore */}
                        {currentMaterials.map((material, index) => (
                            <Text key={index} style={styles.materialText}>
                                - {material.nombre}
                            </Text>
                        ))}
                    </View>
                )}

                <Image source={require('../../assets/images/image_1296698.png')} style={styles.activityImage} />

                <Text style={styles.progressText}>
                    Serie {currentSeries} de {currentActivityValues.numero_series}
                </Text>
                <Text style={styles.progressText}>
                    Número de repeticiones: {currentActivityValues.repeticiones}
                </Text>

                <TouchableOpacity style={styles.nextButton} onPress={handleNextSeries}>
                    <Text style={styles.nextButtonText}>
                        {isLastSeries && isLastActivity ? "¡Completar!" : "Siguiente"}
                    </Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.finishButton} onPress={handleRoutineEnd}>
                <Text style={styles.finishButtonText}>Finalizar rutina</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
        width: '90%',
    },
    routineTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginBottom: 10,
    },
    activityTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    activityImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    progressText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#01b888',
        marginBottom: 25,
    },
    nextButton: {
        backgroundColor: '#13acff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finishButton: {
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 20,
    },
    finishButtonText: {
        color: '#777',
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
    materialText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});

