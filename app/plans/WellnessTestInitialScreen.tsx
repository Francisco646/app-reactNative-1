import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
const Pulse = require('react-native-pulse').default;

export default function WellnessTestInitialScreen() {

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const { routineData, routineStartData } = useLocalSearchParams();

    /* Recopilar los valores introducidos en el picker */
    const [ dolor, setDolor ] = useState(null);
    const [ sueno, setSueno ] = useState(null);
    const [ fatiga, setFatiga ] = useState(null);
    const [ animo, setAnimo ] = useState(null);

    /* Adaptar los datos de la rutina */
    const routineDataAdapted = routineData
        ? JSON.parse(Array.isArray(routineData) ? routineData[0]: routineData)
        : [];

    const routineStartDataAdapted = routineStartData
        ? JSON.parse(Array.isArray(routineStartData) ? routineStartData[0]: routineStartData)
        : [];

    const handleRoutinePerformAccess = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const rutinaRealizar = routineStartDataAdapted.routineToDo;
            const usuarios_rutinas_id = rutinaRealizar.insertId;

            /* Almacenar los datos del test de bienestar */
            const wellnessTestResponse = await fetch('http://localhost:3000/routine/current', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    routineId: routineDataAdapted.id,
                    dolor: dolor,
                    sueño: sueno,
                    fatiga: fatiga,
                    animo: animo,
                    isInitial: true,
                    usuarios_rutinas_id: usuarios_rutinas_id
                })
            });

            if(wellnessTestResponse.ok){
                handleRoutineAccess();
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error accediendo al inicio de la rutina a realizar');
        } finally {
            setSpinnerIsVisible(false);
        }
    }
    const handleRoutineAccess = async () => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            console.log('Rutina a iniciar:', routineDataAdapted);
            console.log('Datos de la rutina a realizar:', routineStartDataAdapted);

            const rutinaRealizar = routineStartDataAdapted.routineToDo;

            const responseRoutine = await fetch(`http://localhost:3000/routine/current/${rutinaRealizar.insertId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if(responseRoutine.ok) {
                const currentRoutine = await responseRoutine.json();
                console.log('Rutina en curso:', currentRoutine);

                const routineDataResponse = await fetch(`http://localhost:3000/routine/${currentRoutine.rutina_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })

                if(routineDataResponse.ok) {
                    const routinesData = await routineDataResponse.json();
                    console.log('Datos de la rutina:', routinesData);

                    const activitiesDataResponse = await fetch(`http://localhost:3000/activity?routineId=${currentRoutine.rutina_id}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })

                    if(activitiesDataResponse.ok) {
                        const activitiesData = await activitiesDataResponse.json();
                        console.log('Datos de las actividades:', activitiesData);

                        router.push({
                            pathname: '/plans/RoutineStartScreen',
                            params: {
                                currentRoutine: JSON.stringify(currentRoutine),
                                activitiesOfRoutine: JSON.stringify(activitiesData.activitiesList),
                                activitiesValues: JSON.stringify(activitiesData.activitiesParams),
                                routineToDo: JSON.stringify(routinesData)
                            }
                        })
                    }
                }
            }
        } catch (error) {
            console.error('Error accediendo al inicio de la rutina a realizar:', error);
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
        )
    } else {
        return(
            <ScrollView style={styles.container}>
                <View style={styles.wellnessTestAreaRows}>
                    <Text style={styles.title}>Test de bienestar inicial</Text>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de dolor</Text>
                        <View>
                            <Picker
                                selectedValue={dolor}
                                onValueChange={(itemValue) => setDolor(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy alto" value="muy alto"/>
                                <Picker.Item label="Alto" value="alto"/>
                                <Picker.Item label="Normal" value="normal"/>
                                <Picker.Item label="Poco" value="poco"/>
                                <Picker.Item label="Nada" value="nada"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de sueño</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={sueno}
                                onValueChange={(itemValue) => setSueno(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy dormido" value="muy dormido"/>
                                <Picker.Item label="Algo dormido" value="algo dormido"/>
                                <Picker.Item label="Despierto" value="despierto"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de fatiga</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={fatiga}
                                onValueChange={(itemValue) => setFatiga(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy alta" value="muy alta"/>
                                <Picker.Item label="Algo alta" value="algo alta"/>
                                <Picker.Item label="Media" value="media"/>
                                <Picker.Item label="Baja" value="baja"/>
                                <Picker.Item label="Nula" value="nula"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Estado de ánimo</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={animo}
                                onValueChange={(itemValue) => setAnimo(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Triste" value="triste" />
                                <Picker.Item label="Enfadado" value="enfadado" />
                                <Picker.Item label="Contento" value="contento" />
                                <Picker.Item label="Neutro" value="neutro" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.submitButton}>
                        <Button title="Subir test" onPress={() => handleRoutinePerformAccess()} />
                    </View>
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
    spinnerContainer: {
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
        marginBottom: 20,
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        marginBottom: 30,
    },
    wellnessTestAreaRows: {
        paddingHorizontal: 0,
    },
    wellnessTestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    rowsText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        width: '60%',
    },
    picker: {
        height: 45,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#01b888',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        shadowColor: '#01b888',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
