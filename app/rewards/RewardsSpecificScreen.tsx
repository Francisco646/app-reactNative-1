import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function RewardSpecificScreen() {

    const image = require('../../assets/images/image_1296698.png'); // Example image
    const { listNames, listDetails, listCompleted } = useLocalSearchParams();

    const rewardsTitle = typeof listNames === 'string' ? listNames.split(',') : listNames;
    const rewardsDescription = typeof listDetails === 'string' ? listDetails.split(',') : listDetails;
    const rewardsCompleted = typeof listCompleted === 'string' ? listCompleted.split(',') : listCompleted;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.topContainerTitle}>Logros Específicos</Text>
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/images/settings.png')}
                        style={styles.topContainerSettingsIcon}
                    />
                </TouchableOpacity>
            </View>
            <View>
                {rewardsTitle.map((title, index) => (
                <View key={index} style={styles.rewardContainer}>
                    <View>
                        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>{title}</Text>
                        <Text style={{color: '#fff', marginTop: 5}}>{rewardsDescription[index]}</Text>
                        <Text style={{color: '#fff', marginTop: 5}}>
                            {rewardsCompleted[index] ? "Completado" : "Pendiente"}
                        </Text>
                    </View>
                    <Image source={image} style={styles.rewardImage} resizeMode="contain" />
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
  rewardContainer: {
    backgroundColor: '#007b97',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardImage: {
    width: 50,
    height: 50,
  }
})
