// Copyright (c) 2017, Intel Corporation.

// Demo code for Arduino 101/Tinytile that uses BLE to
// advertise Accelerometer and Gyroscope data to web app

var ble = require("ble");

var DEVICE_NAME = 'Intel Curie';

var updateFrequency = 20; // maximum is 100Hz, but in ashell maximum is 20Hz

var SensorCharacteristic = new ble.Characteristic({
    uuid: 'fc0a',
    properties: ['read', 'notify'],
    descriptors: [
        new ble.Descriptor({
            uuid: '2901',
            value: 'BMI160 Sensor'
        })
    ]
});

SensorCharacteristic._onChange = null;

SensorCharacteristic.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log("Subscribed to bmi160 sensor change");
    this._onChange = updateValueCallback;
};

SensorCharacteristic.onUnsubscribe = function() {
    console.log("Unsubscribed to bmi160 sensor change");
    this._onChange = null;
};

SensorCharacteristic.valueChange = function(isAccel, x, y, z) {
    var multi = 262144; // 2 ** (32 - 14bit precision).

    var xval = (x * multi) >> 1;
    var yval = (y * multi) >> 1;
    var zval = (z * multi) >> 1;

    var data = new Buffer(13);
    data.writeUInt8(isAccel, 0);

    data.writeUInt32BE(xval, 1);
    data.writeUInt32BE(yval, 5);
    data.writeUInt32BE(zval, 9);

    if (this._onChange) {
        this._onChange(data);
    }
};

ble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        ble.startAdvertising(DEVICE_NAME, ['fc00'], "https://goo.gl/pw8HvI");
    } else {
        if (state === 'unsupported') {
            console.log("BLE not enabled on board");
        }
        ble.stopAdvertising();
    }
});

ble.on('advertisingStart', function(error) {
    if (error) {
        console.log("Failed to advertise Physical Web URL");
        return;
    }

    ble.setServices([
        new ble.PrimaryService({
            uuid: 'fc00',
            characteristics: [
                SensorCharacteristic,
            ]
        })
    ]);

    console.log("Advertising as Physical Web device");
});

ble.on('accept', function(clientAddress) {
    console.log("Client connected: " + clientAddress);
});

ble.on('disconnect', function(clientAddress) {
    console.log("Client disconnected: " + clientAddress);
});

var accel = new Accelerometer({
    frequency: updateFrequency
});

var gyro = new Gyroscope({
    frequency: updateFrequency
});

accel.start();
gyro.start();

accel.onreading = function() {
    SensorCharacteristic.valueChange(1, accel.x, accel.y, accel.z);
};

gyro.onreading = function() {
    SensorCharacteristic.valueChange(0, gyro.x, gyro.y, gyro.z);
};

accel.onerror = function(event) {
    console.log("error: " + event.error.name +
                " - " + event.error.message);
};

gyro.onerror = function(event) {
    console.log("error: " + event.error.name +
                " - " + event.error.message);
};

console.log("Sensor (Accelerometer/Gyroscope) BLE Demo...");
