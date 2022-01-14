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
  Vibration,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

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
  const [message, setMessage] = useState('');

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
          if (msg.includes('32103')) {
            client.connect();
          } else if (msg.includes('32109')) {
            client.reconnect();
          }
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
            Vibration.vibrate(1000);
          }
          setLoadedElement(true);
        });

        client.on('connect', function () {
          console.log('connected');
          if (send) {
            console.log('sent message!' + topic + message);
            client.publish(topic, message, 0, true, false);
          } else {
            client.subscribe(topic, 0);
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
  function respond() {
    let data = clickedElement.split(' ');
    console.log(data);
    activateMQTT('/heart_rate/' + data[7], message, '12', true);
    setModalVisible(!modalVisible);
  }
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
            <Text style={styles.modalText}>{clickedElement}</Text>
            <TextInput
              style={styles.input}
              onChangeText={setMessage}
              value={message}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => respond()}>
              <Text style={styles.textStyle}>
                Send message to patient{' '}
                {clickedElement ? clickedElement.split(' ')[7] : ''}
              </Text>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default MedScreen;
