/**
 * @author  
 *
 * Authenticates user+password combinations against an LDAP server.
 */ 

const LDAP = require('ldapjs');
const Config = require('../config').load('ldap');
const File = require('./file');


// client.bind(Config.admin.dn, Config.admin.password, err => {
//     if (err)
//         throw err;
// });

 
function member(id, callback) {
    const search = {
        dn: Config.search["group-dn"],
        options: {
            scope: Config.search.scope,
            filter: new LDAP.filters.AndFilter({
                filters: [
                    new LDAP.filters.EqualityFilter({attribute: 'objectClass', value: 'groupOfNames'}),
                    new LDAP.filters.EqualityFilter({attribute: 'member', value: 'uid=' + id})
                ]
            })
        }
    };
    const client = LDAP.createClient({url: Config.url});
    client.search(search.dn, search.options, (err, result) => {
        let member = [];

        result.on('searchEntry', entry => {
            member.push(entry.object.cn);
        });

        result.on('end', () => {
            callback(member);
        });
    });
}

module.exports = {

    authenticate: function (username, password, callback) {
        const search = {
            dn: Config.search["user-dn"],
            options: {
                scope: Config.search.scope,
                filter: new LDAP.filters.EqualityFilter({attribute: 'cn', value: username})
            }
        };
        //console.log("filter", new LDAP.filters.EqualityFilter({attribute: 'cn', value: username}))
        username = username.replace("."," ");
        const _dn = `cn=${username},${Config.search["user-dn"]}`;
        // console.log(_dn);
        const _client = LDAP.createClient({url: Config.url});
        _client.bind(_dn,password,err => {
            // assert.ifError(err);
            // console.log('err',err);
            // if(!err){
            //     callback(err, {uid: username, groups: []});
            // }else{
            //     callback('Invalid Creds' , null);
            // }
            _client.unbind(e=>{
                console.log('Unbound');
            });
            if(!err){
                callback(err, {uid: username, groups: []});
            }else{
                callback('Invalid Creds' , null);
            }
        });
        // client.search(search.dn, search.options,  (err, result) => {
        //     let found = false;
        //     let uname = null;
        //     console.log("err",err)
        //     // console.log("result",result)
        //     result.on('searchEntry',async entry => {
        //         found = true;
                
        //         // console.log("entry",entry);
        //         const _dn =`${entry.dn}`;
        //         console.log(_dn, password);
        //         // Verify api by binding to the LDAP server.
        //         await client.bind(_dn,password,err => {
        //             // assert.ifError(err);
        //             uname = {uid: username, groups: []};
        //             found = false;
        //             console.log('bind err',err);
        //             if(!err){
        //                     callback(err, {uid: username, groups: []});
        //             } else {
        //                 callback('Invalid Creds' , null);
        //             }
        //         });
        //         // LDAP.createClient({url: Config.url})
        //         //     .bind(_dn, password, err => {
        //         //         console.log("err second",err);
        //         //         console.log(entry.object.cname);
        //         //         if(!err){
        //         //             callback(err, {uid: entry.object.uid, groups: []});
        //         //         }
        //         //         // member(entry.object.uid, groups => {
        //         //         //     callback(err, {uid: entry.object.uid, groups: groups});
        //         //         // });

        //         //     });
        //     }); 
        //     result.on('*', function() {
        //         console.log("on evrything: ", this.event);
        //       });
              

        //     result.on('end', function(result) {
        //     //     console.log('status: ' + result.status);
        //     // });
        //         console.log("found", found);
        //         console.log('uname',uname);
        //         if (!found) {
        //             callback('No user found', null);
        //         } 
        //         // else {
        //         //     callback(err, uname);
        //         // }
        //     });
        // });
    },

    create: function (username, password, callback) {
        throw new Error('LDAP create user is unsupported.');
    },

    // ldap server does not implement 2fa storage, use on-disk.
    getSecret: function (username, callback) {
        callback(true);
    },
    setSecret: File.setSecret,
};
