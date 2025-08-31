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
                        activitiesData: JSON.stringify(activitiesData.activitiesList),
                        activitiesValues: JSON.stringify(activitiesData.activitiesParams),
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
                <View style={styles.header}>
                    <Text style={styles.titleText}>{planData?.nombre || 'Plan'}</Text>
                    {planData?.descripcion && (
                        <Text style={styles.planDescription}>{planData.descripcion}</Text>
                    )}
                </View>

                <View style={styles.buttonActionContainer}>
                    {activePlan ? (
                        <TouchableOpacity style={[styles.actionButton, styles.deselectButton]} onPress={() => handlePlanDeselection()}>
                            <Text style={styles.buttonText}>Deseleccionar Plan</Text>
                        </TouchableOpacity>
                    ) : selectablePlan ? (
                        <TouchableOpacity style={[styles.actionButton, styles.selectButton]} onPress={() => handlePlanSelection()}>
                            <Text style={styles.buttonText}>Seleccionar Plan</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.infoText}>Ya tienes otro plan activo. Para seleccionar este, deselecciona el anterior.</Text>
                    )}
                </View>

                <View style={styles.routinesSection}>
                    <Text style={styles.sectionTitle}>Rutinas del Plan</Text>
                    {/* @ts-ignore */}
                    {routinesData.map((routine, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.routineCard}
                            onPress={() => handleRoutineAccess(routine)}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.routineName}>{routine.nombre}</Text>
                            </View>
                            <View style={styles.cardFooter}>
                                <Text style={styles.cardInfo}>

                                    Actividades: {routine.actividadesCount || 'Desconocido'}
                                </Text>
                                <View style={styles.cardButton}>
                                    <Text style={styles.cardButtonText}>Comenzar</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
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
    planDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonActionContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    actionButton: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    selectButton: {
        backgroundColor: '#01b888',
    },
    deselectButton: {
        backgroundColor: '#d1821c',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    routinesSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    routineCard: {
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
    },
    routineName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cardFooter: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: {
        fontSize: 14,
        color: '#666',
    },
    cardButton: {
        backgroundColor: '#01b888',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
    },
    cardButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
