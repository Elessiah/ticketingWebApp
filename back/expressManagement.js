const express = require('express');
const cors = require('cors');
const argon2 = require('argon2');
const lodash = require('lodash');
const User = require('./user');

class expressManagement {

    constructor(port, users) {
	this.port = port;
	this.users = users;
	this.app = express();

	this.app.use(cors());

	this.app.listen(this.port, () => {
	    console.log(`Server listening on port`, this.port);
	});

	this.app.all('*', async  (req, res) => {
	    try
	    {
		if (req.path === '/api/login/')
		{
		    await this.manageLogin(req, res);
		    return;
		}
		else if (req.path === '/api/signUp/') {
		    await this.manageSignUp(req, res);
		    return;
		}
		else if (req.path === '/api/verify/')
		{
		    await this.manageVerify(req, res);
		    return;
		}
		else if (req.path === '/api/ticket/pending')
		{
		    await this.managePendingTicket(req, res);
		    return;
		}
		else if (req.path === '/api/ticket/covered')
		{
		    await this.manageCoveredTicket(req, res);
		    return;
		}
		else if (req.path === '/api/ticket/developpement')
		{
		    await this.manageDeveloppementTicket(req, res);
		    return;
		}
		else if (req.path === '/api/ticket/toBeVerified')
		{
		    await this.manageToBeVerifiedTicket(req, res);
		    return;
		}
		else if (req.path === '/api/ticket/completed')
		{
		    await this.manageCompletedTicket(req, res);
		    return;
		}
		await res.status(404).send('<h1>Sorry, we cannot find that !</h1>');
	    }
	    catch (e)
	    {
		console.log(e);
		await res.status(500).send('Un problème est survenue. Merci de réessayer plus tard !');
	    }
	});
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
	    console.log(typeof(hash));
	    await res.send({ hash });
	}
	else
	    await res.status(409).send('Wrong username or password !');
    }

    async manageVerify(req, res)
    {
	if (lodash.isNil(req.query.token) || lodash.isNil(req.query.username))
	    return await res.status(401).send('Missing one or more argument');
	if (!this.users.has(req.query.username))
	    return await res.status(406).send('Wrong username !');
	const inputToken = req.query.token.replace(" ", "+");
	if (inputToken === this.users.get(req.query.username).hash)
	{
	    await res.send({ inputToken });
	    return;
	}
	return await res.status(406).send('Wrong token' + this.users.get(req.query.username).hash + ' et input ' + inputToken);
    }
}

module.exports = expressManagement;
