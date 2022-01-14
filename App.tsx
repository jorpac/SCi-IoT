import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import HomeScreen from './HomeScreen';
import PatientScreen from './PatientScreen';
import MedScreen from './MedScreen';
import SettingsScreen from './SettingsScreen';

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    PatientScreen: PatientScreen,
    MedScreen: MedScreen,
    SettingsScreen: SettingsScreen,
    //Lets comment for now
    //Passenger: Passenger,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      title: 'SmartHealth',
    },
  },
);

export default createAppContainer(navigator);
