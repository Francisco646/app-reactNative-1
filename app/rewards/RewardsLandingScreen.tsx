import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

import {
  Image,
  StyleSheet,
  Text
} from 'react-native';

const Pulse = require('react-native-pulse').default;

export default function RewardsLandingScreen() {

  const rawParams = useLocalSearchParams();
  console.log('Raw received parameters:', rawParams);

  const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

  const {
    numOfCompletedGeneralRewards,
    numOfUncompletedGeneralRewards,
    numOfTotalGeneralRewards,
    numOfCompletedSpecificRewards,
    numOfUncompletedSpecificRewards,
    numOfTotalSpecificRewards
  } = Object.fromEntries(
  Object.entries(rawParams).map(([key, value]) => [key, Number(value)])
  );

  const generalCompleted = Number(numOfCompletedGeneralRewards) / Number(numOfTotalGeneralRewards);
  const specificCompleted = Number(numOfCompletedSpecificRewards) / Number(numOfTotalSpecificRewards);

  const generalCompletedPercentage = generalCompleted * 100;
  const specificCompletedPercentage = specificCompleted * 100;

  const handleGeneralRewards = async () => {
    try{
      setSpinnerIsVisible(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://localhost:3000/reward/general', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if(response.status === 200) {
        manageResponse(response, 'general')
      }

    } catch(error){
      Alert.alert('Se ha producido un error intentando obtener los logros generales');
    } finally {
      setSpinnerIsVisible(false);
    }
  }

  const handleSpecificRewards = async () => {
    try{
      setSpinnerIsVisible(true);
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch('http://localhost:3000/reward/specific', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if(response.status === 200) {
        manageResponse(response, 'especifica')
      }

    } catch(error){
      Alert.alert('Se ha producido un error intentando obtener los logros especificos');
    } finally {
      setSpinnerIsVisible(false);
    }
  }

  // @ts-ignore
  const manageResponse = async (response, screen) => {
    const data = await response.json();
    console.log('Response data:', data);

    const listNames = [];
    for(let rewards of data.commonData) {
      const reward = rewards[0];
      const rewardName = reward.nombre;
      listNames.push(rewardName);
    }
    console.log('List of names:', listNames);

    const listDetails = [];
    for(let rewards of data.commonData) {
      const reward = rewards[0];
      const rewardDetails = reward.detalles;
      listDetails.push(rewardDetails);
    }
    console.log('List of details:', listDetails);

    const listCompleted = [];
    for(let reward of data.userRewardData) {
      const rewardCompleted = reward.completado;
      listCompleted.push(rewardCompleted);
    }
    console.log('List of completed:', listCompleted);

    let pathname;
    if(screen === 'general'){
      pathname = '/rewards/RewardsGeneralScreen';
    } else {
      pathname = '/rewards/RewardsSpecificScreen';
    }

    // @ts-ignore
    router.push({ pathname: pathname,
      params: {
        listNames: listNames,
        listDetails: listDetails,
        listCompleted: listCompleted
      }
    });
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
    return (
      <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
            <TouchableOpacity style={styles.menuButton}>
                <Text style={{ fontSize: 28, color: '#00a69a' }}>&#9776;</Text>
            </TouchableOpacity>
            <Text style={styles.topContainerTitle}>Logros</Text>
            <TouchableOpacity >
                <Image
                    source={require('../../assets/images/settings.png')}
                    style={styles.topContainerSettingsIcon}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.mainContainer}>
            <View style={styles.rewardsSubContainer}>
              <Text style={styles.rewardSubContainerTitle}>Logros Generales</Text>
              <Text style={styles.rewardSubContainerSubtitle}>Completados: {numOfCompletedGeneralRewards} / {numOfTotalGeneralRewards} </Text>
              <Text style={styles.rewardSubContainerSubtitle}>{generalCompletedPercentage} %</Text>
              <TouchableOpacity
                  style={styles.rewardSubContainerButton}
                  onPress={() => handleGeneralRewards()}
              >
                  <Text style={styles.rewardSubContainerButtonText}>Visualizar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardsSubContainer}>
              <Text style={styles.rewardSubContainerTitle}>Logros Específicos</Text>
              <Text style={styles.rewardSubContainerSubtitle}>Completados: {numOfCompletedSpecificRewards} / {numOfTotalSpecificRewards} </Text>
              <Text style={styles.rewardSubContainerSubtitle}>{specificCompletedPercentage} %</Text>
              <TouchableOpacity
                  style={styles.rewardSubContainerButton}
                  onPress={() => handleSpecificRewards()}
              >
                  <Text style={styles.rewardSubContainerButtonText}>Visualizar</Text>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    );
  }

  
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e3f6fd',
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    height: 70,
    backgroundColor: '#a7faa3',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#00a69a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  topContainerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 1,
  },
  topContainerSettingsIcon: {
    width: 34,
    height: 34,
    marginRight: 8,
    tintColor: '#00a69a',
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    marginTop: 30,
  },
  rewardsSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 24,
    borderRadius: 22,
    width: '85%',
    shadowColor: '#00a69a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 7,
    elevation: 5,
    marginBottom: 18,
  },
  rewardSubContainerButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#13acff',
    shadowColor: '#0032fa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },
  rewardSubContainerButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  rewardSubContainerTitle: {
    fontSize: 22,
    color: '#00a69a',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  rewardSubContainerSubtitle: {
    fontSize: 16,
    color: '#0032fa',
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '600',
  },

  menuButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  menuItem: {
    padding: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
