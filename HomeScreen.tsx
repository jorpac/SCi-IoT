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

import React from 'react';
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
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MQTT from 'tsm-react-native-mqtt';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const HomeScreen = ( { navigation } ) => {
  const isDarkMode = useColorScheme() === 'dark';
  const {height} = useWindowDimensions();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    paddingTop: 2,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Image source={require('./imgs/logo.jpg')} style={{width: '100%'}} />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            justifyContent: 'center',
            alignSelf: 'center',
            paddingTop: height / 6,
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Section title="Search for device">
              Search for your{' '}
              <Text style={styles.highlight}>Heart Rate monitoring device</Text>{' '}
              and start receiving data.
            </Section>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MedScreen')}>
            <Section title="Master device">
              Are you the master? Do you{' '}
              <Text style={styles.highlight}>receive alerts</Text> from other
              smartphones?
            </Section>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
