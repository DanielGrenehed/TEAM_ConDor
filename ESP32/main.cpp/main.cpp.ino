#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "ESP32_C3_ISR_Servo.h"

//global variables 
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
const char* ssid = "****"; 
const char* password =  "****";
const char* mqttServer = "mqtt.ably.io";
const int mqttPort = 1883;
const char* mqttUser = "****";
const char* mqttPassword = "****";
const char* userPassArr[2] = {mqttUser, mqttPassword};
int servoIndex  = -1;
int servoPin = 4;
int servoPos = 0;
int currPos = 0;
char payload[10] = {0};
char MACAddress[23] = {'\0'};
char MCUMACAddress[23];


//function for connecting to wifi
static void connectToWifi(){
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
  Serial.print(".");
  delay(500);
  }
  Serial.print("Connected");
}

//function for setting up MQTT client
static void setupMQTT(){
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
  mqttClient.setKeepAlive(30);
}

//functon for connection to MQTT broker
static void reConnect(){
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
      Serial.println("Reconnecting to MQTT Broker..");
      String clientId = "ESP32";
      
      if (mqttClient.connect(clientId.c_str(), mqttUser, mqttPassword)) {
        Serial.println("Connected.");
        mqttClient.subscribe(MACAddress);
        mqttClient.publish("device_list", MACAddress);
      } 
   }
}

//function for receiving messages over MQTT 
static void callback(char* topic, byte* payload, unsigned int length) {
  char bytes[length + 1];
  Serial.print("Callback - ");
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    bytes[i] = payload[i];
  }
  servoPos = atoi(bytes);
  ESP32_ISR_Servos.setPosition(servoIndex, servoPos);
}

//function for setting up servo motor
static void setupServo(){
  ESP32_ISR_Servos.useTimer(1);
  servoIndex = ESP32_ISR_Servos.setupServo(servoPin, 800, 2450);
}

void setup(){
  Serial.begin(9600);
  snprintf(MCUMACAddress, 23, "MCUDEVICE-%llX", ESP.getEfuseMac());
  snprintf(MACAddress, 23, "%llX", ESP.getEfuseMac());
  setupServo();
  connectToWifi();
  setupMQTT();
}

void loop(){
  if (!mqttClient.connected())
    reConnect();
  mqttClient.loop();
  if(currPos != servoPos){
    sprintf(payload, "%d", servoPos);
    mqttClient.publish(MCUMACAddress, payload);
    currPos = servoPos;
  }
}
