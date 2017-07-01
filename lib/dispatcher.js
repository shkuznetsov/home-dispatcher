class Dispatcher {
	constructor (opt) {
		this.endpointsById = {};
	}

	/**
	 * Being called by an endpoint object to establish connection
	 * @param {Vuzel.Endpoint} endpoint - The endpoint object.
	 */
	connect (endpoint) {
		this.endpointsById[endpoint.id] = endpoint;
		endpoint._connected();
	}

	/**
	 * Updates the endpoint's bindings to topics and actions
	 * @param (sting) endpoint_id
	 * @param (array) topics
	 * @param (array) actions
	 * @private
	 */
	_updateBindings (endpoint_id, topics, actions) {
		//TODO: update the endpoint bindings to topics and actions
	}

	_send (message) {
		//return this.ready.then(() => {
			if (message.to && this.endpointsById[message.to]) {
				this.endpointsById[message.to]._receive(message);
			}
		//});
	}
};

module.exports = Dispatcher;