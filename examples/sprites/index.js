// Generated by CoffeeScript 1.3.3
'use strict';

var AgentPrefab, Border, Collider, Component, Composite, Engine, Explosion, GameController, Kinetic, Pool, Renderer, Sprite, Transform, Vec2, agentSheet, explisionSheet,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vec2 = require('../../lib/core/math').Vec2;

Engine = require('../../lib/core/engine');

Engine.init(document.getElementById('game-1'));

Renderer = require('../../lib/core/renderer');

Engine.renderer = new Renderer(Engine.element.getElementsByClassName('game-canvas')[0], Vec2(480, 320));

Composite = require('../../lib/core/composite');

Component = require('../../lib/core/component');

Pool = require('../../lib/core/pool');

Sprite = require('../../lib/core/sprite');

Transform = require('../../lib/core/transform');

Border = require('../../lib/core/border');

Collider = require('../../lib/core/collider');

Kinetic = require('../../lib/core/kinetic');

GameController = (function(_super) {

  __extends(GameController, _super);

  function GameController() {
    return GameController.__super__.constructor.apply(this, arguments);
  }

  GameController.prototype.type = 'gameController';

  GameController.prototype.reset = function() {
    AgentPrefab.alloc(this.root, {
      transform: {
        pos: Vec2(240, 200)
      }
    });
    return this;
  };

  GameController.prototype.update = function() {
    var input;
    input = Engine.input;
    if (input.keys.space) {
      Explosion.Prefab.alloc(this.root, {
        transform: {
          pos: input.pos
        },
        spriteTween: {
          offset: Math.rand(0, 1)
        }
      });
      return this;
    }
  };

  GameController.prototype.spawnExplosion = function() {
    Explosion.Prefab.alloc(this.root, {
      transform: {
        pos: Vec2(Math.rand(25, 450), Math.rand(25, 295))
      },
      spriteTween: {
        offset: Math.rand(0, 1)
      }
    });
    return this;
  };

  return GameController;

})(Component);

new Pool(GameController);

explisionSheet = new Sprite.Sheet({
  sprites: new Sprite.Asset('../shared/mini-explosion.png'),
  size: Vec2(20, 20),
  speed: 0.05
});

Explosion = (function(_super) {

  __extends(Explosion, _super);

  function Explosion() {
    return Explosion.__super__.constructor.apply(this, arguments);
  }

  Explosion.prototype.type = 'explosion';

  Explosion.prototype.onSequenceEnd = function() {
    return this.parent.free();
  };

  return Explosion;

})(Component);

new Pool(Explosion);

Explosion.Prefab = new Composite.Prefab({
  transform: null,
  spriteTween: {
    asset: explisionSheet
  },
  bounds: {
    shape: 'circle',
    radius: 15
  },
  explosion: null
});

agentSheet = new Sprite.Sheet({
  sprites: [new Sprite.Asset('../shared/char_walk.png'), new Sprite.Asset('../shared/char_shoot.png'), new Sprite.Asset('../shared/char_hurt.png')],
  size: Vec2(64, 64),
  speed: 0.09,
  sequences: {
    walkN: [1, 8, 'walkW', null],
    walkW: [10, 17, 'walkS', null],
    walkS: [19, 26, 'walkE', null],
    walkE: [28, 35, 'shootW', null],
    shootW: [36, 37, 'shootS', 0.3],
    shootS: [39, 40, 'shootN', 0.3],
    shootN: [42, 43, 'hurt', 0.3],
    hurt: [45, 50, null, 0.15]
  }
});

AgentPrefab = new Composite.Prefab({
  transform: null,
  spriteTween: {
    asset: agentSheet,
    sequence: 'walkN'
  }
});

Engine.gameScene = Composite.alloc(null, {
  gameController: null
});

Engine.debug.fps = true;

Engine.play(Engine.gameScene);
