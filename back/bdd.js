const sqlite = require('sqlite3').verbose();
const fs = require('node.fs');

class Bdd
{
    constructor()
    {}

    get(sql)
    {
	return new Promise((resolve, reject) => {
	    this.db.all(sql, {}, (err, rows) => {
		if (err)
		    reject(err);
		else
		    resolve(rows);
	    });
	});
    }

    exec(sql)
    {
	return new Promise(resolve => {
	    this.db.exec(sql, resolve);
	});
    }

    createTable()
    {
	this.exec
}
