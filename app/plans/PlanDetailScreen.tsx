import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pulse = require('react-native-pulse').default;

/* Mostrar los datos sobre las rutinas de un plan */
export default function PlanDetailScreen() {

    const { data, plan, planIsActive, canSelectPlan, allPlans } = useLocalSearchParams();
    const routinesData = data
        ? JSON.parse(Array.isArray(data) ? data[0] : data)
        : [];

    const planData = plan
        ? JSON.parse(Array.isArray(plan) ? plan[0] : plan)
        : [];

    // Parseamos `allPlans` para tenerlo listo
    const allPlansArray = allPlans
        ? JSON.parse(Array.isArray(allPlans) ? allPlans[0] : allPlans)
        : [];

    const isThisPlanActive = planIsActive === 'true';
    const canUserSelectPlan = canSelectPlan === 'true';

    console.log('Plan is active:', isThisPlanActive);
    console.log('User can select plan:', canUserSelectPlan);

    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);
    const [ activePlan, setActivePlan ] = React.useState(isThisPlanActive);
    const [ selectablePlan, setSelectablePlan ] = React.useState(canUserSelectPlan);

    // Usuario elige hacer este plan
    const handlePlanSelection = async() => {
        try{
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            console.log(planData)

            const response = await fetch('http://localhost:3000/plan/new-user-plan', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    planId: planData.id
                })
            })

            const data = await response.json();
            console.log(data);

            setActivePlan(true);
            setSelectablePlan(false);

            // Obtener los planes del usuario actualizados
            const responseUserPlans = await fetch('http://localhost:3000/plan/user-plan', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const userPlansData = await responseUserPlans.json();
            
            router.replace({
                pathname: '/plans/PlanLandingScreen',
                params: {
                    allPlans: JSON.stringify(allPlansArray),
                    userPlans: JSON.stringify(userPlansData?.planOfUser || []),
                    userPlansData: JSON.stringify(userPlansData?.planGeneralData || {})
                }
            })

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
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    planId: planData.id
                })
            });

            // Si hay un código de error exitoso, se obtienen los planes del usuario actualizados
            // y se viaja a la pantalla de inicio de los planes
            if(response.status === 200 || response.status === 204) {
                router.replace({
                    pathname: '/plans/PlanLandingScreen',
                    params: {
                        allPlans: JSON.stringify(allPlansArray),
                        userPlans: JSON.stringify([]),
                        userPlansData: JSON.stringify({})
                    }
                })
            }

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
                    {activePlan ? (
                        <TouchableOpacity style={styles.deselectButton} onPress={() => handlePlanDeselection()}>
                            <Text style={styles.buttonText}>Deseleccionar Plan</Text>
                        </TouchableOpacity>
                    ) : selectablePlan ? (
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
