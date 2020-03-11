/**
 * @author  
 *
 * Authenticates user+password combinations against a json file on disk.
 */

const Config = require('../config').load('file');
const Hash = require('./hash');
const fs = require('fs');
const filePath = require('path').resolve(__dirname, '../../' + Config.filename);
const Logger = require('../logger');
let users = [];


function load() {
    let data = ''
//        `{
//        "username": {
//            "uid": "username",
//            "password": "$argon2i$v=19$m=16384,t=4,p=1$fbZnHvp23imCl/hwyJoqTDuJiIdkYTYOTpTmgDBOLrQ$/uDeCDakLaPJtY9D57ONM+dI7BpPJ8znn1N0HHciIvxlh+Hp24PLi3I/q+RPR0fayLpga0MS7wpfbtub9Y7RLQ",
//            "groups": [
//                "default"
//            ],
//            "secret": {
//                "verified": false
//            }
//        },
//        "test-username": {
//            "secret": {
//                "key": "LJZXKNJBJY7W6MKREFXHONBIJY",
//                "verified": false
//            }
//        }
//    }`;
     try {
         data = fs.readFileSync(filePath, 'utf-8');
     } catch (e) {
         throw e;
     }
    users = JSON.parse(data);
    // console.log(users)
    return users;
}
function getAdminUsers(){
    let _filePath = Config.adminFP;
    let data = '';
    _filePath = require('path').resolve(__dirname, '../../' + _filePath);
    try {
        data = fs.readFileSync(_filePath, 'utf-8');
    } catch (e) {
        throw e;
    }
   users = JSON.parse(data);
   return users;
}

function save(callback) {
    console.log("YESH***************************************************** save is called")
     fs.writeFile(filePath, JSON.stringify(users, null, 4), (err) => {
         if (err) {
             throw err;
         } else {
             callback();
         }
     });
}

load();

module.exports = {

    authenticate: function (username, password, callback,customFile=null) {
        if(customFile) {
            users = getAdminUsers();
        } else{
            users = load();
        }
        Logger.customLog(users);
        Logger.customLog(users);
        Logger.customLog(username in users);
        if (username in users) {
            Hash.verify(users[username].password, password, equals => {
                if (equals) {
                    callback(null, users[username])
                    // return [null, users[username]];
                } else {
                    callback('error', 'password failure');
                    // return ['error' , 'Password Failure'];
                }
            });
        } else {
            callback('error', 'authentication failure');
            // return ['error'] , ['Auth Failure'];
        }
    },

    create: function (username, password, callback) {
        
        console.log("YESH**************** create ")
        Hash.password(password, hash => {
            users[username] = {
                uid: username,
                password: hash,
                groups: ['default'],
                secret: {verified: false}
            };
            save(() => callback());
        });
    },

    getSecret: function (username, callback) {
        if (username in users) {
            callback(true, users[username].secret);
        } else {
            callback(false);
        }
    },

    setSecret: function (username, secret) {
        console.log("YESH**************** setSecret ")
        if (!(username in users)) {
            users[username] = {};
        }
        users[username].secret = secret;
        save(() => {});
    }
};