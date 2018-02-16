var exports = module.exports = {};

exports.hex2bin = hex2bin;
exports.byteToHex = byteToHex;
exports.arrayBufferToString = arrayBufferToString;
exports.GetLocalEthernetIpAddress = GetLocalEthernetIpAddress;
var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];

function GetLocalEthernetIpAddress()
{
    var os = require('os');
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            //console.log(address);
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    console.log("Local IpAddress " + addresses[0])
    return addresses[0];
}

function arrayBufferToString(buffer){
    var str='';
    var length = buffer.length;
    for (var i=0; i < length; i++) {
        if(i == 0){
            str = byteToHex(buffer[i]);
        }
        else{
            str = str + byteToHex(buffer[i]);
        }
    }
    return str;
}

function hex2bin(hex){
    var buf = new ArrayBuffer(hex.length/2);
    var bytes = [];
    for(var i=0; i< hex.length-1; i+=2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
        buf[i/2] = bytes[i/2];
    }
    return buf;
}

function byteToHex(b) {
  return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}