class User
{
    constructor(username, hash)
    {
	this.username = username;
	this.hash = hash;
	this.tickets = new Array(new Map, new Map, new Map, new Map, new Map);
    }
}

module.exports = User
