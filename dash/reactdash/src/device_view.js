import {setDeviceMessageCallback, publishToDevice, getDeviceHID} from './server'; 

/*

    On view load,   
        getDeviceHID() - set title
        setDeviceMessageCallback(on_message - set rotation of slider)
        
    on user interaction with slider
        publishToDevice(slider-rotaton)

*/