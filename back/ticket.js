class Ticket
{
    constructor(priority, admin, category, assignedList, title, description)
    {
	this.priority = priority;
	this.admin = admin;
	this.category = category;
	this.assignedList = assignedList,
	this.title = title;
	this.description = description;
    }
}

module.exports = Ticket
