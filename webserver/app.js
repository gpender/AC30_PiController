var utils = require('./utils/utils');
var dctClient = require('./dct-client/dct-client.1');

var localIpAddress = utils.GetLocalEthernetIpAddress();
dctClient.init(localIpAddress);
dctClient.DctDriveScan();
//dctSvc.init(addresses[0]);
