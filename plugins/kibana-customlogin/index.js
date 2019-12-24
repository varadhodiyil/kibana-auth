const Filter = require('./src/api/filter');
const DB = require('./src/api/DB');
const API = require('./src/api/api');
const Config = require('./src/config').load('authentication');
const Logger = require('./src/logger');
import { resolve } from 'path';
import { existsSync } from 'fs';
//const rorPlugin = require('./src/api/esclientplugin');

require('./src/authentication/auth');

module.exports = function(kibana) {
  return new kibana.Plugin({
    name: 'kibana-customlogin',
    require: ['elasticsearch'],
    uiExports: {
      app: {
        title: 'Admin Console',
        description: 'customlogin authentication plugin.',
        main: 'plugins/kibana-customlogin/script/app',
        euiIconType: 'securityApp',
        icon: 'plugins/kibana-customlogin/img/icon.svg',
      },
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init: async function(server, options) {
      Logger.writer(server);
      Filter.proxy();
      // const config = Object.assign({ plugins: [rorPlugin] }, server.config().get('elasticsearch'));
      // const cluster = server.plugins.elasticsearch.createCluster('customlogin', config);

      await API.register(server);
      DB.init();
      Logger.started();
    },
  });
};
