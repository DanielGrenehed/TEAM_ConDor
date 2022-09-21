import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './src/stack_navigator';
import { setConnectOptions, connect, disconnect } from './src/server';
import {ABLY_API_KEY} from './src/keys';

/*
  on setup -
    setConnectOptions

    connect
  
  on destruct
    disconnect

*/
setConnectOptions(ABLY_API_KEY);
connect();

export default function App() {
  console.log('Created App');
  return (
    <Navigator></Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
