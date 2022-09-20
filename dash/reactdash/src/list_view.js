
import React from 'react';
import { Button, View } from 'react-native';
import {bindDeviceList, setControlledDevice} from './server';

/*
    on load 
        bindDeviceList(add device to view)

    on list interaction 
        setControlledDevice
        change to device view


*/

export default function getListView({navigation}) {
    const on_press_handler = () => {
        // Set Controlled device first
        navigation.navigate('Device');
        console.log('trying to change view');
    };
    return (<View>
        <Button title="Go to Device View" onPress={on_press_handler}></Button>
    </View>)
}