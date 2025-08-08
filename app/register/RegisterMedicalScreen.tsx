import {
    Alert,
    Button,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';

import { useLocalSearchParams, useRouter } from "expo-router";

import * as Device from 'expo-device';
import { Platform } from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RegisterMedicalScreen() {
    const router = useRouter(); // Usar el hook
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const info = {
        plataforma: Platform.OS,
        modelo_dispositivo: Device.modelName,
        os: Device.osName,
        osVersion: Device.osVersion,
    };

    /* Received parameters from Register Screen */
    const { name, email, phone, password } = useLocalSearchParams<{
        name: string;
        email: string;
        phone: string;
        password: string;
    }>();

    /* Calendar variables */
    const [birthDay, setBirthDay] = React.useState<string | null>(null);
    const [treatmentEndDay, setTreatmentEndDay] = React.useState<string | null>(null);

    /* Disease variables, disease selection is visible */
    const [selectedDisease, setSelectedDisease] = React.useState<string | null>(null);
    const [isDiseaseModalVisible, setIsDiseaseModalVisible] = React.useState(false);

    /* Medication variables, medication selection is visible */
    const [selectedMedication, setSelectedMedication] = React.useState<string | null>(null);
    const [isMedicationModalVisible, setIsMedicationModalVisible] = React.useState(false);

    /* Selectors variables */
    const diseaseOptions = ['Diabetes', 'Hipertensión', 'Asma'];
    const medicationOptions = ['Ibuprofeno', 'Paracetamol', 'Insulina'];

    const handleRegistration = async() => {
        try{
            setSpinnerIsVisible(true);
            
            const response = await fetch('http://localhost:3000/register/medical', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                    birthDay,
                    selectedDisease,
                    treatmentEndDay,
                    plataforma: info.plataforma,
                    modelo_dispositivo: info.modelo_dispositivo,
                })
            })

            const data = await response.json()
            console.log('Usuario registrado: ', data)
            router.push('/') // Ahora debería funcionar correctamente
        } catch(error){
            console.error('Error durante el registro de datos médicos: ', error)
            Alert.alert('Error registrando datos médicos')
        } finally {
            setSpinnerIsVisible(false);
        }
    }

    if(spinnerIsVisible) {
        <View>
            <Pulse 
                color="#d1821cff"
                numPulses={3}
                diameter={100}
                speed={1}
            />
        </View>
    } else {
        return(
            <ScrollView style={ styles.container }>
                <View style={styles.topImageContainer}>
                    <Image
                        source={require('../../assets/images/medical-history_6188476.png')}
                        style={styles.topImageImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.registerAreaRows}>
                    <View style={styles.registerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.topCalendarStyleText}>Seleccione fecha de nacimiento</Text>
                            <Calendar
                                style={styles.calendarStyle}
                                current={new Date().toISOString().split('T')[0]}
                                markedDates={birthDay ? { [birthDay]: { selected: true, selectedColor: '#4fa3e3' } } : {}}
                                onDayPress={(day) => {
                                    setBirthDay(day.dateString);
                                }}
                            />
                            {birthDay && <Text style={styles.bottomCalendarStyleText}>Día seleccionado: {birthDay}</Text>}
                        </View>
                    </View>
                    <View style={styles.registerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.topCalendarStyleText}>Seleccione una enfermedad</Text>

                            <TouchableOpacity
                                style={styles.selectorButton}
                                onPress={() => setIsDiseaseModalVisible(true)}
                            >
                                <Text>{selectedDisease || 'Seleccionar enfermedad'}</Text>
                            </TouchableOpacity>

                            <Modal
                                transparent
                                visible={isDiseaseModalVisible}
                                animationType="slide"
                                onRequestClose={() => setIsDiseaseModalVisible(false)}
                            >
                                <TouchableOpacity
                                    style={styles.modalOverlay}
                                    onPress={() => setIsDiseaseModalVisible(false)}
                                    activeOpacity={1}
                                >
                                    <View style={styles.modalContent}>
                                        {diseaseOptions.map((option, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    setSelectedDisease(option);
                                                    setIsDiseaseModalVisible(false);
                                                }}
                                                style={styles.optionItem}
                                            >
                                                <Text>{option}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.topCalendarStyleText}>Seleccione un medicamento</Text>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => setIsMedicationModalVisible(true)}
                        >
                            <Text>{selectedMedication || 'Seleccionar medicamento'}</Text>
                        </TouchableOpacity>

                        <Modal
                            transparent
                            visible={isMedicationModalVisible}
                            animationType="slide"
                            onRequestClose={() => setIsMedicationModalVisible(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                onPress={() => setIsMedicationModalVisible(false)}
                                activeOpacity={1}
                            >
                                <View style={styles.modalContent}>
                                    {medicationOptions.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                setSelectedMedication(option);
                                                setIsMedicationModalVisible(false);
                                            }}
                                            style={styles.optionItem}
                                        >
                                            <Text>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                    <View style={styles.registerRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.topCalendarStyleText}>Seleccione fecha de fin de tratamiento</Text>
                            <Calendar
                                style={styles.calendarStyle}
                                current={new Date().toISOString().split('T')[0]}
                                markedDates={treatmentEndDay ? { [treatmentEndDay]: { selected: true, selectedColor: '#4fa3e3' } } : {}}
                                onDayPress={(day) => {
                                    setTreatmentEndDay(day.dateString);
                                }}
                            />
                            {treatmentEndDay && <Text style={styles.bottomCalendarStyleText}>Día seleccionado: {treatmentEndDay}</Text>}
                        </View>
                    </View>
                    <View style={styles.registerButtonRow}>
                        <Button title="Completar registro" onPress={() => handleRegistration()} />
                    </View>
                </View>
            </ScrollView>
        );
    }

    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#85bee1',
    },
    topImageContainer: {
        alignItems: 'center',
        marginVertical: 35,
    },
    topImageImage: {
        width: 125,
        height: 125,
    },
    registerAreaRows: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    registerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    rowsImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    rowsText: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    registerButtonRow:{
        padding: 15,
        justifyContent: 'center',
    },
    topCalendarStyleText:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    calendarStyle:{
        borderRadius: 10,
        borderWidth: 2,
        marginVertical: 10,
    },
    bottomCalendarStyleText:{
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
    },
    selectorButton: {
        padding: 12,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    optionItem: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
});
