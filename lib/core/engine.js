'use strict';

var Entity = require('./entity');
var Pool = require('./pool');

/**
 * Engine
 *
 * Managing renderer, scene and loop
 *
 * @extends Entity
 */
function Engine() {
	Entity.call(this);
}

Engine.prototype = Object.create(Entity.prototype);

Engine.prototype.tag = 'engine';

Engine.prototype.init = function(element) {
	this.element = element;

	this.time = 0.0;
	this.lastTime = 0.0;
	this.frame = 0;
	this.tail = 0.0;
	this.fdt = 1 / 30;
	this.dtMin = 1 / 60;
	this.dtCap = 0.5;
	this.fdtCap = this.fdt * 5;
	this.scale = 1;

	this.debug = {
		profile: 0,
		step: false,
		time: true
	};
	this.samples = {
		dt: 0,
		lag: 0,
		tick: 0,
		fixedUpdate: 0,
		update: 0,
		render: 0
	};

	// Late require. TODO: Justify!
	var Console = require('./console');
	Console.alloc(this);
	var Input = require('./input');
	Input.alloc(this);

	var engine = this;
	this.tickBound = function Engine_tick(now) {
		return engine.tick(now);
	};
};

/**
 * Set scene and start game loop
 *
 * @param {Entity} Scene
 */
Engine.prototype.play = function(scene) {
	this.scene = scene;
	this.start();
};

/**
 * Start loop
 */
Engine.prototype.start = function() {
	if (this.running) {
		return;
	}
	this.running = true;
	requestAnimationFrame(this.tickBound);
};

/**
 * Game loop tick, called by requestAnimationFrame
 *
 * @param {Number} Delta time
 */
Engine.prototype.tick = function(time) {
	time = (time && time < 1e12 ? time : perf.now()) / 1000;
	this.time = time;

	if (this.running) {
		requestAnimationFrame(this.tickBound);
	}

	var debug = this.debug;
	var samples = this.samples;
	var fdt = this.fdt;

	if (this.lastTime) {
		var dt = time - this.lastTime;
		if (dt > this.dtCap) {
			dt = this.dtMin;
		} else if (dt > 0.01) {
			samples.dt = dt;
			var lag = time - samples.next;
			if (lag > 0) {
				samples.lag = lag * 1000;
			}
		}
		this.dt = (dt *= this.scale);
		this.frame++;

		if (debug.profile && !debug.profileFrom) {
			debug.profileFrom = debug.profile;
			console.profile("Frame " + debug.profileFrom);
		}

		var ping = perf.now();
		var pingTick = ping;

		// Invoke fixed updates
		var tail = Math.min(this.tail + dt, this.fdtCap * this.scale);
		while (tail >= fdt) {
			tail -= fdt;
			Pool.invoke('fixedUpdate', fdt);
			Pool.invoke('simulate', fdt);
		}
		this.tail = tail;

		var pong = perf.now();
		samples.fixedUpdate = pong - ping;
		ping = pong;

		// Invoke update
		Pool.invoke('update', dt);

		Pool.free();

		Pool.invoke('postUpdate', dt);

		pong = perf.now();
		samples.update = pong - ping;
		ping = pong;

		// Invoke render
		Pool.invoke('preRender', dt);

		var ctx = this.renderer.save();
		Pool.invoke('render', ctx);
		this.renderer.restore();

		pong = perf.now();
		samples.render = pong - ping;
		samples.tick = pong - pingTick;

		if (debug.step) {
			debugger;
		}
		if (debug.profileFrom) {
			if (!--debug.profile) {
				console.profileEnd("Frame " + debug.profileFrom);
				debug.profileFrom = 0;
			}
		}
	}

	this.lastTime = time;
	samples.next = Math.max(time + 1 / 60, perf.now() / 1000);

	this.pub('onTimeEnd', samples);

	if (this.pauseNext) {
		this.pub('onPause');
		this.running = false;
	}
};

var engine = new Engine();

// Debugging hooks
if ('console' in window) {
	console.m = {
		pool: function(flush) {
			Pool.dump(flush);
			return null;
		},
		profile: function(frames) {
			if (frames == null) {
				frames = 60;
			}
			engine.debug.profile = frames;
			return null;
		},
		step: function() {
			engine.debug.step = !engine.debug.step;
			return null;
		}
	};
}

var perf = window.performance || {};
perf.now = perf.now || perf.webkitNow || perf.msNow || perf.mozNow || Date.now;


module.exports = engine;
