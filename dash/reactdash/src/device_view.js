import React from 'react';
import { Button, View } from 'react-native';
import {setDeviceMessageCallback, publishToDevice, getDeviceHID} from './server'; 

/*

    On view load,   
        getDeviceHID() - set title
        setDeviceMessageCallback(on_message - set rotation of slider)
        
    on user interaction with slider
        publishToDevice(slider-rotaton)

*/

export default function getDeviceView() {
    
    const on_button_press = () => {
        console.log('in device_view.js');
    };
    return (<View><Button title="Test" onPress={on_button_press}></Button></View>)
}