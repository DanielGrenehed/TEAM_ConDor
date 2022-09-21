
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import {setDeviceConnectCallback, setControlledDevice} from './server';

/*
    on load 
        setDeviceConnectCallback(add device to view)

    on list interaction 
        setControlledDevice
        change to device view


*/






export default function getListView({navigation}) {
    const [device_list, setDeviceList] = useState([]);
    const appendDevice = (device) => {
        device_list[device_list.length] = device;
    };

    setDeviceConnectCallback(appendDevice);
    console.log(device_list.length);
    const on_press_handler = () => {
        // Set Controlled device first
        navigation.navigate('Device');
        console.log('trying to change view');
    };
    return (<View>
        <Button title="Go to Device View" onPress={on_press_handler}></Button>
    </View>)
}