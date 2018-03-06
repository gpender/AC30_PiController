// var dgram = require('dgram');

// module.exports.register = function(Object){
//     Object();
// }

// module.exports.Scan = function(){
//     console.log('Scanning');
// }


function userModel (options) {
    var scanners = [];
    // var db;
    // if (!options.db) {
    //   throw new Error('Options.db is required');
    // }
    
    //db = options.db;
    
    return {
        register: function (scanner) {
            console.log(scanner);
            scanners.push(scanner);
        },
        scan: function (done) {
            var i = scanners.length;
            while (i--) {
                //next = scanners[i].call(this, next);
                console.log(scanners[i].port);
            }
        }
      }
  }
   
  module.exports = userModel;
