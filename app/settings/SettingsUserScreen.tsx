import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsUserScreen() {
  const navigation = useNavigation<any>();

  // Parámetros propios del usuario, enviados desde la pantalla de entrada de ajustes (la anterior a esta)
  const { nombre, email, telefono, fecha_nacimiento, tipo_enfermedad, fecha_fin_tratamiento } = useLocalSearchParams();

  const handleParameterChange = async (pantalla: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://localhost:3000/login/status', {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });

      if(response.status === 200) {
        
        switch(pantalla){
          case 'password':
            router.push('/settings/UpdatePasswordScreen');
            break;

          case 'phone':
            router.push('/settings/UpdatePhoneScreen');
            break;

          case 'email':
            router.push('/settings/UpdateEmailScreen');
            break;

          default:
            console.error('La pantalla seleccionada no existe. Volver a inicio.');
            router.push('/');
        }
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Error cambiando la contraseña');
    }

    router.push('/')
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topContainerTitle}>Ajustes de Usuario</Text>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.mainSubContainer}>
          <Text style={styles.mainSubContainerTitle}>Datos de perfil</Text>
          <Text style={styles.mainSubContainerDetails}>--  Nombre: {nombre} </Text>
          <Text style={styles.mainSubContainerDetails}>--  Correo Electrónico: {email} </Text>
          <Text style={styles.mainSubContainerDetails}>--  Teléfono: {telefono} </Text>
        </View>

        <View style={styles.mainSubContainer}>
          <Text style={styles.mainSubContainerTitle}>Cambio de parámetros de usuario</Text>
          
          <TouchableOpacity
            style={styles.mainSubContainerButton}
            onPress={() => handleParameterChange('password')}>
            <Text style={{color: '#fff'}}>Cambiar Contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainSubContainerButton}
            onPress={() => handleParameterChange('phone')}>
            <Text style={{color: '#fff'}}>Cambiar Teléfono</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainSubContainerButton}
            onPress={() => handleParameterChange('email')}>
            <Text style={{color: '#fff'}}>Cambiar Email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainSubContainer}>
          <Text style={styles.mainSubContainerTitle}>Datos Médicos generales</Text>
          <Text style={styles.mainSubContainerDetails}>--  Fecha de Nacimiento: {fecha_nacimiento} </Text>
          <Text style={styles.mainSubContainerDetails}>--  Tipo de enfermedad: {tipo_enfermedad} </Text>
          <Text style={styles.mainSubContainerDetails}>--  Fecha de fin de tratamiento: {fecha_fin_tratamiento} </Text>
        </View>
      </View>
    </ScrollView>
  );
};

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
    width: '100%',
  },
  mainSubContainer: {
    padding: 20,
    margin: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  mainSubContainerTitle: {
    fontSize: 18,
    color: '#373737',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mainSubContainerDetails: {
    fontSize: 16,
    color: '#717171',
    marginVertical: 5,
  },
  mainSubContainerButton: {
    padding: 10,
    backgroundColor: '#00a69a',
    borderRadius: 5,
    marginTop: 10,
  },
});