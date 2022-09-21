import Ably from 'ably';

const DEVICE_LIST_CHANNEL_NAME = 'device_list';
const RESPONSE_CHANNEL_PREFIX = 'MCUDEVICE-';

let connect_options = {};
let client = null;
let device_connect_callback = null;
let device_list_buffer = [];
let device_list_channel = null;

const device_controller = {
    device_hid:'', // id of device
    out_channel:null, // Publish to device on channel
    response_channel:null, // Get device responses
    on_message_callback:null // 
};

/*
    Disconnect all device connections
*/
const detatchDeviceChannels = () => {
    if (device_controller.out_channel != null) {
        //device_controller.out_channel.detatch();
    }
    if (device_controller.response_channel != null) {
        device_controller.response_channel.unsubscribe();
        //device_controller.response_channel.detatch(); 
    }
};

/*
    Connenct all device connections
*/
const attachDeviceChannels = async () => {
    if (client === null || device_controller.device_hid === '') return;
    device_controller.out_channel = client.channels.get(device_controller.device_hid);
    device_controller.response_channel = client.channels.get(RESPONSE_CHANNEL_PREFIX + device_controller.device_hid);


    await device_controller.out_channel.attach();
    await device_controller.response_channel.attach();
    device_controller.response_channel.subscribe(onDeviceResponse);
    console.log('Connected to device')
};

/*
    Set connected device channel and reconnect to channels
*/
const setControlledDevice = async (hid) => {
    device_controller.device_hid = hid;

    detatchDeviceChannels();
    attachDeviceChannels();
};

const onDeviceResponse = (response) => {
    if (device_controller.on_message_callback != null) {
        device_controller.on_message_callback(response.data);
    }
};   

/*
    Publish value to connected device channel
*/
const publishToDevice = async (value) => {
    if (device_controller.out_channel != null) {
        device_controller.out_channel.publish({some:value});
    }
};

/*
    Set callback to call when message received from device
*/
const setDeviceMessageCallback = (callback) => {
    device_controller.on_message_callback = callback;
};

/*
    Return the HID of the currently controlled device
*/
const getDeviceHID = () => {
    return device_controller.device_hid;
};

const deviceExists = (device) => {
    device_list_buffer.forEach(function (li) {
        if (device === li) return true
    });
    return false
};

const addDeviceToList = (device) => {
    if (device_list_buffer.indexOf(device) > -1) {}
    else {
        if (device_connect_callback != null) {
            device_connect_callback(device);
        }
        device_list_buffer[device_list_buffer.length] = device;
    }
};
const decoder = new TextDecoder("utf-8");
const connectToDeviceList = async () => {
    device_list_channel = client.channels.get(DEVICE_LIST_CHANNEL_NAME);
    await device_list_channel.attach();

    /*
        Get history
    */
    device_list_channel.history({}, function(err, messagesPage) {
        
        for (let i = 0; i < messagesPage.items.length; i++) {

            const message = decoder.decode(messagesPage.items[i].data);
            //console.log(messagesPage.items[i]);
            //console.log(message);
            addDeviceToList(message);
        }
    });

    /*
        subscribe
    */
    device_list_channel.subscribe(function (message) {
        addDeviceToList(message.data);
    });
};

const setDeviceConnectCallback = (callback) => {
    device_connect_callback = callback;
    device_list_buffer.forEach(function (device) {
        device_connect_callback(device);
    });
};

/*
    disconnect all ably connections
*/
const disconnect = () => {
    device_list_channel.unsubscribe();
    device_list_channel.detatch();

    detatchDeviceChannels();
    client.close();
};

/*
    connect to ably
*/
const connect = () => {
    client = new Ably.Realtime.Promise(connect_options);
    if (client != null) {
        connectToDeviceList();
        attachDeviceChannels();
    } else {
        console.log('Failed to connect to Ably');
    }
    
};

/*
    Set options to use when connecting
*/
const setConnectOptions = (options) => {
    connect_options = options;
};

export {
    setConnectOptions,          // Set Ably connect options
    connect,                    // Connect to device list and device
    disconnect,                 // Disconnect from Ably
    setDeviceConnectCallback,   // Set callback to receive connected devices
    setControlledDevice,        // set device to control
    setDeviceMessageCallback,   // 
    publishToDevice,            // send data to device through server
    getDeviceHID                // return hid of current device
};