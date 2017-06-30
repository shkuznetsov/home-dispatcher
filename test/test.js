'use strict';

const expect = require('chai').expect;
const Vuzel = require('../vuzel.js');

let dispatcher;
let endpoint;

describe('Vuzel.Dispatcher', () => {
	it("should be able to initialise", () => {
		dispatcher = new Vuzel.Dispatcher({
			//
		});
	});
});

describe('Vuzel.Endpoint', () => {
	it("should throw if no 'id' supplied", () => {
		expect(() => new Vuzel.Endpoint()).to.throw();
	});
	it("should throw if non-string 'id' supplied", () => {
		expect(() => new Vuzel.Endpoint({id: []})).to.throw();
	});
	it("should not throw if only 'id' supplied", () => {
		expect(() => new Vuzel.Endpoint({id: 'endpoint'})).not.to.throw();
	});
	it("should emit `connected` on the next tick when given a dispatcher instance as an opt", (done) => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint', dispatcher: dispatcher});
		endpoint.on('connected', done);
	});
	it("should emit `connected` on the next tick when given a dispatcher via connect()", (done) => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint'});
		endpoint.connect(dispatcher);
		endpoint.on('connected', done);
	});
	it("should allow single subscription via opts", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint', topic: 'topic'});
		expect(endpoint.isSubscribedTo('topic')).to.be.true;
	});
	it("should allow multiple subscription via opts", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint', topics: ['topic1', 'topic2']});
		expect(endpoint.isSubscribedTo('topic1')).to.be.true;
		expect(endpoint.isSubscribedTo('topic2')).to.be.true;
	});
	it("should allow single subscription via subscribe()", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint'});
		endpoint.subscribe('topic');
		expect(endpoint.isSubscribedTo('topic')).to.be.true;
	});
	it("should allow multiple subscription via subscribe()", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint'});
		endpoint.subscribe(['topic1', 'topic2']);
		expect(endpoint.isSubscribedTo('topic1')).to.be.true;
		expect(endpoint.isSubscribedTo('topic2')).to.be.true;
	});
	it("should allow single unsubscription via unsubscribe()", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint', topic: 'topic'});
		endpoint.unsubscribe('topic');
		expect(endpoint.isSubscribedTo('topic')).to.be.false;
	});
	it("should allow multiple unsubscription via unsubscribe()", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint', topics: ['topic1', 'topic2']});
		endpoint.unsubscribe(['topic1', 'topic2']);
		expect(endpoint.isSubscribedTo('topic1')).to.be.false;
		expect(endpoint.isSubscribedTo('topic2')).to.be.false;
	});
	it("should update actions when listener added or removed", () => {
		let endpoint = new Vuzel.Endpoint({id: 'endpoint'});
		let callback = () => {};
		endpoint.recv.on('action', callback);
		expect(endpoint.isListeningTo('action')).to.be.true;
		endpoint.recv.removeListener('action', callback);
		expect(endpoint.isListeningTo('action')).to.be.false;
	});
});

describe('Vuzel.Message', () => {
	it("should throw if no 'action' supplied", () => {
		expect(() => new Vuzel.Message()).to.throw();
	});
	it("should throw if non-string 'action' supplied", () => {
		expect(() => new Vuzel.Message({action: []})).to.throw();
	});
	it("should not throw if only 'action' supplied", () => {
		expect(() => new Vuzel.Message({action: 'action'})).not.to.throw();
	});
});

describe('Vuzel.Endpoint.send()', () => {
	//
});