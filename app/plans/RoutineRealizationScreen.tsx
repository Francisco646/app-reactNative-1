import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RoutineRealizationScreen() {

    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    const { currentRoutine, activitiesOfRoutine, routineToDo } = useLocalSearchParams();
    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    const currentRoutineAdapted = currentRoutine
        ? JSON.parse(Array.isArray(currentRoutine) ? currentRoutine[0]: currentRoutine)
        : {};

    const activitiesOfRoutineAdapted = activitiesOfRoutine
        ? JSON.parse(Array.isArray(activitiesOfRoutine) ? activitiesOfRoutine[0]: activitiesOfRoutine)
        : [];

    const routineToDoAdapted = routineToDo
        ? JSON.parse(Array.isArray(routineToDo) ? routineToDo[0]: routineToDo)
        : [];

    /* Realizar la actividad correcta en la serie correcta */
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [currentSeries, setCurrentSeries] = useState(1);
    const [numSeriesDone, setNumSeriesDone] = useState(0);
    const [materialList, setMaterialList] = useState<Array<any>>([[]]);

    const currentMaterials = materialList[currentActivityIndex] || [];
    const currentActivity = activitiesOfRoutineAdapted[currentActivityIndex];
    const totalActivities = activitiesOfRoutineAdapted.length;
    const isLastSeries = currentActivity && currentSeries >= currentActivity.numero_series;
    const isLastActivity = currentActivityIndex >= totalActivities - 1;

    // @ts-ignore
    const totalSeries = activitiesOfRoutineAdapted.reduce((acc, activity) => acc + activity.numero_series, 0);

    /* Los materiales de la actividad se cargan al comienzo de la ejecución de la rutina */ 
    useEffect(() => {
        const loadActivityMaterials = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                    console.error('No se encontró el token de usuario.');
                    return;
                }

                let materialList = [];

                for (let activity of activitiesOfRoutineAdapted) {
                    const response = await fetch(`http://localhost:3000/material/${activity.id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    if (response.ok) {
                        const materials = await response.json();
                        materialList.push(materials);
                    } else {
                        console.error(`Error al cargar los materiales de la actividad ${activity.id}:`, response.statusText);
                    }
                }

                console.log('Lista de materiales:', materialList);
                setMaterialList(materialList);

            } catch (error) {
                console.error('Error al obtener los materiales de la actividad:', error);
            }
        };

        loadActivityMaterials();
    }, [currentActivity]);

    const handleNextSeries = () => {
        setNumSeriesDone(prevNum => prevNum + 1);

        if (currentSeries < currentActivity.numero_series) {
            setCurrentSeries(prevSeries => prevSeries + 1);
        } else {
            handleActivityCompletion();
            handleNextActivity();
        }
    };

    const handleNextActivity = () => {
        if (currentActivityIndex < totalActivities - 1) {
            setCurrentActivityIndex(prevIndex => prevIndex + 1);
            setCurrentSeries(1);
        } else {
            handleRoutineEnd();
        }
    };

    const handleRoutineEnd = async () => {
        try {
            setSpinnerIsVisible(true);

            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error('No se encontró el token de usuario.');
                return;
            }
            
            const finalScoreSeries = Math.round((numSeriesDone / totalSeries) * 100);
            console.log('Porcentaje de series completadas:', finalScoreSeries);
            console.log('ID de la rutina de usuario:', currentRoutineAdapted.id);

            const responseRoutineEnd = await fetch('http://localhost:3000/routine/end', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    usuarios_rutinas_id: currentRoutineAdapted.id,
                    porcentaje_completado: finalScoreSeries,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo
                })
            });

            console.log('Respuesta al finalizar la rutina:', responseRoutineEnd);

            if (responseRoutineEnd.ok) {
                console.log('Rutina finalizada con éxito');
                router.push({
                    pathname: '/plans/WellnessTestEndScreen',
                    params: {
                        currentRoutine: JSON.stringify(currentRoutineAdapted),
                    }
                });
            } else {
                router.push('/');
            }

        } catch (error) {
            console.error('Error finalizando la rutina:', error);
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    const handleActivityCompletion = async () => {
        try {
            setNumSeriesDone(prevNum => prevNum + 1);

            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.error('No se encontró el token de usuario.');
                return;
            }

            const responseActivityCompletion = await fetch('http://localhost:3000/activity/completion', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    usuario_rutina_id: currentRoutineAdapted.id,
                    actividad_id: currentActivity.id,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo
                })
            });

            if (responseActivityCompletion.ok) {
                const data = await responseActivityCompletion.json();
                console.log('Actividad completada con éxito:', data);
            }

        } catch (error) {
            console.error('Error completando la actividad:', error);
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
        )
    } else {
        return(
            <View style={styles.container}>
                <View style={styles.cardContainer}>
                    <Text style={styles.routineTitle}>{routineToDoAdapted.nombre}</Text>
                    <Text style={styles.activityTitle}>{currentActivity.nombre}</Text>
                    <Text style={styles.subtitle}>Materiales necesarios:</Text>
                    
                    { /* @ts-ignore */}
                    {currentMaterials.map((material, index) => (
                        <Text key={index} style={styles.materialText}>
                            - {material.nombre}
                        </Text>
                    ))}

                    <Image source={require('../../assets/images/image_1296698.png')} style={styles.activityImage} />
                    
                    <Text style={styles.progressText}>
                        Serie {currentSeries} de {currentActivity.numero_series}
                    </Text>

                    <TouchableOpacity style={styles.nextButton} onPress={() => handleNextSeries()}>
                        <Text style={styles.nextButtonText}>
                            {isLastSeries && isLastActivity ? "¡Completar!" : "Siguiente"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.finishButton} onPress={() => handleRoutineEnd()}>
                    <Text style={styles.finishButtonText}>Finalizar rutina</Text>
                </TouchableOpacity>
            </View>
        )
    }   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
    materialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    materialText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
});
