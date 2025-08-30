import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars';

const Pulse = require('react-native-pulse').default;

// Configurar el calendario en español
LocaleConfig.locales['es'] = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

/**
 * Pantalla de calendario para visualizar las rutinas por día.
 */
export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [routinesForSelectedDay, setRoutinesForSelectedDay] = useState([]);
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});

    /**
     * Marca un día como seleccionado en el calendario.
     * @param {string} dateString - La fecha en formato YYYY-MM-DD.
     */

    { /* @ts-ignore */ }
    const markSelectedDay = (dateString) => {
        setMarkedDates({
            [dateString]: {
                selected: true,
                selectedColor: '#0032fa',
                selectedTextColor: '#fff',
            },
        });
    };

    /**
     * Maneja la selección de un día en el calendario.
     * @param {object} day - El objeto del día seleccionado.
     */

    { /* @ts-ignore */ }
    const handleDayPress = async (day) => {
        setSelectedDate(day.dateString);
        markSelectedDay(day.dateString);
        await handleDaySelection(day.dateString);
    };

    /**
     * Obtiene las rutinas para un día específico.
     * @param {string} dateString - La fecha en formato YYYY-MM-DD.
     */

    { /* @ts-ignore */ }
    const handleDaySelection = async (dateString) => {
        if (!dateString) {
            setRoutinesForSelectedDay([]);
            return;
        }

        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            // Rutinas del día
            const response = await fetch(`http://localhost:3000/routine/date?date=${dateString}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error('Error fetching calendar data');
                setRoutinesForSelectedDay([]);
                return;
            }

            const data = await response.json();
            let routinesList = [];

            // Lógica original: Bucle para obtener los detalles de cada rutina
            for (const routine of data) {
                const responseRoutines = await fetch(`http://localhost:3000/routine/${routine.rutina_id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (responseRoutines.ok) {
                    const routinesData = await responseRoutines.json();
                    routinesList.push(routinesData);
                } else {
                    console.error('Error fetching routine data');
                }
            }

            { /* @ts-ignore */ }
            setRoutinesForSelectedDay(routinesList);
        } catch (error) {
            console.error("Error seleccionando las rutinas: ", error);
            Alert.alert("Error", "No se pudieron cargar las rutinas. Inténtalo de nuevo.");
            setRoutinesForSelectedDay([]);
        } finally {
            setSpinnerIsVisible(false);
        }
    };

    /**
     * Navega a la pantalla de detalle de una rutina.
     * @param {object} routine - El objeto de la rutina a ver.
     */
    { /* @ts-ignore */ }
    const handleRoutineAccess = async (routine) => {
        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`http://localhost:3000/activity?routineId=${routine.id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const activitiesData = await response.json();
                router.push({
                    pathname: '/plans/RoutineDetailScreen',
                    params: {
                        routineData: JSON.stringify(routine),
                        activitiesData: JSON.stringify(activitiesData),
                        isThisPlanActive: JSON.stringify(true)
                    }
                });
            } else {
                Alert.alert("Error", "No se pudo acceder a la rutina.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al acceder a la rutina.");
        } finally {
            setSpinnerIsVisible(false);
        }
    };

    // Carga inicial de datos al montar el componente
    useEffect(() => {
        handleDayPress({ dateString: selectedDate });
    }, []);

    // Renderizar un spinner si es visible
    if (spinnerIsVisible) {
        return (
            <View style={styles.spinnerContainer}>
                <Pulse
                    color="#0032fa"
                    numPulses={3}
                    diameter={100}
                    speed={1}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Calendario de Actividades</Text>
            </View>

            <RNCalendar
                style={styles.calendarCard}
                theme={{
                    arrowColor: '#0032fa',
                    todayTextColor: '#01b888',
                    selectedDayBackgroundColor: '#0032fa',
                    selectedDayTextColor: '#fff',
                    textDayFontWeight: '600',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: 'bold',
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                    textSectionTitleColor: '#666',
                }}
                onDayPress={handleDayPress}
                markedDates={markedDates}
            />

            {/* Listado de rutinas para el día seleccionado */}
            <View style={styles.routinesSection}>
                <Text style={styles.sectionTitle}>
                    Actividades del Día
                </Text>
                {routinesForSelectedDay.length > 0 ? (
                    // @ts-ignore
                    routinesForSelectedDay.map((routine, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.routineCard}
                            onPress={() => handleRoutineAccess(routine)}
                        >
                            { /* @ts-ignore */ }
                            <Text style={styles.routineName}>{routine.nombre}</Text>

                            { /* @ts-ignore */ }
                            <Text style={styles.routineDescription}>{routine.descripcion}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.noRoutinesCard}>
                        <Text style={styles.noRoutinesText}>
                            No hay actividades para este día.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
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
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    calendarCard: {
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        paddingBottom: 10,
    },
    routinesSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
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
        borderLeftColor: '#0032fa',
    },
    routineName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    routineDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    noRoutinesCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    noRoutinesText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});
