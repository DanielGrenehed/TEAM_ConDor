import React, { Component } from 'react';
import { Button, View, Text, StyleSheet, Platform, PlatformColor} from 'react-native';
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
        this.state = {value: 0};
        this.onDeviceResponse = this.onDeviceResponse.bind(this);
        setDeviceMessageCallback(this.onDeviceResponse)
    }

    onButtonPress = () => {
        console.log('in device_view.js');
    }

    onDeviceResponse = (response) => {
        console.log(response)
        //this.setState({value: respons.rotation})
    }
    
    onSliderUpdate = (x) => {
        console.log(x);
    }
    onSliderUpdate = (value) => {
        const int = Math.floor(value);
        console.log(int);
        publishToDevice(int);
        this.setState({value: int})
    }

    render () {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                <View style={{backgroundColor: 'creamwhite', width: '100%' }}>
                    <Text style={{textAlign: 'center', fontSize:32}}>
                        {this.state.value}
                    </Text>
                    <Slider
                    style={{width: 200, height: 40, alignSelf: 'center', justifyContent: 'center'}}
                    minimumValue={0}
                    maximumValue={180}
                    onSlidingComplete={this.onSliderUpdate}
                    />
                </View>
                
                <View style={{
                    backgroundColor: 'aqua', 
                    width: '100%', 
                    position: 'absolute', 
                    top: 0
                    }}>
                    <Text style={{textAlign: 'center', fontSize:32}}>
                        {getDeviceHID()}
                    </Text>
                </View>
            </View>)
    }
      
}
