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

    constructor (props) {
        super(props);
        this.onDeviceResponse = this.onDeviceResponse.bind(this);
        setDeviceMessageCallback(this.onDeviceResponse)
    }

    onButtonPress = () => {
        console.log('in device_view.js');
    }

    onDeviceResponse = (response) => {
        console.log(response)
    }
    
    onSliderUpdate = (x) => {
        console.log(x);
    }
    onSliderUpdate = (value) => {
        console.log(Math.floor(value));
        publishToDevice(Math.floor(value));
    }

    render () {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                <Slider
                    style={{width: 200, height: 40, alignSelf: 'center', justifyContent: 'center'}}
                    minimumValue={0}
                    maximumValue={180}
                    onSlidingComplete={this.onSliderUpdate}
                    />
                <View style={{backgroundColor: 'green', width: '100%', position: 'absolute', bottom: 0}}>
                    <Text style={{textAlign: 'center', fontSize:40, backgroundColor: 'gold'}}>
                        {getDeviceHID()}
                    </Text>
                </View>
            </View>)
    }
      
}
