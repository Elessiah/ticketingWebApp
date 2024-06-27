const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const lodash = require('lodash');
const User = require('./user');
const Ticket = require('./ticket');

class expressManagement {

    // Status :
    // Pending = 0
    // Covered = 1
    // Dev = 2
    // ToBeVerified = 3
    // Completed = 4
    constructor(port, users) {
	this.port = port;
	this.users = users;
	this.userList = new Array();
	this.users.forEach((element) => this.userList.push(element.username));
	this.app = express();

	this.app.use(cors());

	this.app.listen(this.port, () => {
	    console.log(`Server listening on port`, this.port);
	});

	this.app.all('*', async  (req, res) => {
	    try
	    {
		if (req.path === '/api/login/')
		    await this.manageLogin(req, res);
		else if (req.path === '/api/signUp/')
		    await this.manageSignUp(req, res);
		else if (req.path === '/api/verify/')
		    await this.manageVerify(req, res);
		else if (req.path === '/api/getUsers')
		    await this.getUsers(req, res);
		else if (req.path === '/api/ticketManagement/add')
		    await this.newTicket(req, res);
		else if (req.path === '/api/ticketManagement/edit')
		    await this.editTicket(req, res);
		else if (req.path === '/api/ticketManagement/rm')
		    await this.rmTicket(req, res);
		else if (req.path === '/api/ticketManagement/mv')
		    await this.mvTicket(req, res);
		else if (req.path === '/api/ticketManagement/getTicket')
		    await this.getTicket(req, res);
		else if (req.path === '/api/ticketManagement/getCategory')
		    await this.getCategory(req, res);
		else
		    await res.status(404).send('<h1>Sorry, we cannot find that !</h1>');
	    }
	    catch (e)
	    {
		console.log(e);
		await res.status(500).send('Un problème est survenue. Merci de réessayer plus tard !');
	    }
	});
    }

    async verifToken(username, token)
    {
	if (lodash.isNil(username) || lodash.isNil(token))
	    return false;
	if (!this.users.has(username))
	    return false;
	const inputToken = token.replaceAll(" ", "+");
	if (inputToken === (this.users.get(username)).hash)
	    return true;
	return false;
    }

    async addTicketToAssigned(elem, ticket)
    {
	await (await this.users.get(elem)).tickets[0].set(ticket.title, ticket);
    }

