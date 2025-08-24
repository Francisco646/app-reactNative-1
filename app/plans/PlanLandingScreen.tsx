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
                <View style={styles.header}>
                    <Text style={styles.titleText}>Elige tu Aventura</Text>
                    <Text style={styles.subtitleText}>Selecciona un plan para empezar a jugar</Text>
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.filterTitle}>Filtrar planes</Text>
                    <View style={styles.filterContainer}>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filtro 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filtro 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton}>
                            <Text style={styles.filterButtonText}>Filtro 3</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.planListContainer}>
                    <Text style={styles.planListTitle}>Planes Disponibles</Text>
                    { /* @ts-ignore */ }
                    {allPlansArray.map((plan) => {
                        const isActive = userHasActivePlan && plan.id === userPlansDataObj.id;
                        return (
                            <TouchableOpacity
                                key={plan.id}
                                style={[styles.planCard, isActive && styles.activePlanCard]}
                                onPress={() => handleRoutinesAccess(plan)}
                            >
                                <View style={styles.planCardContent}>
                                    <Text style={styles.planName}>{plan.nombre}</Text>
                                    {isActive && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>ACTIVO</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Color de fondo más suave
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
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    filterButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    filterButtonText: {
        color: '#666',
        fontWeight: 'bold',
    },
    planListContainer: {
        marginBottom: 20,
    },
    planListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    planCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activePlanCard: {
        borderColor: '#01b888', // Borde verde para el plan activo
    },
    planCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    planDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    badge: {
        backgroundColor: '#01b888',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
