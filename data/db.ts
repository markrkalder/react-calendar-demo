import { JsonDB, Config } from 'node-json-db';

const db = new JsonDB(new Config('events', true, false));

export default db;
