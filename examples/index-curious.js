// Generated by CoffeeScript 1.3.3
var Bounds, Collider, Color, Comet, Component, Composite, Earth, Engine, GameController, Kinetic, MenuController, Particle, Pool, Renderer, Sprite, Transform, Vec2, Weapon,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vec2 = require('./lib/math').Vec2;

Engine = require('./lib/engine');

Engine.init(document.getElementById('game-1'));

Renderer = require('./lib/renderer');

Engine.renderer = new Renderer(Engine.element.getElementsByClassName('game-canvas')[0], Vec2(480, 320));

Composite = require('./lib/composite');

Component = require('./lib/component');

Pool = require('./lib/pool');

Color = require('./lib/color');

Sprite = require('./lib/sprite');

Transform = require('./lib/transform');

Bounds = require('./lib/bounds');

Kinetic = require('./lib/kinetic');

Collider = require('./lib/collider');

Particle = require('./lib/particle');

MenuController = (function(_super) {

  __extends(MenuController, _super);

  function MenuController() {
    return MenuController.__super__.constructor.apply(this, arguments);
  }

  MenuController.prototype.type = 'menuController';

  return MenuController;

})(Component);

new Pool(MenuController);

Engine.menuScene = Composite.alloc(null, {
  menuController: null
});

GameController = (function(_super) {

  __extends(GameController, _super);

  function GameController() {
    return GameController.__super__.constructor.apply(this, arguments);
  }

  GameController.prototype.type = 'gameController';

  GameController.prototype.reset = function() {
    this.baseCharge = 1;
    this.charge = 1;
    this.nextCharge = this.baseCharge;
    Earth.Prefab.alloc(this.root, {
      transform: {
        pos: Vec2(240, 160)
      }
    });
    return this;
  };

  GameController.prototype.update = function(dt) {
    var comet, pos, radius, vel;
    this.charge += dt / this.nextCharge;
    if (this.charge < 1) {
      return;
    }
    this.charge = 0;
    this.nextCharge = this.baseCharge * Math.rand(1, 1.2);
    pos = Vec2(Math.rand(-150, 0), Math.rand(-150, 0));
    radius = Math.rand(3, 7);
    comet = Comet.Prefab.alloc(this.parent, {
      transform: {
        pos: pos
      },
      bounds: {
        radius: radius
      },
      kinetic: {
        mass: radius,
        drag: 1,
        friction: 0
      }
    });
    vel = comet.kinetic.vel;
    Vec2.add(vel, Vec2(Math.rand(0.8, 1.2), Math.rand(0.9, 1.1)));
    return Vec2.scal(vel, Math.rand(30, 40));
  };

  return GameController;

})(Component);

new Pool(GameController);

