import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import RewardList from '../RewardList';

export default function RewardSpecificScreen() {

    const image = require('../../assets/images/image_1296698.png'); // Example image
    
    const { rewards: rewardsString } = useLocalSearchParams();
    const combinedRewards = JSON.parse(Array.isArray(rewardsString) ? rewardsString[0] : (rewardsString || '[]'));

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.topContainerTitle}>Logros Generales</Text>
            </View>
            <RewardList rewards={combinedRewards} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 25,
        backgroundColor: '#a7faa3',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 8,
        shadowColor: '#00a69a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        marginBottom: 20,
    },
    topContainerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginLeft: 10,
    }
});
