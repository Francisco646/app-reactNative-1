import { router, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RoutineStartScreen() {

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

    const handleRoutineRealizationScreen = async () => {
        try {
            setSpinnerIsVisible(true);
            console.log('Actividades de la rutina:', activitiesOfRoutineAdapted);
            console.log('Rutina a realizar:', routineToDoAdapted);

            router.push({
                pathname: '/plans/RoutineRealizationScreen',
                params: {
                    currentRoutine: JSON.stringify(currentRoutineAdapted),
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
                <View style={styles.contentContainer}>
                    <Image source={require('../../assets/images/image_1296698.png')} style={styles.image} />
                    <Text style={styles.title}>{routineToDoAdapted.nombre || '¡Comienza la Aventura!'}</Text>
                    <Text style={styles.subtitle}>{routineToDoAdapted.descripcion || 'Prepárate para la rutina.'}</Text>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>Tienes un total de</Text>
                        <Text style={styles.numberText}>{activitiesOfRoutineAdapted.length}</Text>
                        <Text style={styles.infoText}>actividades por completar.</Text>
                    </View>

                    <TouchableOpacity style={styles.startButton} onPress={() => handleRoutineRealizationScreen()}>
                        <Text style={styles.buttonText}>¡Comencemos!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00c3b0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
        marginHorizontal: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    infoBox: {
        backgroundColor: '#f1f1f1',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 30,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 16,
        color: '#444',
    },
    numberText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00b8d4',
        marginVertical: 5,
    },
    startButton: {
        backgroundColor: '#ffc107', 
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#ff9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
