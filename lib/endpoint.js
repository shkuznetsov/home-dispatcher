'use strict';

const EventEmitter = require('events');
const Message = require('./message.js');
const UArray = require('./uarray.js');

class Endpoint extends EventEmitter {
	constructor (opt) {
		// EventEmitter constructor
		super();

		// String opt will be interpreted as endpoint ID
		if (typeof opt === 'string') this.id = opt;

		// Default opt to object
		if (typeof opt !== 'object') opt = {};

		// Endpoint ID
		if (typeof opt.id === "string") this.id = opt.id;
		else if (!this.id) throw('No valid endpoint ID provided');

		// Connect via opts
		if (opt.dispatcher) this.connect(opt.dispatcher);

		// Topic subscriptions
		this.topics = new UArray();
		if (Array.isArray(opt.topics)) this.subscribe(opt.topics);
		if (typeof opt.topic === 'string') this.subscribe(opt.topic);

		// Actions and receiver
		this.actions = new UArray();
		this.recv = new EventEmitter();
		this.recv.on('newListener', (event) => this._addAction(event));
		this.recv.on('removeListener', (event) => this._removeAction(event));
	}

	connect (dispatcher) {
		this.dispatcher = dispatcher;
		this.dispatcher.connect(this);
	}

	/**
	 * Subscribe to a topic or topics
	 * @param {string|Array} topics - A single topic may be passed as a string, an array of topics may be passed as an array
	 */
	subscribe (topics) {
		let changed;
		if (typeof topics === 'string') changed = this.topics._add(topics);
		else if (Array.isArray(topics)) topics.forEach((topic) => {
			if (this.topics._add(topic)) changed = true;
		});
		// Propagate changes to the dispatcher
		if (changed) this._updateBindings();
	}

	/**
	 * Unsubscribe from a topic or topics
	 * @param {string|Array} topics - A single topic may be passed as a string, an array of topics may be passed as an array
	 */
	unsubscribe (topics) {
		let changed;
		if (typeof topics === 'string') changed = this.topics._remove(topics);
		else if (Array.isArray(topics)) topics.forEach((topic) => {
			if (this.topics._remove(topic)) changed = true;
		});
		// Propagate changes to the dispatcher
		if (changed) this._updateBindings();
	}

	/**
	 * Callback called when an action event handler added
	 * @param {string} action - Name of the action added
	 * @private
	 */
	_addAction (action) {
		if (this.actions._add(action)) this._updateBindings();
	}

	/**
	 * Callback called when an action event handler removed
	 * @param {string} action - Name of the action removed
	 * @private
	 */
	_removeAction (action) {
		if (!this.listenerCount(action) && this.actions._remove(action)) this._updateBindings();
	}

	/**
	 * Updates topics and actions bindings on the dispatcher
	 * @private
	 */
	_updateBindings () {
		if (this.dispatcher) this.dispatcher._updateBindings(this.id, this.topics, this.actions);
	}

	/**
	 * Checks whether the endpoint is subscribed to the specified topic
	 * @param topic
	 * @returns {boolean}
	 */
	isSubscribedTo (topic) {
		return this.topics.indexOf(topic) !== -1;
	}

	/**
	 * Checks whether the endpoint is listening to the specified action
	 * @param action
	 * @returns {boolean}
	 */
	isListeningTo (action) {
		return this.actions.indexOf(action) !== -1;
	}

	/**
	 * A callback called by the dispatcher when connection is established or re-established after disconnect.
	 */
	_connected () {
		// Emit on the next tick to allow handlers to be attached
		process.nextTick(() => this.emit('connected'));
	}

	/**
	 * A callback called by the dispatcher when failed to establish or lost connection.
	 * @param {Error} err - Error object
	 */
	_disconnected (err) {
		// Emit on the next tick to allow handlers to be attached
		process.nextTick(() => this.emit('disconnected', err));
	}

	/**
	 * Sends a message to the dispatcher
	 * @param message
	 * @returns {Promise}
	 */
	send (opt) {
		// Make sure message is an instance of Vuzel.Message
		let message = (opt instanceof Message) ? opt : new Message(opt);
		// Set some pre-flight values
		message._setFrom(this.id);
		// Send the message via dispatcher
		return this.dispatcher.send(message);
	}

	/**
	 * A callback called by the dispatcher when a message is received.
	 * @param message
	 */
	_receive (message) {
		process.nextTick(() => this.recv.emit(message.action, message));
	}
}

module.exports = Endpoint;