import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Componente de tarjeta para el seguimiento de hábitos diarios.
 * Permite al usuario marcar días y reclamar el logro una vez completado.
 * @param {object} props
 * @param {string} props.id - ID del logro.
 * @param {string} props.title - Título del logro.
 * @param {string} props.description - Descripción del logro.
 * @param {number} props.totalDays - Número de días para completar el logro.
 * @param {boolean} props.isCompleted - Estado inicial del logro.
 */
// @ts-ignore
export default function DailyTrackerCard ({ id, title, description, totalDays, isCompleted: initialIsCompleted }) {
    const [progress, setProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const allDaysCompleted = progress >= totalDays;

    /**
     * Obtener el progreso desde la base de datos
     */
    useEffect(() => {
        const fetchProgress = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener el token de usuario.');
                return;
            }

            const response = await fetch(`http://localhost:3000/reward/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {

                const rewardCommonData = data.rewardCommonData;
                const rewardUserData = data.userRewardData;

                setProgress(rewardUserData.progreso);
                setIsCompleted(rewardUserData.progreso === rewardCommonData.progreso_necesario);
            } else {
                Alert.alert('Error', data.message || 'No se pudo obtener el progreso.');
            }
        };

        fetchProgress();
    }, [id]);

    /**
     * Actualizar el progreso del logro.
     */
    const handleUpdateProgress = async () => {
        try {
            if (isCompleted || allDaysCompleted) return;

            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener el token de usuario.');
                return;
            }
            const response = await fetch(`http://localhost:3000/reward/${id}/progress-update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if(response.ok) {
                setProgress(progress + 1);
            }

        } catch(error) {
            console.error('Error actualizando el progreso:', error);
            Alert.alert('Error', 'No se pudo actualizar el progreso. Inténtalo de nuevo.');
        }
    }

    /**
     * Reclama el logro y lo marca como completado en el servidor.
     */
    const handleClaimReward = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener el token de usuario.');
                return;
            }

            const response = await fetch(`http://localhost:3000/reward/${id}/completed`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setIsCompleted(true);
                Alert.alert('¡Felicitaciones!', '¡Has completado este logro!');
            } else {
                Alert.alert('Error', data.message || 'No se pudo reclamar el logro.');
            }
        } catch (error) {
            console.error('Error reclamando el logro:', error);
            Alert.alert('Error', 'No se pudo reclamar el logro. Inténtalo de nuevo.');
        }
    };

    return(
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>

            {/* Círculos para el seguimiento diario */}
            <View style={styles.daysContainer}>
                {Array.from({ length: totalDays }).map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.dayCircle, index < progress ? styles.dayCompleted : styles.dayPending]}
                        onPress={() => handleUpdateProgress()}
                        disabled={isCompleted || index < progress}
                    >
                        <Text style={[styles.dayText, { color: index < progress ? '#fff' : '#000' }]}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Botón de reclamo o mensaje de estado */}
            {isCompleted ? (
                <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>Completado</Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.claimButton, !allDaysCompleted && styles.claimButtonDisabled]}
                    onPress={() => handleClaimReward()}
                    disabled={!allDaysCompleted}
                    >
                    <Text style={styles.claimButtonText}>¡Reclamar!</Text>
                </TouchableOpacity>
            )}
        </View>
    );

}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  dayCompleted: {
    backgroundColor: '#01b888',
    borderColor: '#019a74',
  },
  dayPending: {
    backgroundColor: '#e0e0e0',
    borderColor: '#ccc',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  claimButton: {
    backgroundColor: '#13acff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  claimButtonDisabled: {
    backgroundColor: '#a9a9a9',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedBadge: {
    backgroundColor: '#f1c40f',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
