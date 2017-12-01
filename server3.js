var express = require('express');
var app = express();
var fs = require('fs');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');

var i = 1;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(8081, function () {
    
       var host = server.address().address
       var port = server.address().port
    
       console.log("Example app listening at http://%s:%s", host, port)
    })
// This responds with "Hello World" on the homepage
var temp;
var light;
var sound;

//Get Request for particular data
app.get('/1/Temp/:id', function(req,res){
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        temp = data.temperature["id"+req.params.id];
        res.send(JSON.stringify(temp));
    })
})
app.get('/1/Light/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        light = data.light["id"+req.params.id];
        res.send(JSON.stringify(light));
    })
})
 app.get('/1/Sound/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) 
        {
        data = JSON.parse( data );
        sound = data.sound["id"+req.params.id];
        res.send(JSON.stringify(sound));
        })}
    );

 //Get Request for dumping all the  data 
 app.get('/1/Temp', function(req,res){
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        res.send(JSON.stringify(data.temperature));
        console.log(data.temperature);
    })
})
app.get('/1/Sound', function(req,res){
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        res.send(JSON.stringify(data.sound));
        console.log(data.sound);
    })
})
app.get('/1/Light', function(req,res){
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        res.send(JSON.stringify(data.light));
        console.log(data.light);
    })
})
//--------------------------------------------------------------------------------------------------------//
//Update tempurature
app.put('/1/Temp/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        data.temperature["id"+req.params.id].sensor_value = req.body.sensor_value;
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
 })
 res.end('Data modified!');
})

//Update light
app.put('/1/Light/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        data.light["id"+req.params.id].sensor2_value = req.body.sensor_value;
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
 })
 res.end('Data modified!');
})

//Update sound
app.put('/1/Sound/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        data.sound["id"+req.params.id].sensor3_value = req.body.sensor_value;
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
 })
 res.end('Data modified!');
})
//----------------------------------------------------------------------------------------------------------------------//
//=====================================================================================================================//
//Delete light Data
app.delete('/1/Light/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        delete data.light["id"+req.params.id];
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
    })
    res.end('Data Deleted!');
})

//Delete sound Data
app.delete('/1/Sound/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        delete data.sound["id"+req.params.id];
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
    })
    res.end('Data Deleted!');
})
//Delete Temp Data
app.delete('/1/Temp/:id', function (req, res) {
    fs.readFile('sensor_database.json', function (err, data) {
        data = JSON.parse( data );
        delete data.temperature["id"+req.params.id];
        jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2});
    })
    res.end('Data Deleted!');
})

//======================================================================================================================//

app.post('/recvSensorData', function(req,res){
    var dt = new Date(); 
    var utcDate = dt.toUTCString();
    if(i==1)
    {
        var firstValue = {
            "temperature":{
                "id1":{
                    "sensor_name":"Temp",
                    "sensor_value":tempValue,
                    "time":utcDate
                }
            },
            "light":{
                "id1":{
                    "sensor2_name":"Light",
                    "sensor2_value":lightValue,
                    "time":utcDate
                }
            },
            "sound":{
                "id1":{
                    "sensor3_name":"Sound",
                    "sensor3_value":soundValue,
                    "time":utcDate
                }
            }
        };
        jsonfile.writeFileSync('sensor_database.json', firstValue, { spaces: 2});
        console.log(firstValue);
        i+=1;
    }
    else
    {
        fs.readFile('sensor_database.json', function (err, data) 
        {
            data = JSON.parse( data );
            data.temperature["id" + i] = temp.temperature["id"];
            data.light["id" + i] = temp.light["id"];
            data.sound["id" + i] = temp.sound["id"];
            console.log( data );
            //Writing JSON
            jsonfile.writeFileSync('sensor_database.json', data, { spaces: 2})
            i = i+1;
        }
        )
    }
    res.end();
})

