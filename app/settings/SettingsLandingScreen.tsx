import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function SettingsLandingScreen() {

  const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

  const handleGeneralSettings = () => {
    // Por ahora, únicamente ir a la pantalla
    router.push('/settings/SettingsGeneralScreen')
  }

  // Obtener los datos del usuario, tanto los normales como los médicos
  const handleSpecificSettings = async () => {

    try {
        setSpinnerIsVisible(true);
        const token = await AsyncStorage.getItem('userToken');

        if(!token){
            Alert.alert("No hay una sesión activa");
            return;
        }

        const response = await fetch('http://localhost:3000/setting/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        if(response.status === 200){
            const data = await response.json()

            const nombre = data.nombre
            const email = data.email
            const telefono = data.telefono
            const fecha_nacimiento = data.fecha_nacimiento
            const tipo_enfermedad = data.tipo_enfermedad
            const fecha_fin_tratamiento = data.fecha_fin_tratamiento

            router.push({
                pathname: '/settings/SettingsUserScreen',
                params: {
                    nombre,
                    email,
                    telefono,
                    fecha_nacimiento,
                    tipo_enfermedad,
                    fecha_fin_tratamiento
                }
            })
        } else if (response.status === 401){
            router.push('/login/LoginScreen');
        } else {
            router.push('/');
        }
    } catch (error) {
      console.log('Error obteniendo los ajustes de usuario:', error);
      Alert.alert('Error obteniendo los ajustes de usuario');
    } finally {
      setSpinnerIsVisible(false);
    }

  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
            <Text style={styles.topContainerTitle}>Ajustes </Text>
        </View>
        <View style={styles.mainContainer}>
            <View style={styles.settingsSubContainer}>
            <Text style={styles.topContainerTitle}>
                Configuración General
            </Text>
            <TouchableOpacity
                style={styles.settingsSubContainerButton}
                onPress={() => handleGeneralSettings()}>
                <Text style={styles.settingsSubContainerButtonText}>
                Ajustes Generales
                </Text>
            </TouchableOpacity>

            </View>
            <View style={styles.settingsSubContainer}>
            <Text style={styles.topContainerTitle}>
                Configuración de Usuario
            </Text>
            <TouchableOpacity
                style={styles.settingsSubContainerButton}
                onPress={() => handleSpecificSettings()}>
                <Text style={styles.settingsSubContainerButtonText}>
                Ajustes de Usuario
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f6fc',
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    marginLeft: 0,
    height: 75,
    width: '100%',
    backgroundColor: '#00a69a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#00a69a',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 6.0,
    elevation: 8,
  },
  topContainerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  settingsSubContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 30,
    shadowColor: '#00a69a',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    alignItems: 'center',
  },
  settingsSubContainerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00a69a',
    marginBottom: 12,
    textAlign: 'center',
  },
  settingsSubContainerButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    margin: 8,
    backgroundColor: '#76daff',
    shadowColor: '#00a69a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  settingsSubContainerButtonText: {
    fontSize: 20,
    color: '#0032fa',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
