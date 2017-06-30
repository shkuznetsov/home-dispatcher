'use strict';

class Message {
	constructor (opt) {
		// Sanitise opt
		if (typeof opt !== 'object') opt = {};

		// Message action (mandatory)
		if (typeof opt.action === "string") this.action = opt.action;
		else throw('No valid action provided');

		if (typeof opt.to === "string") this.to = opt.to;
		if (typeof opt.topic === "string") this.topic = opt.topic;
	}

	_setFrom (from) {
		this.from = from;
	}
}

module.exports = Message;