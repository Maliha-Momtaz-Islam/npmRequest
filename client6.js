const mraa = require('mraa');
const fs = require('fs');
var jsonfile = require('jsonfile')
var request = require('request');

var led = new mraa.Gpio(7);
led.dir(mraa.DIR_OUT);

var led01 = new mraa.Gpio(8);
led01.dir(mraa.DIR_OUT);

var analogPin0 = new mraa.Aio(0);
var analogPin1 = new mraa.Aio(1);
var analogPin3 = new mraa.Aio(2);

var analog01;
var analog00;
var display_temp = 0.0;
var B = 3975; 

var utcDate_ldr=0;
var utcDate_sound=0;
var utcDate_Temp =0;

var tempValue = 0.0;
var lightValue = 0.0;
var soundValue = 0.0;

var id =0;
var i =2;

var dt = new Date(); 
var utcDate = dt.toUTCString();

function readLDRValue(){
        var dt = new Date(); 
        var utcDate_ldr = dt.toUTCString();
        analog01 = analogPin1.read();
            if(analog01<150){
                led01.write(analog01);
                lightValue = analog01
            }
        else{led01.write(0);}
    }
setInterval(readLDRValue,5000);

function readSoundValue(){
    var dt = new Date(); 
    var utcDate_sound = dt.toUTCString();    
    analog00 = analogPin0.read();
    if(analog00<250)
    {
        led.write(analog00);
        soundValue = analog00;
    }
    else{led.write(0);}
}
setInterval(readSoundValue,5000);

function readTempValue()
{
      var dt = new Date(); 
      var utcDate_Temp = dt.toUTCString();        
      var analogValue = analogPin3.read(); 
      var resistance = (1023 - analogValue) * 10000 / analogValue; 
      var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;
      display_temp = celsius_temperature;
      tempValue = display_temp;
}
setInterval(readTempValue,5000);

function readValue(){
    var dt = new Date(); 
    var utcDate = dt.toUTCString();
    var temp = {
        "temperature":{
            "id":{
                "sensor_name":"Temp",
                "sensor_value":tempValue,
                "time":utcDate
            }
        },
        "light":{
            "id":{
                "sensor2_name":"Light",
                "sensor2_value":lightValue,
                "time":utcDate
            }
        },
        "sound":{
            "id":{
                "sensor3_name":"Sound",
                "sensor3_value":soundValue,
                "time":utcDate
            }
        }
    }
//requesting server by posting to
    request({
        method:'POST',
        json: true,
        uri : 'http://localhost:8081/recvSensorData',
        body : temp
    })
    console.log(temp);
}
setInterval(readValue,5000);




 

