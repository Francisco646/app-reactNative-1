import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import DailyTrackerCard from './rewards/DailyTrackerCard';

// @ts-ignore
const RewardStatusBadge = ({ isCompleted }) => (
    <View style={[styles.badgeContainer, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
        <Text style={styles.badgeText}>{isCompleted ? '✓' : '...'}</Text>
    </View>
);

// @ts-ignore
export default function RewardList({ rewards }) {
    return (
        <ScrollView contentContainerStyle={styles.rewardsListContainer}>
            {/* @ts-ignore */}
            {rewards.map((reward) => {
                // Aquellos logros que no pueden obtenerse realizando planes, rutinas, actividades (ej: dormir 8 horas, beber dos litros de agua diarios, etc.)
                if (!reward.logro_fisico) {
                    return (
                        <DailyTrackerCard
                            key={reward.id}
                            id={reward.id}
                            title={reward.nombre}
                            description={reward.detalles}
                            totalDays={reward.progreso_necesario}
                            isCompleted={reward.completado}
                        />
                    );
                } else {
                    return (
                        <View
                            key={reward.id}
                            style={[
                                styles.rewardCard,
                                reward.completado ? styles.cardCompleted : styles.cardPending
                            ]}
                        >
                            <View style={styles.rewardContent}>
                                <Text style={styles.rewardTitle}>{reward.nombre}</Text>
                                <Text style={styles.rewardDescription}>{reward.detalles}</Text>
                            </View>
                            <RewardStatusBadge isCompleted={reward.completado} />
                        </View>
                    );
                }
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rewardsListContainer: {
        paddingHorizontal: 15,
    },
    rewardCard: {
        padding: 20,
        borderRadius: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
    },
    cardCompleted: {
        backgroundColor: '#01b888',
        borderLeftWidth: 5,
        borderLeftColor: '#f1c40f',
    },
    cardPending: {
        backgroundColor: '#e0e0e0',
        borderLeftWidth: 5,
        borderLeftColor: '#95a5a6',
    },
    rewardContent: {
        flex: 1,
        marginRight: 15,
    },
    rewardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    rewardDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    badgeContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    badgeCompleted: {
        backgroundColor: '#f1c40f',
        borderColor: '#f39c12',
    },
    badgePending: {
        backgroundColor: '#bdc3c7',
        borderColor: '#7f8c8d',
    },
    badgeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});
