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
  Modal,
  Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MQTT from 'tsm-react-native-mqtt';

const MedScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loadedElement, setLoadedElement] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    paddingTop: 2,
  };
  const [receivedValues, setReceivedValues] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedElement, setClickedElement] = useState(0);
  function activateMQTT(topic, message, id, send) {
    MQTT.createClient({
      uri: 'mqtt://test.mosquitto.org:1883',
      clientId: id,
      automaticReconnect: true,
    })
      .then(function (client) {
        console.log('MQTT client activated', Math.floor(Math.random() * 100));
        client.on('closed', function () {
          console.log('mqtt.event.closed');
        });

        client.on('error', function (msg) {
          console.log('mqtt.event.error', msg);
          //setLoadedElement(false);
        });

        client.on('message', function (msg) {
          setLoadedElement(false);
          let tmpValues = receivedValues;
          if (!receivedValues.find(element => msg.data == element)) {
            tmpValues.push(msg.data);
            console.log('mqtt.event.message', msg);
            let data = msg.data.split(' ');
            console.log(data[6]);
            tmpValues.reverse();
            setReceivedValues(tmpValues);
          }
          setLoadedElement(true);
        });

        client.on('connect', function () {
          console.log('connected');
          client.subscribe(topic, 0);
          if (send) {
            client.publish(topic, message, 0, true, false);
          }
        });

        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });
    return 1;
  }
  activateMQTT('/heart_rate', '', '12', false);
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
      {loadedElement ? (
        <FlatList
          data={receivedValues}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setClickedElement(item);
                setModalVisible(true);
              }}
              style={styles.listItem}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>Error fetching data</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {receivedValues[clickedElement]}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MedScreen;
