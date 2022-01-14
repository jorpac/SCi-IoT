/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  Button,
  BackHandler,
  Alert,
  Vibration,
  Modal
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MQTT from 'tsm-react-native-mqtt';


function activateMQTT(topic, message, values, timestamp, id) {
  MQTT.createClient({
    uri: 'mqtt://test.mosquitto.org:1883',
    clientId: id /*
     clientId: 'Medphd1',
     uri: 'mqtts://a2c1d7385b234cd6a8ae4d287bfd8857.s1.eu.hivemq.cloud:8884',
     host: 'a2c1d7385b234cd6a8ae4d287bfd8857.s1.eu.hivemq.cloud',
     port: 8884,
     protocol: 'mqtts',
     user: 'Medphd1',
     pass: '123456.mM',*/,
    automaticReconnect: true,
  })
    .then(function (client) {
      console.log('MQTT client activated', Math.floor(Math.random() * 100));
      client.on('closed', function () {
        console.log('mqtt.event.closed');
      });
      client.on('error', function (msg) {
        console.log('mqtt.event.error', msg);
        if (msg.includes('32103')) {
          client.connect();
        }
      });

      client.on('message', function (msg) {
        console.log(msg.data);
        console.log('mqtt.event.message', msg);
      });

      client.on('connect', function () {
        console.log('connected');
        client.publish(
          topic,
          message +
            'last values: ' +
            values[0] +
            ' ' +
            values[1] +
            ' ' +
            values[2] +
            ' ' +
            timestamp +
            ' ' +
            id,
          0,
          true,
          false,
        );
        client.subscribe(topic + '/' + id, 0);
      });

      client.connect();
    })
    .catch(function (err) {
      console.log(err);
    });
  return 1;
}

const PatientScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [listElements, setListElements] = useState([0]);
  const [loadedElement, setLoadedElement] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    paddingTop: 2,
  };

  let last_time = new Date().getTime();
  let i = 1;
  var tempList = [];
  function generate() {
    let new_time = new Date().getTime();
    i++;
    if (new_time - last_time > 900 * i * (i > 100 ? i : 1)) {
      last_time = new_time;
      setLoadedElement(false);
      let a = 20 + Math.floor(Math.random() * 100);
      tempList = listElements;
      tempList.unshift(a);
      //tempList = tempList.reverse();
      setListElements(tempList);
      console.log(listElements);
      setLoadedElement(true);
      if (a < 40 || a > 190) {
        activateMQTT(
          '/heart_rate',
          'low values!',
          tempList.slice(0, tempList.length > 3 ? 2 : tempList.length),
          new Date().getTime(),
          'abc',
        );
      }
      tempList = [];
    }
  }
  useEffect(() => {
    setInterval(() => {
      generate();
    }, 1000);
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            MQTT.disconnectAll();
            navigation.navigate('Home');
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Image source={require('./imgs/logo.jpg')} style={{width: '100%'}} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          justifyContent: 'center',
          alignSelf: 'center',
          paddingTop: 2,
        }}
      />
      <FlatList
        data={listElements}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => console.log(listElements)}
            style={styles.listItem}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  highlight: {
    fontWeight: '700',
  },
  listItem: {
    backgroundColor: '#FAF9F7',
    borderWidth: 1,
    borderColor: '#333',
    padding: 25,
  },
});

export default PatientScreen;
