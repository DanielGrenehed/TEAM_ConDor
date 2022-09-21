import React, { Component } from 'react';
import { Button, View, Text, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {setDeviceMessageCallback, publishToDevice, getDeviceHID} from './server'; 

/*

    On view load,   
        getDeviceHID() - set title
        setDeviceMessageCallback(on_message - set rotation of slider)
        
    on user interaction with slider
        publishToDevice(slider-rotaton)

*/

export default class DeviceView extends Component {

    onButtonPress = () => {
        console.log('in device_view.js');
    }

    hid = getDeviceHID();
    onSliderUpdate = (x) => {
        console.log(x);
    }
    onSliderUpdate = (value) => {
        console.log(Math.floor(value));
        //publishToDevice(Math.floor(value));
    }

    render () {
        return (
            <View style={this.styles}><Text>{this.hid}</Text>
            <Slider
                style={{width: 200, height: 40}}
                minimumValue={0}
                maximumValue={180}
                onSlidingComplete={this.onSliderUpdate}
                />
            </View>)
    }

    styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
      
}
