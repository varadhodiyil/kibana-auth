/**
 * @author  
 *
 * Hashes passwords for long-term storage.
 */

// const argon2 = require('argon2-ffi').argon2i;
// const argon2 = require('argon2');
const crypto = require('crypto');
const options = { timeCost: 4, memoryCost: 1 << 14, parallelism: 1, hashLength: 64 };
const { sha256 } = require('crypto-hash');
import {customLog} from '../logger';
module.exports = {

    /**
     * Hashes the given plaintext as a password.
     *
     * @param plaintext the password plaintext to be hashed.
     * @param callback called with the resulting hash.
     */
    password: (plaintext, callback) => {
        crypto.randomBytes(32, (err, salt) => {
            // argon2.hash(new Buffer(plaintext), salt, options).then(hash => {
            //     callback(hash);
            // }).catch(err => {
            //     throw err;
            // });
            sha256(plaintext, options).then(hash => {
                callback(hash);
            });
            callback(true);
        });
    },

    /**
     * Verifies the given plaintext against the given hash by
     * hashing the plaintext and comparing the hashes in constant
     * time.
     *
     * @param hash the hash to check the hash(plaintext) for equality
     * @param plaintext the plaintext to be hashed
     * @param callback true if equal
     */
    verify: (hash, plaintext, callback) => {
        // argon2.verify(hash, plaintext).then(match =>
        //     callback(match)
        // ).catch(err => {
        //     throw err;
        // });
        (async () => {
            const plainTextHash = await sha256(plaintext);
        customLog(`Check ${plaintext} , ${hash} , ${plainTextHash}`);
        if(plainTextHash === hash ){
            callback(true);
        } else{
            callback(false);
        }
        })();
        
    }
};