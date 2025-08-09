import React from "react";
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';

/* Pantalla general de acceso a planes, rutinas y actividades */
export default function PlanLandingScreen() {
    return(
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Planes</Text>
            </View>
            <View style={styles.planFilterContainer}>
                <Text style={styles.planFilterTitle}>Listado de filtros</Text>
                <View style={styles.planFilterSubContainer}>
                    <Text style={styles.planFilterSubContainerText}>Filtro 1</Text>
                    <Text style={styles.planFilterSubContainerText}>Filtro 2</Text>
                    <Text style={styles.planFilterSubContainerText}>Filtro 3</Text>
                </View>
            </View>
            <View style={styles.planListContainer}>
                <Text style={styles.planListTitle}>Listado de planes</Text>
                <View style={styles.planListSubContainer}></View>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    titleContainer: {
        margin: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
        flex: 1,
    },
    planFilterContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    planFilterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    planFilterSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    planFilterSubContainerText: {
        fontSize: 16,
        color: '#000000',
        marginVertical: 5,
    },
    planListContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        marginVertical: 10,
    },
    planListTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    planListSubContainer: {
        padding: 10,
        backgroundColor: '#26a2fa',
        borderRadius: 15,
        marginVertical: 10,
    },
});
