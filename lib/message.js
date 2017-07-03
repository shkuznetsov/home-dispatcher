'use strict';

const DEFAULT_TTL = 30000;

class Message {
	constructor (opt) {
		// Sanitise opt
		if (typeof opt !== 'object') opt = {};

		// Message action (mandatory)
		if (typeof opt.action === "string") this.action = opt.action;
		else throw('No valid action provided');

		if (typeof opt.to === "string") this.to = opt.to;
		if (typeof opt.topic === "string") this.topic = opt.topic;

		this.wait = !!opt.wait;
		this.ttl = (typeof opt.ttl === "number") ? opt.ttl : DEFAULT_TTL;
	}

	/**
	 * Checks whether the message is direct
	 */
	isDirect () {
		return !!this.to;
	}

	/**
	 * Checks whether the message is sent to a topic
	 */
	isTopic () {
		return !this.to && this.topic;
	}

	/**
	 * Checks whether the message is sent to an action
	 */
	isAction () {
		return !this.to && !this.topic;
	}

	_setFrom (from) {
		this.from = from;
	}
}

module.exports = Message;