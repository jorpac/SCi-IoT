import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import HomeScreen from './HomeScreen';
import PatientScreen from './PatientScreen';
import MedScreen from './MedScreen';

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    PatientScreen: PatientScreen,
    MedScreen: MedScreen,
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
