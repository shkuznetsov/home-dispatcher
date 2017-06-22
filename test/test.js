'use strict';

let	expect = require('chai').expect,
    Dispatcher = require('../dispatcher.js');

describe('Dispatcher', function()
{
	let dispatcher;
	
	it("should be able to initialise", (done) => {
		dispatcher = Dispatcher({}, done);
	});
});