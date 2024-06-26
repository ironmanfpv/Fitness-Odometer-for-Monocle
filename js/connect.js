"use strict";
const nordicDfuServiceUuid = 0xfe59;
const nordicDfuControlCharacteristicUUID = '8ec90001-f315-4f60-9fb8-838830daea50';
const nordicDfuPacketCharacteristicUUID = '8ec90002-f315-4f60-9fb8-838830daea50';
const replDataServiceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const replRxCharacteristicUuid = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const replTxCharacteristicUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const rawDataServiceUuid = "e5700001-7bac-429a-b4ce-57ff900f479d";
const rawDataRxCharacteristicUuid = "e5700002-7bac-429a-b4ce-57ff900f479d";
const rawDataTxCharacteristicUuid = "e5700003-7bac-429a-b4ce-57ff900f479d";
const MAX_MTU = 125;
const EMPTY = new Uint8Array(0);
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();
const statusMsg = document.getElementById('status');
const connectBtn = document.getElementById('connectBtn');
const DisconnectBtn = document.getElementById('DisconnectBtn');
const TransmitBtn = document.getElementById('TransmitBtn');

//The Disconnect and Transmit Button is by default hidden
DisconnectBtn.style.visibility = "hidden";
TransmitBtn.style.visibility = "hidden";

// Call isConnected() to check for BLE connection every 3 seconds
setInterval(isConnected, 3000);

// Call isDisconnected() to check if BLE device is disconnected every 3 seconds
setInterval(isDisconnected, 3000);



var myMonocle;
var distanceInterval; // Variable to hold the interval for sending distance data

async function connect() {
    var _device$gatt;
    if (!navigator.bluetooth) {
        throw "This browser doesn't support WebBluetooth. " + "Make sure you're on Chrome Desktop/Android or BlueFy iOS.";
    }
    let device;
    if (/iPhone|iPad/.test(navigator.userAgent)) {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        });
    } else {
        device = await navigator.bluetooth.requestDevice({
            filters: [{
                services: [replDataServiceUuid]
            }, {
                services: [nordicDfuServiceUuid]
            }],
            optionalServices: [rawDataServiceUuid]
        });
        statusMsg.innerHTML = "Monocle is Connected";
        statusMsg.style.color = "#00CC00";
        connectBtn.style.visibility = "hidden";
        document.getElementById('DisconnectBtn').style.visibility = 'visible';
        document.getElementById('TransmitBtn').style.visibility = 'visible';
    }

    const server = await ((_device$gatt = device.gatt) === null || _device$gatt === void 0 ? void 0 : _device$gatt.connect());
    if (!server) {
        throw "Bluetooth service undefined";
    }
    const dfu = await (server === null || server === void 0 ? void 0 : server.getPrimaryService(nordicDfuServiceUuid).catch(() => {}));
    if (dfu) {
        const dfuctr = await dfu.getCharacteristic(nordicDfuControlCharacteristicUUID);
        const dfupkt = await dfu.getCharacteristic(nordicDfuPacketCharacteristicUUID);
        const monocle = {
            kind: "dfu",
            server,
            dfu,
            dfuctr,
            dfupkt
        };
        device.ongattserverdisconnected = function () {
            if (monocle.disconnected) monocle.disconnected();
        };
        dfu.oncharacteristicvaluechanged = function (ev) {
            console.log("Dfu ", ev);
        };
        myMonocle = monocle;
        return monocle;
    }

    const repl = await server.getPrimaryService(replDataServiceUuid);
    const data = await server.getPrimaryService(rawDataServiceUuid);
    const replrx = await repl.getCharacteristic(replRxCharacteristicUuid);
    const repltx = await repl.getCharacteristic(replTxCharacteristicUuid);
    const datarx = await data.getCharacteristic(rawDataRxCharacteristicUuid);
    const datatx = await data.getCharacteristic(rawDataTxCharacteristicUuid);
    const replbuf = new Bytes();
    const databuf = new Bytes();
    const repltask = setInterval(() => transmit(replrx, replbuf));
    const datatask = setInterval(() => transmit(datarx, databuf));
    const monocle = {
        kind: "data",
        raw: false,
        server,
        repltask,
        datatask,
        data_send(data) {
            if (typeof data == 'string') {
                data = ENCODER.encode(data);
            }
            replbuf.write(new Uint8Array(data));
        },
        async repl(data) {
            if (typeof data == 'string') {
                if (this.raw && /[\x20-\x7F]/.test(data)) {
                    data += '\x04';
                }
                data = ENCODER.encode(data);
            }
            replbuf.write(new Uint8Array(data));
            return new Promise(resolve => {
                this.repl_cb = data => resolve(data);
                setTimeout(() => resolve(''), 500);
            });
        },
        async set_raw(raw) {
            if (raw) {
                this.raw = true;
                await this.repl('\x03\x01');
            } else {
                this.raw = false;
                await this.repl('\x02');
            }
        },
        stop() {
            clearInterval(this.repltask);
            clearInterval(this.datatask);
        }
    };
    device.ongattserverdisconnected = function () {
        if (monocle.disconnected) monocle.disconnected();
    };
    let repl_str = '';
    repltx.oncharacteristicvaluechanged = event => {
        const target = event.target;
        if (!target.value) {
            return;
        }
        if (monocle.raw) {
            repl_str += DECODER.decode(target.value);

            // Once the end of response '>' is received, run the callbacks
            if (repl_str.endsWith('>') || repl_str.endsWith('>>> ')) {
                if (monocle.repl_cb) monocle.repl_cb(repl_str);
                repl_str = '';
            }
        } else {
            if (monocle.repl_cb) monocle.repl_cb(DECODER.decode(target.value));
        }
    };
    datatx.oncharacteristicvaluechanged = event => {
        const target = event.target;
        if (target.value && monocle.data_read) monocle.data_read(target.value);
    };
    await repltx.startNotifications();
    await datatx.startNotifications();
    await monocle.set_raw(true);

    myMonocle = monocle;
    return monocle;
}

