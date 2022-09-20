#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "ESP32_C3_ISR_Servo.h"


WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
const char* ssid = "Casa Delia"; 
const char* password =  "Nukedi93";
const char* mqttServer = "mqtt.ably.io";
const int mqttPort = 1883;
const char* mqttUser = "0gqsBg.N5mJ5Q";
const char* mqttPassword = "V9zEw0CA9Amaig1jLqKF_v8tiBC8HLL8QLdUEqCHWKY";
const char* userPassArr[2] = {mqttUser, mqttPassword};
int servoIndex  = -1;
int servoPin = 4;
int servoPos = 0;
int currPos = 0;
char payload[10] = {0};
char MACAddress[23];

void connectToWifi(){
  WiFi.begin(ssid, password);
  while(WiFi.status() != WL_CONNECTED){
  Serial.print(".");
  delay(500);
  }
  Serial.print("Connected");
}

void setupMQTT(){
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
  mqttClient.setKeepAlive(30);
}

void reConnect(){
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
      Serial.println("Reconnecting to MQTT Broker..");
      String clientId = "Philip";
      
      if (mqttClient.connect(clientId.c_str(), mqttUser, mqttPassword)) {
        Serial.println("Connected.");
        mqttClient.subscribe("/test/servo");
        mqttClient.publish("/test/philip", MACAddress);
      } 
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
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

void setup(){
  ESP32_ISR_Servos.useTimer(1);
  servoIndex = ESP32_ISR_Servos.setupServo(servoPin, 800, 2450);
  snprintf(MACAddress, 23, "MCUDEVICE-%llX", ESP.getEfuseMac());
  Serial.begin(9600);
  connectToWifi();
  setupMQTT();
}

void loop(){
  if (!mqttClient.connected())
    reConnect();
  mqttClient.loop();
  if(currPos != servoPos){
    sprintf(payload, "%d", servoPos);
    mqttClient.publish("/test/philip", payload);
    currPos = servoPos;
  }
}
