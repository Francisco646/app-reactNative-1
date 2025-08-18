import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsGeneralScreen() {

  return (
    <ScrollView style={styles.container}>
    <View style={styles.topContainer}>
        <Text style={styles.topContainerTitle}>Ajustes Generales</Text>
    </View>
    <View style={styles.mainContainer}>
        {settingsOptions.map((item, index) => (
        <View key={index} style={styles.mainSubContainer}>
            <Text style={styles.mainSubContainerItem}>{item}</Text>
        </View>
        ))}
    </View>
    </ScrollView>
  );
}

const settingsOptions = [
  'Notificaciones',
  'Ajustes de Privacidad',
  'Accesibilidad',
  'Ajustes de Red',
  'Acerca de la aplicación',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#76daff',
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginLeft: 10,
    height: 75,
  },
  topContainerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#76daff',
    width: '80%',
  },
  mainSubContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  mainSubContainerItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