// Function to manually disconnect Monocle, Yet to be completed.
async function disconnect() {
    //console.log('Device disconnected');                                 //debugging statement
    // Added logic to handle actions upon disconnection.
    statusMsg.innerHTML = "Monocle is Disconnected";
    statusMsg.style.color = "#EE4B2B";
    connectBtn.style.visibility = "visible";
    document.getElementById('DisconnectBtn').style.visibility = 'hidden';
    document.getElementById('TransmitBtn').style.visibility = 'hidden';
}

// Function to constantly check if the Bluetooth device is connected
async function isConnected() {
    if (myMonocle && myMonocle.server && myMonocle.server.connected) {
        //console.log("Monocle is connected");                            //debugging statement
        statusMsg.innerHTML = "Monocle is Connected";
        statusMsg.style.color = "#00CC00";
        connectBtn.style.visibility = "hidden";
        document.getElementById('DisconnectBtn').style.visibility = 'visible';
        document.getElementById('TransmitBtn').style.visibility = 'visible';
    } else {
        console.log("Monocle is not connected");
    }
}

// Function to constantly check if the Bluetooth device is disconnected
async function isDisconnected() {
    if (myMonocle && myMonocle.server && !myMonocle.server.connected) {
        //console.log("Monocle is disconnected");                         //debugging statement
        statusMsg.innerHTML = "Monocle is Disconnected";
        statusMsg.style.color = "#EE4B2B";
        connectBtn.style.visibility = "visible";
        document.getElementById('DisconnectBtn').style.visibility = 'hidden';
        document.getElementById('TransmitBtn').style.visibility = 'hidden';
    } else {
        console.log("Monocle is still connected");
    }
}

/**********************************Bytes and Data******************************************/

//Data Xfer : Read https://github.com/brilliantlabsAR/monocle-micropython --> communications

class Bytes {
    buf = EMPTY;
    len = 0;
    lck = false;
    subarray(pos, len) {
        if (len > this.len) {
            throw "Out of bounds";
        }
        return this.buf.subarray(pos, pos + len);
    }
    write(buf) {
        if (this.buf.length - this.len < buf.byteLength) {
            const old = this.buf;
            this.buf = new Uint8Array(this.len + buf.byteLength);
            this.buf.set(old);
        }
        this.buf.set(buf, this.len);
        this.len += buf.length;
    }
    read(len) {
        return this.subarray(0, Math.min(this.len, len));
    }
    read_lock(len) {
        this.lck = true;
        return this.read(len);
    }
    advance(len) {
        this.buf = this.buf.subarray(len);
        this.len -= len;
    }
    advance_unlock(len) {
        this.lck = false;
        this.advance(len);
    }
}
function transmit(channel, bytes) {
    if (bytes.len > 0 && !bytes.lck) {
        const tmp = bytes.read_lock(MAX_MTU);
        channel.writeValueWithoutResponse(tmp).then(() => bytes.advance_unlock(tmp.length)).catch(err => {
            // Unlock, but rethrow
            bytes.advance_unlock(tmp.length);
            Promise.reject(err);
        });
    }
} 
