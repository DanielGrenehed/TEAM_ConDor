import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer} from 'react-navigation';
import list_view from './list_view';
import device_view from './device_view';

const screens = {
    ConDor: { screen: list_view }, 
    Device : { screen: device_view }
};

const navigation_stack = createStackNavigator(screens);

export default createAppContainer(navigation_stack);