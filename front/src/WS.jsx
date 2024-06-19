class WS {
    constructor({protocol = 'ws:', host = 'localhost', port = '8080'}) {
	this.protocol = protocol;
	this.host = host;
	this.port = port;
	this.createWS();
    }

    createWS() {
	this.socket = new WebSocket(`${this.protocol}//${this.host}:${this.port}`);
	this.isOpen = false;
	this.isClose = false;

	this.onOpen = this.onOpen.bind(this);
	this.onClose = this.onClose.bind(this);
	this.onError = this.onError.bind(this);
	this.onMessage = this.onMessage.bind(this);

	this.socket.addEventListener('close', this.onClose);
	this.socket.addEventListener('error', this.onError);
	this.socket.addEventListener('open', this.onOpen);
	this.socket.addEventListener('message', this.onMessage);

	setInterval(() => {
	    if (this.isClose) {
		console.log('Trying to connect to WebSocket Server');
		this.createWS();
	    }
	}, 1000);
    }

    onOpen() {
	this.isOpen = true;
	this.isClose = true;
	console.log('WebSocket connected');
	if (this.onConnected) {
	    this.onConnected();
	}
    }

    onClose() {
	this.isOpen = false;
	this.isClose = true;
	console.log('WebSocket closed by server');
	if (this.onDisconnected) {
	    this.onDisconnected();
	}
    }

    onError() {
	this.isOpen = false;
	this.isClose = true;
	console.error('WebSocket closed due to error');
	if (this.onDisconnected) {
	    this.onDisconnected();
	}
    }

    onMessage(event) {
	const { data } = event;
	const value = JSON.parse(data);
	if (this.onData) {
	    this.onData(value);
	}
    }

    send(data) {
	if (this.isOpen) {
	    this.socket.send(JSON.stringify(data));
	}
    }

}

export default WS;
