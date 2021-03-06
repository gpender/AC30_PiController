    // server.js
    var DCT_PORT = 64195;
    var EDAM_PORT = 5048;
    var ICPCON_PORT = 57188;
    var ICPCON_PORT_SERVER = 54321;
    var HOSTIP;
    const dctBuf = new Buffer([0x44, 0x43, 0x54, 0x00, 0x03, 0x01, 0x00, 0x00, 0x52, 0x45, 0x51, 0x20, 0x44, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x73, 0x00, 0x00, 0x00, 0x52, 0x01, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00]);
    const dctIdentifyBuf = new Buffer([0x44, 0x43, 0x54, 0x00, 0x03, 0x01, 0x00, 0x00, 0x52, 0x45, 0x51, 0x20, 0x49, 0x64, 0x65, 0x6E, 0x74, 0x69, 0x66, 0x79, 0x00, 0x00, 0x52, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00,0x0D,0x46,0x01,0x00,0x37,0x00,0x0A]);
    const edamBuf = new Buffer([0x49, 0x4e, 0x4c, 0x4f, 0x47, 0x45, 0x35, 0x4b, 0x30, 0x33, 0x37, 0x41]);
    const icpconBuf = new Buffer([0x49, 0x43, 0x50, 0x44, 0x41, 0x53, 0x37, 0x31, 0x38, 0x38, 0x45, 0x2C, 0x30, 0x30, 0x0D]);

    // set up ========================
    //var sockSvc = require('./socket-server.js');
    var utils = require('../utils/utils');

    var dgram = require('dgram');
    const dctClient = dgram.createSocket('udp4');
    const icpconClient = dgram.createSocket('udp4');
    const edamClient = dgram.createSocket('udp4');

    module.exports.init = function(host_ipaddress){
        HOSTIP = host_ipaddress;
        console.log("Init with " + HOSTIP);
        try{
            dctClient.bind(DCT_PORT, "0.0.0.0",function() {
                dctClient.setBroadcast(true);
            });
            edamClient.bind(EDAM_PORT, "0.0.0.0",function(){
                edamClient.setBroadcast(true);
            });
            icpconClient.bind(ICPCON_PORT_SERVER, "0.0.0.0",function(){
                icpconClient.setBroadcast(true);
            });
        }
        catch(err){
            console.log(err);
        }
    }

    dctClient.on('listening', function () {
        var address = dctClient.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    dctClient.on('message', function (message, remote) {
        if(remote.address != HOSTIP)
        {
            console.log(message);
            var driveInfo = GetDriveInfoObject(remote.address, message);
            console.log('Found Drive ' + driveInfo.Name);
            console.log(driveInfo.IpAddress + " " + HOSTIP);
            console.log(driveInfo.MacId);
            if(driveInfo.IpAddress != HOSTIP && driveInfo.Identifier == "DCT")
            {
                //sockSvc.SendWebSocketMessage("drive",driveInfo);
            }
        }
    });

    icpconClient.on('listening', function () {
        var address = icpconClient.address();
        console.log('UDP Server listening on ' + address.address + ":" + address.port);
    });

    icpconClient.on('message', function (message, remote) {
        if(remote.address != HOSTIP)
        {
            //console.log(message);
            var icpconInfo = GetIcpConInfoObject(remote.address, message);
            console.log('Found EthernetIO module ' + icpconInfo.Name)
            //sockSvc.SendWebSocketMessage("ethernetIo",icpconInfo);
        }
    });

    module.exports.DctDriveScan = function () {
        dctClient.send(dctBuf,0,dctBuf.length, DCT_PORT, '255.255.255.255', function(err) 
        {}); 
        edamClient.send(edamBuf,0,edamBuf.length, EDAM_PORT, '255.255.255.255', function(err) 
        {});
        icpconClient.send(icpconBuf,0,icpconBuf.length, ICPCON_PORT, '255.255.255.255', function(err) 
        {});
    }

    module.exports.IdentifyDrive = function (MacId) {
        var mac = hex2bin(MacId);
        for (var i=0; i < mac.byteLength; i++) {
            dctIdentifyBuf[32 + i] = mac[i];
        }
        dctClient.send(dctIdentifyBuf,0,dctIdentifyBuf.length, DCT_PORT, '255.255.255.255', function(err) 
        {}); 
    }

    function GetDriveInfoObject(ipaddress, message)
    {
        var length = message.length;
        var buffer = new ArrayBuffer(length);
        uint8Array = new Uint8Array(buffer); // Create a typed array
        for (var i=0; i < length; i++) {
            uint8Array[i] = message[i];
        }
        var DriveInfo = {};
        DriveInfo.Identifier = String.fromCharCode(buffer[0]) + String.fromCharCode(buffer[1]) + String.fromCharCode(buffer[2]);   
        var tmp = String.fromCharCode.apply(null, uint8Array.slice(72,92));//String.fromCharCode(uint.slice(72,92));//buffer[72],buffer[73],buffer[74],buffer[75],buffer[76],buffer[77],buffer[78],buffer[79],buffer[80],buffer[81],buffer[82],buffer[83],buffer[84],buffer[85],buffer[86],buffer[87],buffer
        DriveInfo.Name = tmp.replace(/\0[\s\S]*$/g,'');
        DriveInfo.MacId = utils.arrayBufferToString(uint8Array.slice(32,38));
        DriveInfo.IpAddress = ipaddress;//buffer[56] + '.' + buffer[57] + '.' + buffer[58] + '.' + buffer[59];
        DriveInfo.FwVersion = buffer[104] + '.' + buffer[105] + '.' + buffer[107] + '.' + buffer[106];
        DriveInfo.DriveType = "AC30" + String.fromCharCode(buffer[6]);
        return DriveInfo;
    }

    function GetIcpConInfoObject(ipaddress, message)
    {
        var length = message.length;
        var buffer = new ArrayBuffer(length);
        uint8Array = new Uint8Array(buffer); // Create a typed array
        for (var i=0; i < length; i++) {
            uint8Array[i] = message[i];
        }
        var IcpConInfo = {};  
        var tmp = String.fromCharCode.apply(null, uint8Array.slice(0,length-1));
        var rawText = tmp.replace(/\0[\s\S]*$/g,'');
        var stringArray = rawText.split(",");
        IcpConInfo.Type = stringArray[0].split('=')[1];
        IcpConInfo.Name = stringArray[2].split('=')[1];
        IcpConInfo.DHCP = stringArray[5].split('=')[1];
        IcpConInfo.IpAddress = stringArray[6].split('=')[1];
        IcpConInfo.Mask = stringArray[7].split('=')[1];
        IcpConInfo.Gateway = stringArray[8].split('=')[1];
        return IcpConInfo;
    }    

