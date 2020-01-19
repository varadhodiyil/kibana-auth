const ldap = require('ldapjs');
const assert = require('assert');

// LDAP Connection Settings
const server = "64.227.10.16:389"; // 192.168.1.1
const userPrincipalName = "admin"; // Username
const password = "tango"; // User password
const adSuffix = "dc=npci,dc=xyz"; // test.com

const dn =`cn=${userPrincipalName},${adSuffix}`
// Create client and bind to AD
const client = ldap.createClient({
    url: `ldap://${server}`
});

client.bind(dn,password,err => {
    assert.ifError(err);
});

// Search AD for user
const searchOptions = {
    scope: "sub",
    filter: `(cn=${userPrincipalName})`
};

client.search(adSuffix,searchOptions,(err,res) => {
    assert.ifError(err);

    res.on('searchEntry', entry => {
        console.log('search entry');
        console.log(entry.object);
        client.bind(entry.object.dn,password,err => {
            assert.ifError(err);
        });
    });
    res.on('searchReference', referral => {
        console.log('referral: ' + referral.uris.join());
    });
    res.on('error', err => {
        console.error('error: ' + err.message);
    });
    res.on('end', result => {
        console.log('end');
        // console.log(result);
    });
});

// Wrap up
client.unbind( err => {
    assert.ifError(err);
});
// const id = 'admin';
// const groupDn = `ou=groups,dc=npci,dc=xyz`;
// const search = {
//     dn: groupDn,
//     options: {
//         scope: `sub`,
//         filter: new ldap.filters.AndFilter({
//             filters: [
//                 new ldap.filters.EqualityFilter({attribute: 'objectClass', value: 'groupOfNames'}),
//                 new ldap.filters.EqualityFilter({attribute: 'member', value: 'uid=' + id})
//             ]
//         })
//     }
// };

// client.search(search.dn, search.options, (err, result) => {
//     let member = [];

//     result.on('searchEntry', entry => {
//         member.push(entry.object.cn);
//     });

//     result.on('end', () => {
//         console.log(result);
//         // callback(member);
//     });
// });