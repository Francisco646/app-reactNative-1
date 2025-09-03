import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Pulse = require('react-native-pulse').default;

export default function RoutineResultsStatsScreen() {

    const [ spinnerIsVisible, setSpinnerIsVisible ] = useState(false);
    const { currentRoutine } = useLocalSearchParams();

    const [ currentRoutineStats, setCurrentRoutineStats ] = useState({});           // usuarios_rutinas
    const [ initialWellnessTestData, setInitialWellnessTestData ] = useState({});   // wellness_tests
    const [ finalWellnessTestData, setFinalWellnessTestData ] = useState({});       // wellness_tests

    const [ activitiesRegularData, setActivitiesRegularData ] = useState([]);       // actividades
    const [ activitiesCurrentData, setActivitiesCurrentData ] = useState([]);       // rutinas_actividades
    const [ activitiesParamsData, setActivitiesParamsData ] = useState([]);         // usuarios_actividades

    useEffect(() => {

        const handleCurrentRoutineRetrieval = async () => {
            try {
                setSpinnerIsVisible(true);
                const token = await AsyncStorage.getItem('userToken');

                const currentRoutineAdapted = currentRoutine
                    ? JSON.parse(Array.isArray(currentRoutine) ? currentRoutine[0]: currentRoutine)
                    : {};

                const response = await fetch(`http://localhost:3000/routine/current/${currentRoutineAdapted.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

                if(response.ok) {
                    const data = await response.json();
                    console.log('Datos de la rutina actual:', data);
                    setCurrentRoutineStats(data);

                    const wellnessTestsResponse = await fetch(
                        `http://localhost:3000/routine/current/test?initial_id=${data.wellness_tests_initial_id}&final_id=${data.wellness_tests_final_id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })

                    if(wellnessTestsResponse.ok) {
                        const wellnessTestsData = await wellnessTestsResponse.json();
                        console.log('Datos de los tests de bienestar:', wellnessTestsData);
                        setInitialWellnessTestData(wellnessTestsData.initialWellnessTest);
                        setFinalWellnessTestData(wellnessTestsData.finalWellnessTest);

                        const activitiesResponse = await fetch(`http://localhost:3000/activity/current?usuario_rutina_id=${currentRoutineAdapted.id}`, {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        })

                        if(activitiesResponse.ok){
                            const activitiesData = await activitiesResponse.json();
                            console.log('Datos de las actividades:', activitiesData);
                            setActivitiesRegularData(activitiesData.currentActivities);
                            setActivitiesCurrentData(activitiesData.currentActivitiesValues);
                            setActivitiesParamsData(activitiesData.currentActivitiesParams);
                        }
                    }
                }

            } catch (error) {
                console.error('Error al recuperar la rutina actual:', error);
            } finally {
                setSpinnerIsVisible(false);
            }
        };

        handleCurrentRoutineRetrieval();
    }, [currentRoutine]);

    if(spinnerIsVisible) {
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
                <Text style={styles.title}>¡Rutina completada!</Text>
                <Text style={styles.subtitle}>Resumen de la rutina</Text>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Resumen de la Rutina</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Fecha de inicio</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.summaryValue}>{currentRoutineStats.fecha_inicio}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Fecha de finalización</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.summaryValue}>{currentRoutineStats.fecha_fin}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Porcentaje completado</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.summaryValue}>{currentRoutineStats.porcentaje_completado}%</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Tests de Bienestar</Text>
                    <View style={styles.wellnessTestContainer}>
                        <Text style={styles.testTitle}>Fecha de los tests</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDate}>Inicial: {initialWellnessTestData.fecha}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDate}>Final: {finalWellnessTestData.fecha}</Text>
                    </View>
                    <View style={styles.wellnessTestContainer}>
                        <Text style={styles.testTitle}>Nivel de dolor</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Inicial: {initialWellnessTestData.dolor}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Final: {finalWellnessTestData.dolor}</Text>
                    </View>
                    <View style={styles.wellnessTestContainer}>
                        <Text style={styles.testTitle}>Nivel de sueño</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Inicial: {initialWellnessTestData.sueño}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Final: {finalWellnessTestData.sueño}</Text>
                    </View>
                    <View style={styles.wellnessTestContainer}>
                        <Text style={styles.testTitle}>Nivel de fatiga</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Inicial: {initialWellnessTestData.fatiga}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Final: {finalWellnessTestData.fatiga}</Text>
                    </View>
                    <View style={styles.wellnessTestContainer}>
                        <Text style={styles.testTitle}>Estado de ánimo</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Inicial: {initialWellnessTestData.animo}</Text>
                        {/* @ts-ignore */}
                        <Text style={styles.testDetail}>Final: {finalWellnessTestData.animo}</Text>
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Actividades Realizadas</Text>
                    {activitiesRegularData.map((activity, index) => {
                        return (
                            <View key={index} style={styles.activityCard}>
                                {/* @ts-ignore */}
                                <Text style={styles.activityName}>{activity.nombre}</Text>
                                {/* @ts-ignore */}
                                <Text style={styles.activityDetail}>Tipo: {activity.tipo_actividad}</Text>
                                {/* @ts-ignore */}
                                <Text style={styles.activityDetail}>Descripción: {activity.descripcion}</Text>
                                {/* @ts-ignore */}
                                <Text style={styles.activityDetail}>Fecha de finalización: {activitiesParamsData[index].fecha_completada}</Text>
                                {/* @ts-ignore */}
                                <Text style={styles.activityDetail}>Series: {activitiesCurrentData[index].numero_series}</Text>
                                {/* @ts-ignore */}
                                <Text style={styles.activityDetail}>Repeticiones: {activitiesCurrentData[index].repeticiones}</Text>
                            </View>
                        );
                    })}
                </View>

                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText} onPress={() => router.push('/')}>Volver a Inicio</Text>
                </View>

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        padding: 20,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#555',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#01b888',
    },
    activityCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    activityName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    activityDetail: {
        fontSize: 14,
        color: '#666',
    },
    wellnessTestContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
    },
    testTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    testDate: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
    },
    testDetail: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    buttonContainer: {
        backgroundColor: '#01b888',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
