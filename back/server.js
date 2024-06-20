const expressManagement = require('./expressManagement');

class Server {
    constructor(port) {
	this.port = port;
	this.users = new Map();
	this.express = new expressManagement(port, this.users);
    }

}

module.exports = Server;
