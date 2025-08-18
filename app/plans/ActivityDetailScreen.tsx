import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useLocalSearchParams} from "expo-router";

/* Mostrar los datos sobre una actividad específica de un plan */
export default function ActivityDetailScreen() {

    const { activitiesData } = useLocalSearchParams();

    const activitiesDataAdapted = activitiesData
        ? JSON.parse(Array.isArray(activitiesData) ? activitiesData[0]: activitiesData)
        : [];

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{activitiesDataAdapted.nombre}</Text>
            </View>
            <View style={styles.topImageContainer}>
                <Image style={styles.topImageImage} source={require('../../assets/images/image_1296698.png')} resizeMode="contain" />
            </View>
            <View>
                <Text style={styles.activityKeyPointsTitle}>
                    Descripción de la actividad:
                    {activitiesDataAdapted.descripcion}
                </Text>
            </View>
            <View style={styles.activityDescriptionContainer}>
                <Text style={styles.activityDescriptionText}>
                     -- Número de series: {activitiesDataAdapted.numero_series}
                     -- Número de repeticiones (si procede): {activitiesDataAdapted.numero_repeticiones}
                     -- Duración (en minutos, si procede): {activitiesDataAdapted.duracion_minutos}
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
