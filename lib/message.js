'use strict';

// Don't wait even if no receiver available at the moment of dispatch
const WAIT_NEVER = 0;
// Wait max TTL milliseconds for at least one receiver to become available
const WAIT_IF_NO_RECV = 1;
// Wait TTL milliseconds even if receivers are available
const WAIT_ALWAYS = 2;

// No response is expected or waited for
const RESPONSE_NONE = 0;
// Multiple endpoints can respond, only the first response is waited for and delivered back to the sender
const RESPONSE_FIRST = 1;
// Multiple endpoints can respond, all the responses are waited for and delivered back to the sender
const RESPONSE_ALL = 2;

const DEFAULT_AWAIT_DELIVERY = WAIT_NEVER;
const DEFAULT_AWAIT_RESPONSE = RESPONSE_NONE;
const DEFAULT_TTL = 30000;

class Message {
	constructor (opt) {
		// Sanitise opt
		if (typeof opt !== 'object') opt = {};

		// Message action (mandatory)
		if (typeof opt.action === "string") this.action = opt.action;
		else throw('No valid action provided');

		// Receiver ID or topic (topic is ignored if the receiver ID was provided)
		if (typeof opt.to === "string") this.to = opt.to;
		else if (typeof opt.topic === "string") this.topic = opt.topic;

		this.awaitDelivery = [WAIT_NEVER, WAIT_IF_NO_RECV, WAIT_ALWAYS].includes(opt.awaitDelivery) ? opt.awaitDelivery : DEFAULT_AWAIT_DELIVERY;
		this.awaitResponse = [RESPONSE_NONE, RESPONSE_FIRST, RESPONSE_ALL].includes(opt.awaitResponse) ? opt.awaitResponse : DEFAULT_AWAIT_RESPONSE;
		this.ttl = (typeof opt.ttl === "number") ? opt.ttl : DEFAULT_TTL;
	}

	// Const getters
	static get WAIT_NEVER() { return WAIT_NEVER; }
	static get WAIT_IF_NO_RECV() { return WAIT_IF_NO_RECV; }
	static get WAIT_ALWAYS() { return WAIT_ALWAYS; }
	static get RESPONSE_NONE() { return RESPONSE_NONE; }
	static get RESPONSE_FIRST() { return RESPONSE_FIRST; }
	static get RESPONSE_ALL() { return RESPONSE_ALL; }

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