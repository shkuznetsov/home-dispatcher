class Dispatcher {
	constructor (opt) {
		this.endpointsById = {};
		this.endpointsByAction = {};
		this.endpointsByTopicAction = {};
	}

	/**
	 * Being called by an endpoint object to establish connection
	 * @param {Vuzel.Endpoint} endpoint - The endpoint object.
	 */
	connect (endpoint) {
		this._createBindings(endpoint);
		endpoint._connected();
	}

	/**
	 * Updates bindings for the specified endpoint
	 * @param {Vuzel.Endpoint} endpoint - An endpoint to update bindings for
	 * @private
	 */
	_updateBindings (endpoint) {
		this._removeBindings(endpoint);
		this._createBindings(endpoint);
	}

	/**
	 * Creates bindings for the specified endpoint
	 * @param {Vuzel.Endpoint} endpoint - An endpoint to create bindings for
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
	 * @param {Vuzel.Endpoint} endpoint - An endpoint to remove
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

	getReceivers (message) {
		let receivers = {};
		if (message.isDirect() && this.endpointsById[message.to] && this.endpointsById[message.to].isListeningTo(action)) {
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

	send (message) {
		return new Promise((resolve, reject) => {
			let receivers = this.getReceivers(message);
		});
	}
}

module.exports = Dispatcher;