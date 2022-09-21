
import React, { Component } from 'react';
import { View, FlatList, Text, TouchableHighlight, StyleSheet } from 'react-native';
import {setDeviceConnectCallback, setControlledDevice} from './server';
/*
    on load 
        setDeviceConnectCallback(add device to view)

    on list interaction 
        setControlledDevice
        change to device view


*/

export default class ListView extends Component {

    constructor (props) {
        super(props)
        this.navigation = props.navigation
        this.state = {
            device_list: [],
        };
        this.addDevice = this.addDevice.bind(this);
        setDeviceConnectCallback(this.addDevice);
    }
    
    addDevice(device) {
        this.setState(prevState => ({
            device_list: [...prevState.device_list, {key:device, name:device}]
        })) 
    }

    onPress(item) {
        console.log(item);
        setControlledDevice(item);
        this.navigation.navigate('Device');
    }

    render () {
        console.log(this.state.device_list.length)
        if (this.state.device_list.length > 0) {
            this.state.device_list.forEach(element => {
                console.log(element)
            });
        }
        return (<View style={this.styles}>
        <FlatList
            keyExtractor={(item) => item.key}
            data={this.state.device_list}
            renderItem={({item}) => (
                <TouchableHighlight
                    key={item.key}
                    onPress={() => this.onPress(item.key)}>
                <View style={{backgroundColor: 'lightblue', border: '1px solid rgba(0, 0, 0, 0.2)'}}>
                    <Text style={{textAlign: 'center', fontSize:32,}}>{item.name}</Text>
                </View>
                </TouchableHighlight>
                )} 
        />
    </View>)};
    styles = StyleSheet.create({
        container: {
            textAlign: 'center',
            fontSize: 40,
        },
    });
}