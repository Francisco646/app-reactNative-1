import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

/* Mostrar los datos sobre una actividad específica de un plan */
export default function ActivityDetailScreen() {
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Título de la actividad</Text>
            </View>
            <View style={styles.topImageContainer}>
                <Image style={styles.topImageImage} source={require('../../assets/image_1296698.png')} resizeMode="contain" />
            </View>
            <View>
                <Text style={styles.activityKeyPointsTitle}>
                    Key Points of the Activity:
                </Text>
                <View style={styles.activityKeyPointsContainer}>
                    <Text style={styles.activityKeyPointsText}>- Punto 1</Text>
                    <Text style={styles.activityKeyPointsText}>- Punto 2</Text>
                    <Text style={styles.activityKeyPointsText}>- Punto 3</Text>
                </View>
            </View>
            <View style={styles.activityDescriptionContainer}>
                <Text style={styles.activityDescriptionTitle}>
                    Descripción de la actividad:
                </Text>
                <Text style={styles.activityDescriptionText}>
                    Introducir descripción de la actividad en este apartado.
                </Text>
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
    topImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
        height: 75,
    },
    topImageImage: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        padding: 10,
    },
    activityKeyPointsContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    activityKeyPointsTitle: {
        fontSize: 24,
        color: '#000000',
        marginVertical: 15,
    },
    activityKeyPointsText: {
        fontSize: 16,
        color: '#000000',
        marginVertical: 10,
    },
    activityDescriptionContainer: {
        fontSize: 24,
        color: '#000000',
        marginVertical: 15,
    },
    activityDescriptionTitle: {
        fontSize: 24,
        color: '#000000',
        marginVertical: 15,
    },
    activityDescriptionText: {
        fontSize: 16,
        color: '#000000',
        marginVertical: 10,
    },
});
