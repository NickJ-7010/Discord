const { JsonDB } = require('node-json-db');
const { Config } = require('../../node_modules/node-json-db/dist/lib/JsonDBConfig');
const db = new JsonDB(new Config("config/db", true, true));

module.exports = { db };