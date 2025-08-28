import {StyleSheet, View, Text, ScrollView, Button} from "react-native";
import React, {useState} from "react";
import {Picker} from "@react-native-picker/picker";
const Pulse = require('react-native-pulse').default;

export default function WellnessTestInitialScreen() {

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    /* Recopilar los valores introducidos en el picker */
    const [ dolor, setDolor ] = useState(null);
    const [ sueno, setSueno ] = useState(null);
    const [ fatiga, setFatiga ] = useState(null);
    const [ animo, setAnimo ] = useState(null);

    const handleRoutinePerformAccess = async () => {

    }

    if(spinnerIsVisible){
        return(
            <View>
                <Pulse
                    color="#d1821cff"
                    numPulses={3}
                    diameter={100}
                    speed={1}
                />
            </View>
        )
    } else {
        return(
            <ScrollView style={styles.container}>
                <View style={styles.wellnessTestAreaRows}>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de dolor</Text>
                        <View>
                            <Picker
                                selectedValue={dolor}
                                onValueChange={(itemValue) => setDolor(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy alto" value="muy alto"/>
                                <Picker.Item label="Alto" value="alto"/>
                                <Picker.Item label="Normal" value="normal"/>
                                <Picker.Item label="Poco" value="poco"/>
                                <Picker.Item label="Nada" value="nada"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de sueño</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={sueno}
                                onValueChange={(itemValue) => setSueno(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy dormido" value="muy dormido"/>
                                <Picker.Item label="Algo dormido" value="algo dormido"/>
                                <Picker.Item label="Despierto" value="despierto"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Nivel de fatiga</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={fatiga}
                                onValueChange={(itemValue) => setFatiga(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Muy alta" value="muy alta"/>
                                <Picker.Item label="Algo alta" value="algo alta"/>
                                <Picker.Item label="Media" value="media"/>
                                <Picker.Item label="Baja" value="baja"/>
                                <Picker.Item label="Nula" value="nula"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.wellnessTestRow}>
                        <Text style={styles.rowsText}>Estado de ánimo</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={animo}
                                onValueChange={(itemValue) => setAnimo(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Triste" value="triste" />
                                <Picker.Item label="Enfadado" value="enfadado" />
                                <Picker.Item label="Contento" value="contento" />
                                <Picker.Item label="Neutro" value="neutro" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.submitButton}>
                        <Button title="Completar registro" onPress={() => handleRoutinePerformAccess()} />
                    </View>
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        width: '100%',
        marginBottom: 30,
    },
    wellnessTestAreaRows: {
        paddingHorizontal: 0,
    },
    wellnessTestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    rowsText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
        width: '60%',
    },
    picker: {
        height: 45,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#01b888',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        shadowColor: '#01b888',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
