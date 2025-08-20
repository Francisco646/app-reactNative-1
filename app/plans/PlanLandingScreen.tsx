import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pulse = require('react-native-pulse').default;


/* Pantalla general de acceso a planes, rutinas y actividades */
export default function PlanLandingScreen() {

    const { allPlans, userPlans, userPlansData } = useLocalSearchParams();

    // Convertir los parámetros de búsqueda a objetos si es necesario
    const allPlansArray = allPlans
        ? JSON.parse(Array.isArray(allPlans) ? allPlans[0] : allPlans)
        : [];

    const userPlansArray = userPlans
        ? JSON.parse(Array.isArray(userPlans) ? userPlans[0] : userPlans)
        : [];

    const userPlansDataObj = userPlansData
        ? JSON.parse(Array.isArray(userPlansData) ? userPlansData[0] : userPlansData)
        : null;

    // Un objeto vacío {} no significa que haya un plan.
    const userHasActivePlan = userPlansDataObj && Object.keys(userPlansDataObj).length > 0;

    console.log('All Plans:', allPlansArray);
    console.log('User Plans:', userPlansArray);
    console.log('User Plans Data:', userPlansDataObj);

    const [spinnerIsVisible, setSpinnerIsVisible] = React.useState(false);

    // @ts-ignore
    const handleRoutinesAccess = async (plan) => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            // Obtener rutinas (añadir planId)
            const response = await fetch(`http://localhost:3000/routine?planId=${plan.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            // Obtener si el plan está seleccionado


            if(response.status === 200) {
                const data = await response.json();
                console.log('Rutinas del plan:', data);

                let planIsActive = false;
                let canSelectPlan = false;

                if (userHasActivePlan) {
                // Hay un plan seleccionado. Ahora comprueba si es el plan actual
                    if (plan.id === userPlansDataObj.id) {
                        // Plan seleccionado por el usuario
                        planIsActive = true;
                        canSelectPlan = false;
                    } else {
                        // Ya hay un plan seleccionado, pero no es este
                        planIsActive = false;
                        canSelectPlan = false;
                    }
                } else {
                    // No hay ningún plan seleccionado
                    planIsActive = false;
                    canSelectPlan = true;
                }

                router.push({
                    pathname: '/plans/PlanDetailScreen',
                    params: {
                        data: JSON.stringify(data),
                        plan: JSON.stringify(plan),
                        planIsActive: planIsActive.toString(),
                        canSelectPlan: canSelectPlan.toString(),
                        allPlans: JSON.stringify(allPlansArray)
                    }
                });

            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error accediendo a las rutinas");
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
            <ScrollView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Planes</Text>
                </View>
                <View style={styles.planFilterContainer}>
                    <Text style={styles.planFilterTitle}>Listado de filtros</Text>
                    <View style={styles.planFilterSubContainer}>
                        <Text style={styles.planFilterSubContainerText}>Filtro 1</Text>
                        <Text style={styles.planFilterSubContainerText}>Filtro 2</Text>
                        <Text style={styles.planFilterSubContainerText}>Filtro 3</Text>
                    </View>
                </View>
                <View style={styles.planListContainer}>
                    <Text style={styles.planListTitle}>Todos los planes</Text>
                    { /* @ts-ignore */ }
                    {allPlansArray.map((plan) => (
                        // eslint-disable-next-line react/jsx-key
                        <View style={styles.planListSubContainer}>
                            <TouchableOpacity key={plan.id}>
                                <Text>{plan.nombre}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.planListSubContainerButton} onPress={() => handleRoutinesAccess(plan)} >
                                <Text style={styles.planListSubContainerButtonText}>Ver Plan</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    { /* @ts-ignore */ }
                    {userHasActivePlan ? (
                    <>
                        <Text style={styles.planListTitle}>Plan del usuario</Text>
                        <View style={styles.planListSubContainer}>
                            <TouchableOpacity>
                                <Text>{userPlansDataObj.nombre}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.planListSubContainerButton}
                                onPress={() => handleRoutinesAccess(userPlansDataObj)}
                            >
                                <Text style={styles.planListSubContainerButtonText}>Ver Plan</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    ) : null}
                </View>
            </ScrollView>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    titleContainer: {
        margin: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        flex: 1,
    },
    planFilterContainer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    planFilterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    planFilterSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    planFilterSubContainerText: {
        fontSize: 16,
        color: '#000000',
        marginVertical: 5,
    },
    planListContainer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginVertical: 10,
        height: '100%',
    },
    planListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    planListSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
    planListSubContainerButton: {
        padding: 10,
        backgroundColor: '#01b888',
        borderRadius: 15,
        marginVertical: 5,
    },
    planListSubContainerButtonText: {
        fontSize: 16,
        color: '#000000',
    },
});
