import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

/* Mostrar los datos sobre las rutinas de un plan */
export default function PlanDetailScreen() {
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Plan 1</Text>
            </View>
            <View style={styles.planRoutinesContainer}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    titleContainer:{
        margin: 20,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    planRoutinesContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    planRoutinesSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
});