Earth = (function(_super) {

  __extends(Earth, _super);

  Earth.prototype.type = 'earth';

  function Earth() {
    this.normal = Vec2();
  }

  Earth.prototype.reset = function() {
    this.gravityRadius = 200;
    this.state = this.hovered = null;
    return this;
  };

  Earth.prototype.fixedUpdate = function(dt) {
    var distSq, factor, gravityRadiusSq, kinetic, pos, pos2, _i, _len, _ref, _results;
    pos = this.transform.pos;
    gravityRadiusSq = this.gravityRadius * this.gravityRadius;
    _ref = Kinetic.pool.roster;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      kinetic = _ref[_i];
      if (!(kinetic.enabled && !kinetic.fixed && kinetic.mass)) {
        continue;
      }
      pos2 = kinetic.parent.transform.pos;
      distSq = Vec2.distSq(pos, pos2);
      if (distSq < gravityRadiusSq) {
        factor = 1 - Math.sqrt(distSq) / this.gravityRadius;
        _results.push(kinetic.applyForce(Vec2.norm(Vec2.sub(pos, pos2, Vec2.cache[0]), null, Math.quadIn(factor) * 750 / kinetic.mass)));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Earth.prototype.update = function(dt) {
    var dist, input;
    input = Engine.input;
    Vec2.sub(input.pos, this.transform.pos, this.normal);
    switch (this.state) {
      case null:
        dist = Vec2.len(this.normal);
        if (dist > this.bounds.radius) {
          if (this.hovered) {
            this.hovered = false;
          }
          break;
        }
        if (!this.hovered) {
          this.hovered = true;
        }
        if (input.touchState !== 'began') {
          break;
        }
        this.state = 'active';
        break;
      case 'active':
        this.angle = Vec2.rad(this.normal);
        if (input.touchState === 'ended') {
          Weapon.Prefab.alloc(this.root, {
            transform: {
              pos: Vec2.add(Vec2.rot(Vec2.set(Vec2.cache[0], this.bounds.radius * 1.2, 0), this.angle), this.transform.pos),
              angle: this.angle
            }
          });
          this.state = null;
        }
    }
    return this;
  };

  Earth.prototype.render = function(ctx) {
    var angle, arc, lowArc;
    if (!this.state && !this.hovered) {
      return this;
    }
    ctx.save();
    this.transform.transform(ctx);
    if (this.hovered) {
      ctx.beginPath();
      ctx.arc(0, 0, this.bounds.radius, 0, Math.TAU, true);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = Color.rgba(Color.white);
      ctx.stroke();
    }
    if (this.state === 'active') {
      arc = Math.TAU / 8 / 2;
      lowArc = Math.TAU / 45;
      angle = this.angle;
      ctx.beginPath();
      ctx.arc(0, 0, this.bounds.radius + 2, angle - lowArc, angle + lowArc);
      ctx.arc(0, 0, this.bounds.radius * 3, angle + arc, angle - arc, true);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = Color.rgba(Color.white);
      ctx.stroke();
    }
    ctx.restore();
    return this;
  };

  return Earth;

})(Component);

Earth.sprite = new Sprite.Asset('assets/globe.gif', Vec2(11, 11), 5);

new Pool(Earth);

Earth.Prefab = new Composite.Prefab({
  transform: null,
  bounds: {
    radius: 25
  },
  collider: {
    trigger: true
  },
  spriteTween: {
    asset: Earth.sprite
  },
  earth: null
});

Comet = (function(_super) {

  __extends(Comet, _super);

  Comet.prototype.type = 'comet';

  function Comet() {
    this.normal = Vec2();
    this.lifetime = 10;
  }

  Comet.prototype.reset = function(presets) {
    var center;
    this.kinetic.maxVel = 100;
    this.age = 0;
    this.target = Earth.pool.roster[0].transform;
    this.color = Color(156, 156, 156);
    center = this.bounds.radius | 0;
    return this;
  };

  Comet.prototype.update = function(dt) {
    var i, particle, pointer, pos;
    if ((this.bounds.radius -= dt / 2) < 2 || (this.age += dt) > this.lifetime) {
      this.explode();
      return;
    }
    this.kinetic.mass = this.bounds.radius;
    if (this.bounds.culled) {
      return;
    }
    pos = Vec2.cache[0];
    i = this.bounds.radius * dt * 25 | 0;
    while (i--) {
      Vec2.set(pos, Math.rand(-1, 1), Math.rand(-1, 1));
      Vec2.norm(pos, null, Math.rand(0, 1, Math.quadOut) * this.bounds.radius);
      pointer = Vec2.copy(Vec2.cache[1], pos);
      Vec2.add(Vec2.norm(pos, null, this.bounds.radius), this.transform.pos);
      particle = Composite.alloc(this.root, {
        transform: {
          pos: pos
        },
        kinetic: {
          vel: Vec2.scal(pointer, Math.rand(-0.5, -4))
        },
        particle: {
          radius: Math.rand(2.5, 5),
          lifetime: Math.rand(0.02, 0.1),
          sprite: Comet.particleTrail
        }
      });
    }
    return this;
  };

  Comet.prototype.render = function(ctx) {
    if (Engine.renderer.cull(this)) {
      return this;
    }
    ctx.beginPath();
    ctx.arc(this.transform.pos[0], this.transform.pos[1], this.bounds.radius, 0, Math.TAU);
    ctx.closePath();
    ctx.fillStyle = Color.rgba(this.color);
    ctx.fill();
    return this;
  };

  Comet.prototype.onTrigger = function(parent2, p, diff) {
    if (parent2.earth) {
      this.explode();
    }
    return this;
  };

  Comet.prototype.explode = function() {
    var i, particle, pointer, pos, radius;
    if (this.bounds.culled) {
      this.parent.free();
      return;
    }
    i = this.bounds.radius * 4 | 0;
    while (i--) {
      pos = Vec2.set(Vec2.cache[0], Math.rand(-1, 1), Math.rand(-1, 1));
      Vec2.norm(pos, null, Math.rand(0, 1, Math.quadOut) * this.bounds.radius);
      pointer = Vec2.copy(Vec2.cache[1], pos);
      Vec2.add(Vec2.norm(pos, null, this.bounds.radius), this.transform.pos);
      radius = Math.rand(2, 10);
      particle = Particle.Prefab.alloc(this.root, {
        transform: {
          pos: pos
        },
        kinetic: {
          vel: Vec2.scal(pointer, Math.rand(1, 5))
        },
        particle: {
          radius: radius,
          lifetime: Math.rand(0.01, 0.04),
          sprite: Comet.particleTrail
        }
      });
    }
    this.parent.free();
    return this;
  };

  return Comet;

})(Component);

Comet.particleTrail = Particle.generateSprite(Color(192, 192, 192), 0.2);

Comet.particleFire1 = Particle.generateSprite(Color(252, 238, 51), 0.9);

Comet.particleFire2 = Particle.generateSprite(Color(243, 18, 14), 0.9);

new Pool(Comet);

Comet.Prefab = new Composite.Prefab({
  transform: null,
  collider: {
    trigger: true
  },
  kinetic: null,
  comet: null
});

Weapon = (function(_super) {

  __extends(Weapon, _super);

  Weapon.prototype.type = 'weapon';

  function Weapon() {
    this.normal = Vec2();
    this.lockedNorm = Vec2();
  }

  Weapon.prototype.reset = function(presets) {
    this.state = null;
    this.arc = Math.TAU / 8;
    this.targets = Comet;
    this.range = 100;
    this.orbit = this.bounds.radius * 1.2;
    this.colorAmmo = Color(255, 0, 0);
    return this;
  };

  Weapon.prototype.update = function(dt) {
    var input, normal, particle, pos, rad, rangeSq;
    input = Engine.input;
    normal = Vec2.cache[0];
    pos = this.transform.pos;
    if (this.transform.angle !== this.angle) {
      Vec2.rot(Vec2.set(pos, this.orbit, 0), this.angle);
      Vec2.copy(this.normal, pos);
      Vec2.add(pos, this.parent.transform.pos);
      this.transform.angle = this.angle;
    }
    rangeSq = this.range * this.range;
    switch (this.state) {
      case null:
        if (Vec2.distSq(input.pos, pos) < this.rangeSq) {
          rad = Vec2.rad(Vec2.sub(input.pos, pos, normal), this.normal);
          if (rad < this.arc / 2) {
            console.log('locked');
            this.locked = input.pos;
            this.state = 'locked';
            debugger;
          }
        }
        break;
      case 'locked':
        Vec2.sub(input.pos, pos, this.lockedNorm);
        this.lockedRad = Vec2.rad(this.lockedNorm, this.normal);
        if (Vec2.lenSq(this.lockedNorm) > this.rangeSq || this.lockedRad > this.arc / 2) {
          this.state = this.locked = null;
        }
        particle = Composite.alloc(this.root, {
          transform: {
            pos: pos
          },
          particle: {
            radius: 1
          },
          kinetic: {
            vel: this.lockedNorm
          }
        });
        break;
    }
    return this;
  };

  Weapon.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.transform.pos[0], this.transform.pos[1]);
    ctx.rotate(this.transform.angle);
    ctx.fillStyle = Color.rgba(Color.white);
    ctx.fillRect(-2.5, -2.5, 5, 5);
    ctx.restore();
    switch (this.state) {
      case 'locked':
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.locked[0], this.locked[1], 3, 0, Math.TAU, true);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = Color.rgba(this.colorAmmo);
        ctx.stroke();
        ctx.restore();
        break;
    }
    return this;
  };

  Weapon.prototype.intercept = function(target, targetVel) {
    var a, b, c, d, interception, pos, tmp, vel;
    pos = this.transform.pos;
    vel = this.transform.maxVel;
    tmp = Vec2.sub(target, pos, Vec2.cache[0]);
    a = vel * vel - Vec2.dot(targetVel, targetVel);
    b = -2 * Vec2.dot(targetVel, tmp);
    c = -Vec2.dot(tmp, tmp);
    d = (b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    interception = Vec2.mul(Vec2.add(Vec2.set(tmp, d, d), target), targetVel);
    return Vec2.scal(Vec2.sub(interception, pos, Vec2()), vel / Math.sqrt(Vec2.dot(dist, dist)));
  };

  return Weapon;

})(Component);

new Pool(Weapon);

Weapon.Prefab = new Composite.Prefab({
  transform: null,
  bounds: {
    shape: 'circle'
  },
  weapon: null
});

Engine.gameScene = Composite.alloc(null, {
  gameController: null
});

Engine.play(Engine.gameScene);
