'use strict';

const BUFFER_NEVER = 0;
const BUFFER_IF_NO_RECV = 1;
const BUFFER_ALWAYS = 2;

const DEFAULT_BUFFER = BUFFER_NEVER;
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

		if ([BUFFER_NEVER, BUFFER_IF_NO_RECV, BUFFER_ALWAYS].includes(opt.buffer)) this.buffer = opt.buffer;
		else this.buffer = DEFAULT_BUFFER;

		this.ttl = (typeof opt.ttl === "number") ? opt.ttl : DEFAULT_TTL;
	}

	// Const getters
	static get BUFFER_NEVER() { return BUFFER_NEVER; }
	static get BUFFER_IF_NO_RECV() { return BUFFER_IF_NO_RECV; }
	static get BUFFER_ALWAYS() { return BUFFER_ALWAYS; }

	/**
	 * Checks whether the message is sent directly to an endpoint
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
}

module.exports = Message;