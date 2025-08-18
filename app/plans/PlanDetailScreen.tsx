import React from 'react';
import {View, Text, StyleSheet, Image, Alert, TouchableOpacity} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Pulse = require('react-native-pulse').default;

/* Mostrar los datos sobre las rutinas de un plan */
export default function PlanDetailScreen() {

    const { data, plan, planIsActive, canSelectPlan } = useLocalSearchParams();
    const routinesData = data
        ? JSON.parse(Array.isArray(data) ? data[0] : data)
        : [];

    const planData = plan
        ? JSON.parse(Array.isArray(plan) ? plan[0] : plan)
        : [];

    const isThisPlanActive = planIsActive === 'true';
    const canUserSelectPlan = canSelectPlan === 'true';

    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    // Usuario elige hacer este plan
    const handlePlanSelection = async() => {
        try{
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/plan/new-user-plan', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();
            console.log(data);
            router.push('/');

        } catch(error) {
            console.error(error);
            Alert.alert("Error seleccionando la rutina");
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    // Usuario elige no hacer este plan
    const handlePlanDeselection = async() => {
        try{
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch('http://localhost:3000/plan/deleted-plan', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json();
            console.log(data);
            router.push('/');

        } catch(error) {
            console.error(error);
            Alert.alert("Error deseleccionando la rutina");
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    // @ts-ignore
    const handleRoutineAccess = async(routine) => {
        try{
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`http://localhost:3000/activity?routineId=${routine.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.status === 200) {
                const activitiesData = await response.json();
                console.log('Data of Activities');

                router.push({
                    pathname: '/plans/RoutineDetailScreen',
                    params: {
                        routineData: JSON.stringify(routine),
                        activitiesData: JSON.stringify(activitiesData),
                        isThisPlanActive: JSON.stringify(isThisPlanActive)
                    }
                })
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error accediendo a la rutina");
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
        );
    } else {
        return(
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{planData.nombre}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    {isThisPlanActive ? (
                        <TouchableOpacity style={styles.deselectButton} onPress={() => handlePlanDeselection()}>
                            <Text style={styles.buttonText}>Deseleccionar Plan</Text>
                        </TouchableOpacity>
                    ) : canUserSelectPlan ? (
                        <TouchableOpacity style={styles.selectButton} onPress={() => handlePlanSelection()}>
                            <Text style={styles.buttonText}>Seleccionar Plan</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.infoText}>Ya tienes otro plan activo.</Text>
                    )}
                </View>
                <View style={styles.planRoutinesContainer}>
                    { /* @ts-ignore */ }
                    {routinesData.map((routine) => (
                        // eslint-disable-next-line react/jsx-key
                        <View style={styles.planRoutinesSubContainer}>
                            <Text>{routine.nombre}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.buttonAccessRoutine} onPress={() => handleRoutineAccess(routine)}>
                                    <Text style={styles.buttonText}>Acceder a la rutina</Text>
                                </TouchableOpacity>
                            </View>
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
    planRoutinesContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    planRoutinesSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
    buttonContainer: {
        marginTop: 20,
    },
    selectButton: {
        backgroundColor: '#01b888',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    deselectButton: {
        backgroundColor: '#d1821cff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    infoText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    buttonAccessRoutine: {
        backgroundColor: '#26a2fa',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    }

});
