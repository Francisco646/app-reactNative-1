import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';

// @ts-ignore
const RewardStatusBadge = ({ isCompleted }) => (
    <View style={[styles.badgeContainer, isCompleted ? styles.badgeCompleted : styles.badgePending]}>
        <Text style={styles.badgeText}>{isCompleted ? '✓' : '...'}</Text>
    </View>
);

// @ts-ignore
export default function RewardList({ rewardsTitle, rewardsDescription, rewardsCompleted }) {
    return (
        <ScrollView contentContainerStyle={styles.rewardsListContainer}>
            { /* @ts-ignore */ }
            {rewardsTitle.map((title, index) => (
                <View
                    key={index}
                    style={[
                        styles.rewardCard,
                        rewardsCompleted[index] === 'true' ? styles.cardCompleted : styles.cardPending
                    ]}
                >
                    <View style={styles.rewardContent}>
                        <Text style={styles.rewardTitle}>{title}</Text>
                        <Text style={styles.rewardDescription}>{rewardsDescription[index]}</Text>
                    </View>
                    <RewardStatusBadge isCompleted={rewardsCompleted[index] === 'true'} />
                </View>
            ))}
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
