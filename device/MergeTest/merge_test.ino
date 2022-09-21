#include <Arduino.h>
#include "endpoint_utils.h"

const char *testChannel  = "/channel";
const char *testAddress = "/macAddress";
const char *testAnother = "/another";
int sizen = 0;

char message[MESG_LIMIT] = {'\0'};

void setup(){
  Serial.begin(9600);
}

void loop(){

  delay(1000);
  
  if(!messageCreate(message, testChannel, testAddress, testAnother))
    Serial.println("String is FUBAR. Check code.");
  Serial.println(message);
  
  delay(1000);
}