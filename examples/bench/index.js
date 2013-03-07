// Generated by CoffeeScript 1.6.1
'use strict';
var Border, Collider, Color, Component, Composite, Engine, GameController, Kinetic, Particle, Pool, Renderer, SparkPrefab, Transform, Vec2, smokeSprite,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vec2 = require('../../lib/core/math').Vec2;

Engine = require('../../lib/core/engine');

Engine.init(document.getElementById('game-1'));

Renderer = require('../../lib/core/renderer');

Engine.renderer = new Renderer(Engine.element.getElementsByClassName('game-canvas')[0], Vec2(960, 640));

Composite = require('../../lib/core/composite');

Component = require('../../lib/core/component');

Pool = require('../../lib/core/pool');

Color = require('../../lib/core/color');

Transform = require('../../lib/core/transform');

Border = require('../../lib/core/border');

Collider = require('../../lib/core/collider');

Kinetic = require('../../lib/core/kinetic');

Particle = require('../../lib/core/particle');

require('../../lib/core/jitter');

require('../../lib/core/wander');

require('../../lib/core/boid');

GameController = (function(_super) {

  __extends(GameController, _super);

  function GameController() {
    return GameController.__super__.constructor.apply(this, arguments);
  }

  GameController.prototype.type = 'gameController';

  GameController.prototype.reset = function() {
    return this;
  };

  GameController.prototype.update = function(dt) {
    var i, input, spark, speed;
    input = Engine.input;
    if (input.touchState || input.keys.space) {
      i = 150 * dt | 0;
      speed = 100;
      while (i--) {
        spark = SparkPrefab.alloc(this.root);
        Vec2.set(spark.kinetic.vel, Math.rand(-speed, speed), Math.rand(-speed, speed));
        Vec2.variant(input.pos, 25, spark.transform.pos);
        spark.particle.radius = Math.rand(5, 25);
      }
      this;
    }
    return this;
  };

  return GameController;

})(Component);

new Pool(GameController);

smokeSprite = Particle.generateSprite(Color(128, 128, 128), 1);

SparkPrefab = new Composite.Prefab({
  transform: null,
  kinetic: {
    mass: 0.1,
    fast: true,
    maxVel: 100,
    maxAcc: 0
  },
  particle: {
    lifetime: 10,
    composite: 'lighter',
    fade: null,
    sprite: smokeSprite
  },
  jitter: null
});

Engine.gameScene = Composite.alloc(null, {
  gameController: null
});

Engine.play(Engine.gameScene);