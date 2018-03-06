var utils = require('./utils/utils');
//var dctClient = require('./dct-client/dct-client.1');
var scanner = require('./scan_controller/scan_controller');
var drive = require('./scanners/ac30-drive');

var localIpAddress = utils.GetLocalEthernetIpAddress();
//scanner.register(drive);
//dctClient.init(localIpAddress);
//dctClient.DctDriveScan();
//dctSvc.init(addresses[0]);
//drive_scanner.



var drive = drive;//{port:'Hello Guy'};//require('./db');
var drive2 = {port:'Hello Guy'};//require('./db');
var drive3 = {port:'Hello Guy'};//require('./db');

var userModel = scanner();
userModel.register(drive);
userModel.register(drive2);
userModel.register(drive3);
userModel.scan();
userModel.scan();
userModel.scan();