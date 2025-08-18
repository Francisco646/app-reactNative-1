import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";

const Pulse = require('react-native-pulse').default;

export default function RoutineStartScreen() {

    const { activitiesOfRoutine, routineToDo } = useLocalSearchParams();
    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    const activitiesOfRoutineAdapted = activitiesOfRoutine
        ? JSON.parse(Array.isArray(activitiesOfRoutine) ? activitiesOfRoutine[0]: activitiesOfRoutine)
        : [];

    const routineToDoAdapted = routineToDo
        ? JSON.parse(Array.isArray(routineToDo) ? routineToDo[0]: routineToDo)
        : [];

    const handleRoutineRealizationScreen = async () => {
        try {
            setSpinnerIsVisible(true);

            router.push({
                pathname: '/plans/RoutineRealizationScreen',
                params: {
                    activitiesOfRoutine: JSON.stringify(activitiesOfRoutineAdapted),
                    routineToDo: JSON.stringify(routineToDoAdapted)
                }
            });

        } catch (error) {
            console.error(error);
            Alert.alert('Error accediendo a la realización de las rutinas:');
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    if(spinnerIsVisible) {
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
                <Text style={styles.title}>{routineToDoAdapted.nombre}</Text>
                <Text style={styles.subtitle}>{routineToDoAdapted.descripcion}</Text>
                <Text style={styles.subtitle}>Número de ejercicios: {activitiesOfRoutineAdapted.length}</Text>

                <TouchableOpacity style={styles.startButton} onPress={() => handleRoutineRealizationScreen()}>
                    <Text style={styles.buttonText}>Comenzar rutina</Text>
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
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
    startButton: {
        backgroundColor: '#01b888',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
