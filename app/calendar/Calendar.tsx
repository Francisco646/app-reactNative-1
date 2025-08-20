
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
import React, { useState } from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';

const Pulse = require('react-native-pulse').default;

export default function Calendar() {
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
    const [routinesForSelectedDay, setRoutinesForSelectedDay] = React.useState<any[]>([]);

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    // @ts-ignore
    const handleDaySelection = async (dateString) => {

        if (!dateString) return;

        try {
            setSpinnerIsVisible(true);
            const token = await AsyncStorage.getItem('userToken');

            const response = await fetch(`http://localhost:3000/routine/date?date=${dateString}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const data = await response.json();
                setRoutinesForSelectedDay(data);
                console.log(data);
            } else {
                console.error('Error fetching calendar data');
            }
        } catch(error) {
            console.error("Error seleccionando las rutinas: ", error)
            Alert.alert("Error en la seleccion de rutinas")
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
                        isThisPlanActive: JSON.stringify('true')
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
            )
    } else {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topContainerTitle}>Calendario</Text>
                </View>

                <RNCalendar
                    style={styles.calendarContainer}
                    theme={{
                        todayTextColor: '#446ef8',
                        selectedDayTextColor: '#fff',
                        dayTextColor: '#000',
                        textDayFontWeight: 'bold',
                        textDayFontSize: 16,
                        textMonthFontWeight: 'bold',
                        textMonthFontSize: 18,
                        textSectionTitleColor: '#0032fa',
                        arrowColor: '#0032fa',
                    }}
                    // @ts-ignore
                    onDayPress={day => {
                        setSelectedDate(day.dateString);
                        handleDaySelection(day.dateString);
                    }}
                    markedDates={{
                        [selectedDate ?? '']: {
                            selected: !!selectedDate,
                            selectedColor: '#0032fa',
                            selectedTextColor: '#fff',
                        },
                    }}
                />

                {/* Título del día seleccionado */}
                {selectedDate && (
                    <Text style={styles.activitiesTitle}>
                        Actividades del día {selectedDate}
                    </Text>
                )}

                {/* Rutinas del día seleccionado, con sus respectivos botones */}
                {selectedDate && (
                    <View style={styles.routinesContainer}>
                    {routinesForSelectedDay.length > 0 ? (
                        // @ts-ignore
                        routinesForSelectedDay.map((routine, idx) => (
                        <View key={idx} style={styles.specificRoutineContainer}>
                            <Text style={styles.specificRoutineText}>
                                {routine.nombre}
                            </Text>
                            <TouchableOpacity style={styles.routineButton} onPress={() => handleRoutineAccess(routine)}>
                                <Text style={styles.routineButtonText}>
                                    Ver rutina
                                </Text>
                            </TouchableOpacity>
                        </View>
                        ))
                    ) : (
                        <Text style={styles.noRoutinesText}>
                        No hay actividades para este día.
                        </Text>
                    )}
                    </View>
                )}
            </ScrollView>
      );
    }
}

// const { routineData, activitiesData, isThisPlanActive } = useLocalSearchParams();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  topContainer: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  topContainerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0032fa',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  activitiesContainer: {
    marginBottom: 15,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0032fa',
    marginTop: 10,
    marginBottom: 20
  },
  routinesContainer: {
    gap: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  specificRoutineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  specificRoutineText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  routineButton: {
    backgroundColor: '#0032fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  routineButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  noRoutinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
