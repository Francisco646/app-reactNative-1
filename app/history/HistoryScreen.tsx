import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HistoryScreen() {

    const { dates, actions } = useLocalSearchParams();

    const normalizedDates = typeof dates === 'string' ? dates.split(',') : dates;
    const normalizedActions = typeof actions === 'string' ? actions.split(',') : actions;

    return ( 
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.topContainerTitle}>Historial</Text>
                <TouchableOpacity onPress={() => router.push('/settings/SettingsLandingScreen')}>
                <Image
                    source={require('../../assets/images/settings.png')}
                    style={styles.topContainerSettingsIcon}
                />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                {normalizedDates.map((date, index) => (
                <View key={index} style={{ margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 5 }}>
                    <Text style={{ color: '#555', fontSize: 16, fontWeight: 'bold' }}>-- Fecha: {date}</Text>
                    <Text style={{ color: '#555' }}>-- Acción: {normalizedActions[index]}</Text>
                </View>
                ))}
            </View>
        </ScrollView>
    );        
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  topContainer: {
    margin: 20,
    flexDirection: 'row',
  },
  topContainerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00a69a',
    flex: 1,
    textAlign: 'center',
  },
  topContainerSettingsIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
    tintColor: '#00a69a',
  },
  mainContainer:{

  }
})