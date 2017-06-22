'use strict';

const Dispatcher = require('./dispatcher.js');

const dispatcher = new Dispatcher();

dispatcher.hello({
}).then(() => console.log('resolved'), () => console.log('rejected'));