    async newTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.priority) || lodash.isNil(req.query.admin)
	    || lodash.isNil(req.query.category) || lodash.isNil(req.query.assigned)
	    || lodash.isNil(req.query.title) || lodash.isNil(req.query.description))
	    return await res.status(401).send('Missing one or more argument');
	const boardAssignedList = await req.query.assigned.split(',');
	const ticket = new Ticket(req.query.priority,
				  req.query.admin,
				  req.query.category,
				  boardAssignedList,
				  req.query.title,
				  req.query.description);
	await boardAssignedList.forEach((elem) => (this.addTicketToAssigned(elem, ticket)));
	if (!boardAssignedList.includes(ticket.admin))
	    await (await this.users.get(ticket.admin)).tickets[0].set(ticket.title, ticket);
	//console.log('Assigned member : ', boardAssignedList, 'admin :', ticket.admin, 'users : ', this.users);
	return await res.status(200).send('Ticket created !');
    }

    async editTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.priority) || lodash.isNil(req.query.admin)
	    || lodash.isNil(req.query.category) || lodash.isNil(req.query.assigned)
	    || lodash.isNil(req.query.title) || lodash.isNil(req.query.description)
	    || lodash.isNil(req.query.oldTitle))
	    return await res.status(401).send('Missing one or more argument');
	let target = null;
	for (i = 0; i < 5; i += 1)
	{
	    if (await (await this.users.get(req.query.username)).tickets[i].has(req.query.oldtitle))
		target = await (await this.users.get(req.query.username)).tickets[i].get(req.query.oldTitle);
	}
	if (target === null)
	    return await res.status(404).send('Ticket not found !');

	target.priority = req.query.priority;
	target.admin = req.query.admin;
	target.category = req.query.category;
	target.assigned = req.query.assigned;
	target.title = req.query.title;
	target.description = req.query.description;
	await res.status(200).send('Ticket edited !');
    }

    async deleteUserTicket(value, key, map, title, adminName)
    {
    	for (i = 0; i < 5; i += 1)
	{
	    if (await value.tickets[i].has(title))
	    {
		const ticket = await value.tickets[i].get(title);
		if (ticket.admin === adminName)
		{
		    await value.tickets[i].delete(title);
		    await res.status(200).send('Ticket removed !');
		}
	    }
	}
    }

    async rmTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.title))
	    return await res.status(401).send('Missing one or more argument');
	const username = req.query.username;
	this.users.forEach((value, key, map) => ( this.deleteUserTicket(value, key, map, username)));
	await res.status(404).send('Ticket not found !');
    }

    async userMvTicket(value, key, map, title, currentStatus, targetStatus)
    {
	const ticket = await (value).tickets[currentStatus].get(title);
	await (value).tickets[targetStatus].set(title, ticket);
	await (value).tickets[currentStatus].delete(title);
    }

    async mvTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.currentStatus) || lodash.isNil(req.query.targetStatus)
	    || lodash.isNil(req.query.title))
	    return await res.status(401).send('Missing one or more argument');
	if (!await (await this.users.get(req.query.username)).tickets[req.query.currentStatus].has(req.query.title))
	    return await res.status(404).send('Ticket not found');
	await this.users.forEach((value, key, map) => (this.userMvTicket(value, key, map, req.query.title, req.query.currentStatus, req.query.targetStatus)));
	return await res.status(200).send('Ticket(s) moved !');
    }

    async getTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token or username');
	if (lodash.isNil(req.query.title))
	    return await res.status(401).send('Missing title argument');
	for (i = 0; i < 5; i += 1)
	{
	    const user = await this.users.get(req.query.username);
	    if (await this.ticketStatus[i].has(req.query.title))
	    {
		const ticket = await user.tickets[i].get(req.query.title);
		return await res.json(ticket);
	    }
	}
	return await res.status(404).send('Ticket not found');
    }

    async getCategory(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token or username');
	if (lodash.isNil(req.query.category))
	    return await res.status(401).send('Missing category argument');
	console.log(await this.users.get(req.query.username));
	return await res.json(Array.from(await (await this.users.get(req.query.username)).tickets[req.query.category], ([name, value]) => ( value )));
    }

    async getUsers(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token or username');
	return await res.json(this.userList.toString());
    }

    async manageSignUp(req, res)
    {
	if (lodash.isNil(req.query.login) || lodash.isNil(req.query.password))
	    return await res.status(401).send('Missing one or more argument');
	if (req.query.login.length < 3 || req.query.login.length > 20)
	    return await res.status(409).send('Wrong format of login');
	if (req.query.password.length < 8 || req.query.password.length > 40)
	    return await res.status(409).send('Wrong format of password');
	if (this.users.has(req.query.login))
	    return await res.status(409).send('This username is already used !');
	const hash = await argon2.hash(req.query.login + 'efrits' + req.query.password);
 	await this.users.set(req.query.login, new User(req.query.login, hash));
	await this.userList.push(req.query.login);
	await res.send({ hash });
	return;
    }

    async manageLogin(req, res)
    {
	if (lodash.isNil(req.query.login) || lodash.isNil(req.query.password))
	    return await res.status(401).send('Missing one or more argument');
	if (!this.users.has(req.query.login))
	    return await res.status(409).send('Wrong username or password !');
	if (await argon2.verify(await this.users.get(req.query.login).hash, req.query.login + 'efrits' + req.query.password))
	{
	    const hash = await this.users.get(req.query.login).hash;
	    await res.send({ hash });
	}
	else
	    await res.status(409).send('Wrong username or password !');
    }

    async manageVerify(req, res)
    {
	if (await this.verifToken(req.query.username, req.query.token) === true)
	{
	    const inputToken = req.query.token;
	    await res.send({ inputToken });
	}
	else
	    return await res.status(406).send('Wrong token !');
    }
}

module.exports = expressManagement;
