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
	this.userList = new Map();
	this.ticketStatus = new Array(new Map, new Map, new Map, new Map, new Map);
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
		else if (req.path === '/api/ticketManagement/get')
		    await this.getTicket(req, res);
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
	const inputToken = req.query.token.replaceAll(" ", "+");
	if (inputToken === this.users.get(username).hash)
	    return true;
	return false;
    }

    async newTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.priority) || lodash.isNil(req.query.admin)
	    || lodash.isNil(req.query.category) || lodash.isNil(req.query.assigned)
	    || lodash.isNil(req.query.title) || lodash.isNil(req.query.description))
	    return await res.status(401).send('Missing one or more argument');
	const boardAssignedList = req.query.assignedList.split(',');
	await this.ticketStatus[0].set(req.query.title, new Ticket(req.query.priority,
							    req.query.admin,
							    req.query.category,
							    boardAssignedList,
							    req.query.title,
							    req.query.description));
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
	    if (await this.ticketStatus[i].has(title))
		target = await this.ticketStatus[i].get(title);
	}
	if (target === false)
	    return await res.status(404).send('Ticket not found !');

	target.priority = req.query.priority;
	target.admin = req.query.admin;
	target.category = req.query.category;
	target.assigned = req.query.assigned;
	target.title = req.query.title;
	target.description = req.query.description;
	await res.status(200).send('Ticket edited !');
    }

    async rmTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.priority) || lodash.isNil(req.query.admin)
	    || lodash.isNil(req.query.category) || lodash.isNil(req.query.assigned)
	    || lodash.isNil(req.query.title) || lodash.isNil(req.query.description))
	    return await res.status(401).send('Missing one or more argument');
	for (i = 0; i < 5; i += 1)
	{
	    if (await this.ticketStatus[i].has(title))
	    {
		await this.ticketStatus[i].delete(title);
		return await res.status(200).send('Ticket removed !');
	    }
	}
	await res.status(404).send('Ticket not found !');
    }

    async mvTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.currentStatus) || lodash.isNil(req.query.targetStatus)
	    || lodash.isNil(req.query.title))
	    return await res.status(401).send('Missing one or more argument');
	if (!await this.ticketStatus[Number(req.query.currentStatus)].has(req.query.title))
	    return await res.status(404).send('Ticket not found');
	const ticket = await this.ticketStatus[req.query.currentStatus].get(req.query.title);
	await this.ticketStatus[req.query.targetStatus].set(req.query.title, ticket);
	await this.ticketStatus[req.query.currentStatus].delete(req.query.title);
	return await res.status(200).send('Ticket moved !');
    }

    async getTicket(req, res)
    {
	if (! await this.verifToken(req.query.username, req.query.token))
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' and input ' + inputToken);
	if (lodash.isNil(req.query.title))
	    return await res.status(401).send('Missing one or more argument');
	for (i = 0; i < 5; i += 1)
	{
	    if (await this.ticketStatus[i].has(req.query.title))
	    {
		const ticket = this.ticketStatus[i].get(req.query.title);
		return await res.json(ticket);
	    }
	}
	return await res.status(404).send('Ticket not found');
    }

    async getUsers(req, res)
    {
	if (lodash.isNil(req.query.token) || lodash.isNil(req.query.username))
	    return await res.status(401).send('Missing one or more argument');
	const inputToken = req.query.token.replaceAll(" ", "+");
	if (inputToken === this.users.get(req.query.username).hash)
	    return await res.json(this.userList.toString());
	return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' et input ' + inputToken);
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
	if (verifToken(req.query.username, req.query.token))
	{
	    const inputToken = req.query.token;
	    await res.send({ inputToken });
	}
	else
	    return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' et input ' + inputToken);
    }
}

module.exports = expressManagement;
