'use strict';

class Message {
	constructor (dispatcher, from, opt) {
		if (typeof opt !== "object") opt = {};
		if (typeof opt.action === "string") this.action = opt.action;
		else throw('No valid action provided');
		if (typeof opt.to === "string") this.to = opt.to;
		if (typeof opt.topic === "string") this.topic = opt.topic;
		if (typeof opt.data !== "undefined") this.data = opt.data;
		this.from = from;
	}
}

module.exports.Dispatcher = require('./lib/dispatcher');
module.exports.Endpoint = require('./lib/endpoint');
module.exports.Message = require('./lib/message');