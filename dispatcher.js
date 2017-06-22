'use strict';

const EventEmitter = require('events');

class Dispatcher {
	constructor (opt) {
		this.ready = Promise.resolve(true);
	}
	hello (opt) {
		return this.ready.then(() => {
			if (typeof opt.id != "string") Promise.reject('No valid device ID provided');
			
			
			const handler = new EventEmitter();
			return handler;
		});
	}
}

module.exports = Dispatcher;