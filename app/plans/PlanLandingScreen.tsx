import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, {useEffect} from "react";
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

    const [ filteredPlans, setFilteredPlans ] = React.useState(allPlansArray);
    const [ selectedDiseaseFilter, setSelectedDiseaseFilter ] = React.useState(null);
    const [ selectedMinAgeFilter, setSelectedMinAgeFilter ] = React.useState(0);
    const [ selectedMaxAgeFilter, setSelectedMaxAgeFilter ] = React.useState(0);

    const diseaseFilters = ['Leucemia', 'Cáncer Cerebral', 'Linfoma Hodgkin', 'Linfoma No Hodgkin'];
    const ageFilters = [
        { min: 5, max: 8 },
        { min: 9, max: 11 },
        { min: 12, max: 14 }
    ];

    console.log('Disease Filters:', diseaseFilters);
    console.log('Age Filters:', ageFilters);

    useEffect(() => {
        const handlePlanFiltering = async () => {
            try {

                if(!selectedDiseaseFilter && selectedMinAgeFilter === 0 && selectedMaxAgeFilter === 0) {
                    const response = await fetch('http://localhost:3000/plan', { method: 'GET' })

                    if(response.ok) {
                        const data = await response.json();
                        console.log('Todos los planes:', data);
                        setFilteredPlans(data);
                    }

                } else if (selectedDiseaseFilter && selectedMinAgeFilter === 0 && selectedMaxAgeFilter === 0) {
                    const response = await fetch(`http://localhost:3000/plan/disease-plan?tipo_enfermedad=${selectedDiseaseFilter}`, { method: 'GET' });

                    if(response.ok) {
                        const data = await response.json();
                        console.log('Planes filtrados por enfermedad:', data);
                        setFilteredPlans(data);
                    }

                } else if (!selectedDiseaseFilter && selectedMinAgeFilter && selectedMaxAgeFilter) {
                    const response = await fetch(`http://localhost:3000/plan/age-plan?edad_minima=${selectedMinAgeFilter}&edad_maxima=${selectedMaxAgeFilter}`, { method: 'GET' });

                    if(response.ok) {
                        const data = await response.json();
                        console.log('Planes filtrados por edad:', data);
                        setFilteredPlans(data);
                    }

                } else {
                    const response = await fetch(`http://localhost:3000/plan/disease-age-plan?tipo_enfermedad=${selectedDiseaseFilter}&edad_minima=${selectedMinAgeFilter}&edad_maxima=${selectedMaxAgeFilter}`, { method: 'GET' });

                    if(response.ok) {
                        const data = await response.json();
                        console.log('Planes filtrados por enfermedad y edad:', data);
                        setFilteredPlans(data);
                    }
                }

            } catch (error) {
                console.error('Error filtrando planes:', error);
                Alert.alert("Error filtrando planes");
            }
        };

        handlePlanFiltering();
    }, [selectedDiseaseFilter, selectedMinAgeFilter, selectedMaxAgeFilter]);



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

            if(response.status === 200) {
                const data = await response.json();
                console.log('Rutinas del plan:', data);

                let planIsActive = false;
                let canSelectPlan = false;

                // Se comprueba si el usuario tiene un plan y si es el seleccionado
                if (userHasActivePlan) {
                    if (plan.id === userPlansDataObj.id) {
                        planIsActive = true;
                        canSelectPlan = false;
                    } else {
                        planIsActive = false;
                        canSelectPlan = false;
                    }
                } else {
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

                    {/* Filtros por enfermedad */}
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Por enfermedad</Text>
                    <View style={styles.filterContainer}>
                        {diseaseFilters.map((disease) => (
                            <TouchableOpacity
                                key={disease}
                                style={[
                                    styles.filterButton,
                                    selectedDiseaseFilter === disease && { backgroundColor: "#01b888" },
                                ]}
                                onPress={() => {
                                    setSelectedDiseaseFilter(
                                        // @ts-ignore
                                        selectedDiseaseFilter === disease ? null : disease
                                    );
                                }}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedDiseaseFilter === disease && { color: "#fff" },
                                    ]}
                                >
                                    {disease}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Filtros por rango de edad */}
                    <Text style={{ fontWeight: "bold", marginTop: 15, marginBottom: 5 }}>
                        Por edad
                    </Text>
                    <View style={styles.filterContainer}>
                        {ageFilters.map((range) => {
                            const isSelected =
                                selectedMinAgeFilter === range.min &&
                                selectedMaxAgeFilter === range.max;

                            return (
                                <TouchableOpacity
                                    key={`${range.min}-${range.max}`}
                                    style={[
                                        styles.filterButton,
                                        isSelected && { backgroundColor: "#01b888" },
                                    ]}
                                    onPress={() => {
                                        if (isSelected) {
                                            setSelectedMinAgeFilter(0);
                                            setSelectedMaxAgeFilter(0);
                                        } else {
                                            setSelectedMinAgeFilter(range.min);
                                            setSelectedMaxAgeFilter(range.max);
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.filterButtonText,
                                            isSelected && { color: "#fff" },
                                        ]}
                                    >
                                        {range.min}-{range.max}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.planListContainer}>
                    <Text style={styles.planListTitle}>Planes Disponibles</Text>
                    { /* @ts-ignore */ }
                    {filteredPlans.map((plan) => {
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
        borderColor: '#01b888',
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
    }
});
