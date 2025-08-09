import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

/* Mostrar los datos sobre una rutina específica de un plan */
export default function RoutineDetailScreen() {
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Detalles Rutina</Text>
            </View>
            <View style={styles.routineActivitiesContainer}>
                <Text style={styles.routineActivitiesTitle}>Actividades de la Rutina</Text>

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
    routineActivitiesContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    routineActivitiesTitle: {
        fontSize: 24,
        color: '#000000',
        marginVertical: 15,
    },
    routineActivitiesSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
});
