import Ably from 'ably';

const DEVICE_LIST_CHANNEL_NAME = 'device_list';
const RESPONSE_CHANNEL_PREFIX = 'MCUDEVICE-';

let connect_options = {};
let client = null;
let device_list_channel = null;

const device_controller = {
    device_hid:'', // id of device
    out_channel:null, // Publish to device on channel
    response_channel:null, // Get device responses
    on_message_callback:null // 
};

const detatchDeviceChannels = () => {
    if (device_controller.out_channel != null) {
        device_controller.out_channel.detatch();
    }
    if (device_controller.response_channel != null) {
        device_controller.response_channel.unsubscribe();
        device_controller.response_channel.detatch(); 
    }
};

const attatchDeviceChannels = async () => {
    if (device_controller.device_hid === '') return;
    device_controller.out_channel = client.channels.get(device_controller.device_hid);
    device_controller.response_channel = client.channels.get(RESPONSE_CHANNEL_PREFIX + device_controller.device_hid);


    device_controller.out_channel.attach();
    device_controller.response_channel.attach();
    device_controller.response_channel.subscribe(onDeviceResponse);
};

/*
    Set connected device channel
*/
const setControlledDevice = async (hid) => {
    device_controller.device_hid = hid;

    detatchDeviceChannels();

    await attatchDeviceChannels();

};

const onDeviceResponse = (response) => {
    if (device_controller.on_message_callback != null) {
        device_controller.on_message_callback(response);
    }
};   

/*
    Publish value to connected device channel
*/
const publishToDevice = async (value) => {
    if (device_controller.out_channel != null) {
        await device_controller.out_channel.publish({some:value});
    }
};

const setDeviceMessageCallback = (callback) => {
    device_controller.on_message_callback = callback;
};


const bindDeviceList = async (on_device_hid) => {
    device_list_channel = client.channels.get(DEVICE_LIST_CHANNEL_NAME);
    await device_list_channel.attach();
    await device_list_channel.history({}, function(err, messagesPage) {
        for (let i = 0; i < messagesPage.items.length; i++) {
            on_device_hid(messagesPage.items[i].data);
        }
    });
    device_list_channel.subscribe(function (message) {
        on_device_hid(message.data);
    });
};

const disconnect = () => {
    device_list_channel.unsubscribe();
    device_list_channel.detatch();

    detatchDeviceChannels();
    client.close();
};

const connect = () => {
    client = new Ably.Realtime.Promise(connect_options);
    attatchDeviceChannels();
};

const setConnectOptions = (options) => {
    connect_options = options;
};

export {
    setConnectOptions,          // Set Ably connect options
    connect,                    // Connect to device list and device
    disconnect,                 // Disconnect from Ably
    bindDeviceList,             // Retrieve and subscribe to data from 'device_list' channel
    setControlledDevice,        // set device to control
    setDeviceMessageCallback,   // 
    publishToDevice,            // send data to device through server
};