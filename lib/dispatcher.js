class Dispatcher {
	constructor (opt) {
		this.endpointsById = {};
		this.endpointsByAction = {};
		this.endpointsByTopicAction = {};
	}

	/**
	 * Being called by an endpoint object to establish connection
	 * @param {Endpoint} endpoint - The endpoint object.
	 */
	connect (endpoint) {
		this._createBindings(endpoint);
		endpoint._connected();
	}

	/**
	 * Updates bindings for the specified endpoint
	 * @param {Endpoint} endpoint - An endpoint to update bindings for
	 * @private
	 */
	_updateBindings (endpoint) {
		this._removeBindings(endpoint);
		this._createBindings(endpoint);
	}

	/**
	 * Creates bindings for the specified endpoint
	 * @param {Endpoint} endpoint - An endpoint to create bindings for
	 */
	_createBindings (endpoint) {
		// Direct binding
		this.endpointsById[endpoint.id] = endpoint;
		// Action bindings (for unsubscribed endpoints only)
		if (endpoint.topics.length === 0) endpoint.actions.forEach((action) => {
			this.endpointsByAction[action][endpoint.id] = endpoint
		});
		else endpoint.topics.forEach((topic) => {
			endpoint.actions.forEach((action) => {
				this.endpointsByTopicAction[topic][action][endpoint.id] = endpoint;
			});
		});
	}

	/**
	 * Removes specified endpoint from all the bindings
	 * @param {Endpoint} endpoint - An endpoint to remove
	 * @private
	 */
	_removeBindings (endpoint) {
		// Remove direct binding
		delete(this.endpointsById[endpoint.id]);
		// Remove action bindings
		for (let action in this.endpointsByAction)
			delete(this.endpointsByAction[action][endpoint.id]);
		// Remove topic/action bindings
		for (let topic in this.endpointsByTopicAction)
			for (let action in this.endpointsByTopicAction[topic])
				delete(this.endpointsByTopicAction[topic][action][endpoint.id]);
	}

	/**
	 * Returns an object containing all the currently connected endpoints the message should be received by
	 * @param {Message} message - A message to deliver
	 * @returns {{}}
	 */
	getReceiversFor (message) {
		let receivers;
		if (message.isDirect() && this.endpointsById[message.to] && this.endpointsById[message.to].isListeningTo(message.action)) {
			receivers[message.to] = this.endpointsById[message.to];
		}
		else if (message.isAction() && this.endpointsByAction[message.action]) {
			receivers = this.endpointsByAction[message.action];
		}
		else if (message.isTopic() && this.endpointsByTopicAction[message.topic] && this.endpointsByTopicAction[message.topic][message.action]) {
			receivers = this.endpointsByTopicAction[message.topic][message.action];
		}
		return receivers;
	}

	/**
	 * Sends a message via the dispatcher
	 * @param {Message} message - A message to send
	 * @param {function(err, response)} callback - A callback method, which gets called when the message is delivered/failed
	 * @returns {Promise} - Resolves when a message is delivered, rejects when it fails to deliver
	 */
	send (message, callback) {
		let receivers = this.getReceiversFor(message);
		for (let id in receivers) receivers[id].receive(message);
		if (message.shouldWait())


		let deliveryPromise =

		for (let id in receivers) {
			message.addReceiver(receivers[id]);
			responses[id] = receivers[id].receive(message);
		}

		if (typeof callback === 'function') message.callback = callback;

		return message.promise;
	}
}

module.exports = Dispatcher;