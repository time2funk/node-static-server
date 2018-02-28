const MongoClient = require('mongodb').MongoClient;
const db_conf = require('../config/db');


const dbManager = class {
	constructor(){
		console.log('dbManager constructor');
	}
	getDB(callback){
		MongoClient.connect(db_conf.url, async (err, client) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}else{
				console.log('db getDB');
				var db = await client.db(db_conf.name);
				await callback(db);
				return client.close();
			}              
		})
	}
	getCollection(colname, callback){
		MongoClient.connect(db_conf.url, async (err, client) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}else{
				console.log('db getCollection');
				var db = await client.db(db_conf.name);
				await callback( db.collection(colname) );
				return client.close();
			}              
		})
	}
	insertOne(colname, obj, callback){
		MongoClient.connect(db_conf.url, async (err, client) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}else{
				console.log('db insertOne');
				var db = await client.db(db_conf.name);
				await db.collection(colname).insertOne(obj, function(err, r) {
					callback(err, r);
				});
				return client.close();
			}              
		})
	}
	insertMany(colname, arr, callback){
		MongoClient.connect(db_conf.url, async (err, client) => {
			if (err) {
				console.log(err);
				process.exit(1);
			}else{
				console.log('db insertMany');
				var db = await client.db(db_conf.name);
				await db.collection(colname).insertMany(arr, function(err, r) {
					callback(err, r);
				});
				return client.close();
			}              
		})
	}
}
module.exports = new dbManager();