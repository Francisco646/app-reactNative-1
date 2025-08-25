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

// @ts-ignore
const ProgressBar = ({ percentage }) => {
  const progressWidth = Math.min(Math.max(percentage, 0), 100);

  return (
      <View style={progressBarStyles.container}>
        <View style={[progressBarStyles.progressBar, { width: `${progressWidth}%` }]} />
      </View>
  );
};

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

  // @ts-ignore
  const handleGeneralRewardsAccess = async () => { 
    try {
        setSpinnerIsVisible(true);
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://localhost:3000/reward/general`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response status:', response);
        if (response.status === 200) {
            await manageResponse(response, 'general');
        }
    } catch (error) {
        Alert.alert(`Se ha producido un error intentando obtener los logros generales`);
    } finally {
        setSpinnerIsVisible(false);
    }
}

// @ts-ignore
  const handleSpecificRewardsAccess = async () => { 
    try {
        setSpinnerIsVisible(true);
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://localhost:3000/reward/specific`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Response status:', response);
        if (response.status === 200) {
            await manageResponse(response, 'specific');
        }
    } catch (error) {
        Alert.alert(`Se ha producido un error intentando obtener los logros específicos`);
    } finally {
        setSpinnerIsVisible(false);
    }
}

  // @ts-ignore
  const manageResponse = async (response, screen) => {
      const data = await response.json();
      console.log('Response data:', data);

      const commonData = Array.isArray(data.commonData) ? data.commonData.flat() : [];
      const userData = Array.isArray(data.userRewardData) ? data.userRewardData.flat() : [];

      // Combina los datos en un solo array de objetos
      // @ts-ignore
      const combinedRewards = commonData.map((common, index) => {
          const user = userData[index] || {};

          console.log('Common Data:', common);
          console.log('User Data:', user);

          return {
              id: common.id, 
              nombre: common.nombre,
              detalles: common.detalles,
              completado: user.completado,
              logro_fisico: common.logro_fisico,
              progreso_necesario: user.progreso_necesario
          };
      });

      let pathname: "/rewards/RewardsGeneralScreen" | "/rewards/RewardsSpecificScreen";
      if (screen === 'general') {
          pathname = "/rewards/RewardsGeneralScreen";
      } else {
          pathname = "/rewards/RewardsSpecificScreen";
      }

      router.push({
          pathname,
          params: {
              // Convierte el array completo a una cadena JSON
              rewards: JSON.stringify(combinedRewards)
          }
      });
  }

  if(spinnerIsVisible) {
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
    return (
      <ScrollView style={styles.container}>
        <View style={styles.topContainer}>
          <Image
              source={require('../../assets/images/image_1296698.png')}
              style={styles.headerIcon}
          />
          <Text style={styles.topContainerTitle}>Logros</Text>
          <Image
              source={require('../../assets/images/settings.png')}
              style={styles.headerIcon}
          />
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.rewardsCard}>
            <Text style={styles.rewardTitle}>Logros Generales</Text>
            <Text style={styles.rewardSubtitle}>
              Completados: {numOfCompletedGeneralRewards} / {numOfTotalGeneralRewards}
            </Text>
            <ProgressBar percentage={generalCompletedPercentage} />
            <TouchableOpacity
                style={styles.rewardButton}
                onPress={() => handleGeneralRewardsAccess()}
            >
              <Text style={styles.rewardButtonText}>Ver mis logros</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rewardsCard}>
            <Text style={styles.rewardTitle}>Logros Específicos</Text>
            <Text style={styles.rewardSubtitle}>
              Completados: {numOfCompletedSpecificRewards} / {numOfTotalSpecificRewards}
            </Text>
            <ProgressBar percentage={specificCompletedPercentage} />
            <TouchableOpacity
                style={styles.rewardButton}
                onPress={() => handleSpecificRewardsAccess()}
            >
              <Text style={styles.rewardButtonText}>Ver mis logros</Text>
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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f6fd',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 100,
    backgroundColor: '#a7faa3',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: '#00a69a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  topContainerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: 1.2,
  },
  headerIcon: {
    width: 38,
    height: 38,
    tintColor: '#00a69a',
  },
  mainContainer: {
    alignItems: 'center',
    paddingTop: 30,
    flex: 1,
  },
  rewardsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 22,
    width: '85%',
    shadowColor: '#0032fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 25,
    alignItems: 'center',
  },
  rewardTitle: {
    fontSize: 22,
    color: '#00a69a',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardSubtitle: {
    fontSize: 16,
    color: '#0032fa',
    marginBottom: 4,
    fontWeight: '600',
  },
  rewardButton: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: '#13acff',
    shadowColor: '#0032fa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    width: '100%',
  },
  rewardButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

const progressBarStyles = StyleSheet.create({
  container: {
    height: 12,
    width: '90%',
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#01b888',
  },
});
