// Generated by CoffeeScript 1.3.3
var Earth, MAX_SPEED, Scene, Sky, current, dir, origin, pos,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MAX_SPEED = 150;

origin = Vec2();

current = Vec2();

pos = Vec2();

dir = Vec2();

Scene = (function(_super) {

  __extends(Scene, _super);

  Scene.prototype.name = 'scene';

  function Scene() {
    Scene.__super__.constructor.call(this);
    this.gravity = null;
    this.friction = 0;
    this.drag = 1;
    this.catapult = Catapult.alloc(this, Vec2(100, 540));
    Sky.alloc(this);
    Earth.alloc(this, Vec2(840, 520));
  }

  return Scene;

})(Composite);

Earth = (function(_super) {

  __extends(Earth, _super);

  Earth.prototype.name = 'earth';

  function Earth() {
    Earth.__super__.constructor.call(this);
    this.pos = Vec2();
    this.radius = 50;
    this.pos = Vec2();
    this.vel = Vec2();
    this.acc = Vec2();
  }

  Earth.prototype.alloc = function(parent, pos) {
    Earth.__super__.alloc.call(this, parent);
    return Vec2.copy(this.pos, pos);
  };

  Earth.prototype.render = function(ctx) {
    return Earth.sprite.draw(ctx, this.pos);
  };

  return Earth;

})(Composite);

Earth.sprite = new Sprite('assets/earth.png');

new Pool(Earth);

Sky = (function(_super) {

  __extends(Sky, _super);

  Sky.prototype.name = 'sky';

  function Sky() {
    Sky.__super__.constructor.call(this);
    this.stars = [];
  }

  Sky.prototype.alloc = function(parent, pos) {
    var i, size, _i, _results;
    Sky.__super__.alloc.call(this, parent);
    size = Engine.renderer.client;
    _results = [];
    for (i = _i = 0; _i <= 100; i = ++_i) {
      _results.push(this.stars.push(Vec2(Math.randomFloat(-size[0] / 2, size[0] * 1.5), Math.randomFloat(-size[1] / 2, size[1] * 1.5)), Math.randomFloat(1, 10) | 0, Math.randomFloat(1, 4) | 0));
    }
    return _results;
  };

  Sky.prototype.update = function(dt, scene) {
    var input;
    input = Engine.input;
    pos = input.pos;
    if (input.keyState === 'began' && input.key === 'space') {
      pos = input.pos;
      Explosion.alloc(this, pos);
    }
    if (input.touchState === 'began' && scene.catapult.state !== 'active') {
      Meteor.alloc(this, pos);
    }
    return this;
  };

  Sky.prototype.render = function(ctx, scene) {
    var crop, cropOffset, i, input, layer, offset, radius, _i, _ref;
    if (!Particle.sprite) {
      return;
    }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    crop = Vec2.set(Vec2.cache[0], 50, 50);
    cropOffset = Vec2.set(Vec2.cache[1], -25, -25);
    input = Engine.input.current;
    for (i = _i = 0, _ref = this.stars.length - 1; _i <= _ref; i = _i += 3) {
      pos = this.stars[i];
      layer = this.stars[i + 1];
      radius = this.stars[i + 2];
      pos = Vec2.add(pos, cropOffset, Vec2.cache[2]);
      offset = Vec2.set(Vec2.cache[3], 0, 50 * (radius - 1));
      ctx.globalAlpha = 1 / layer;
      Particle.sprite.draw(ctx, pos, crop, offset);
    }
    ctx.restore();
    return this;
  };

  return Sky;

})(Composite);

new Pool(Sky);
