/**
 * @author  
 *
 * Simple configuration loader, loads the file from disk
 * on inclusion.
 */

const fs = require('fs');

const CONFIG_PATH = require('path').resolve(__dirname, '../config.json');
const PACKAGE_PATH = require('path').resolve(__dirname, '../package.json');

let config;
let pkg;

function load() {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8'));
}

load();

module.exports = {

    /**
     * Returns the configuration for a given section.
     *
     * @param name the section to be returned from the config file..
     */
    load: (name) => {
        return config[name];
    },

    /**
     * Reloads configuration from file.
     */
    reload: () => {
      load();
    },

    /**
     * Writes the current configuration to disk.
     */
    save: () => {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    },

    /**
     * Returns the configured token secret.
    */
    secret: () => {
        return config['authentication']['secret'];
    },

    /**
     * Sets the secret used to sign tokens.
     */
    setSecret: (secret) => {
        config['authentication']['secret'] = secret;
        module.exports.save();
    },

    /**
     * Returns the cookie configuration.
     */
    cookie: () => {
        return config['authentication']['cookie'];
    },

    /**
     * Returns the kibana version from configuration.
     */
    version: () => {
        return config['authentication']['kbnVersion'];
    },

    /**
     * Returns the version of the plugin from package.json.
     */
    pluginVersion: () => {
        return pkg['version'];
    },

    /**
     * Returns the name of the plugin from package.json.
     */
    pluginName: () => {
        return pkg['name'];
    },

    /**
     * @return the configuration object.
     */
    get: () => config
};
