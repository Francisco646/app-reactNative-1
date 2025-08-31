import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {useLocalSearchParams} from "expo-router";

/* Mostrar los datos sobre una actividad específica de un plan */
export default function ActivityDetailScreen() {

    const { activitiesData, activitiesValues, materialData } = useLocalSearchParams();

    const activitiesDataAdapted = activitiesData
        ? JSON.parse(Array.isArray(activitiesData) ? activitiesData[0]: activitiesData)
        : [];

    const materialDataAdapted = materialData
        ? JSON.parse(Array.isArray(materialData) ? materialData[0]: materialData)
        : [];

    const activitiesValuesAdapted = activitiesValues
        ? JSON.parse(Array.isArray(activitiesValues) ? activitiesValues[0]: activitiesValues)
        : [];

    const activityImage = require('../../assets/images/image_1296698.png');
    const tiempo_maximo = activitiesValuesAdapted.tiempo_maximo / 60;

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.titleText}>{activitiesDataAdapted.nombre}</Text>
                <Text style={styles.activityType}>{activitiesDataAdapted.tipo_actividad}</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.activityImage}
                        source={activityImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Series</Text>
                        <Text style={styles.detailValue}>{activitiesValuesAdapted.numero_series}</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Repeticiones</Text>
                        <Text style={styles.detailValue}>{activitiesValuesAdapted.repeticiones}</Text>
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Duración</Text>
                        <Text style={styles.detailValue}>{tiempo_maximo} minutos</Text>
                    </View>
                    <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Descanso</Text>
                        <Text style={styles.detailValue}>{activitiesValuesAdapted.tiempo_descanso} segundos</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.descriptionText}>
                    {activitiesDataAdapted.descripcion}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Materiales necesarios</Text>
                <Text style={styles.descriptionText}>
                    {materialDataAdapted.nombre}
                </Text>
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
    header: {
        alignItems: 'center',
        marginVertical: 20,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    activityType: {
        fontSize: 16,
        color: '#01b888',
        fontWeight: 'bold',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    activityImage: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
    detailBox: {
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        minWidth: 90,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});
