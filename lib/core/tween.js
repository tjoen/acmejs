// Generated by CoffeeScript 1.6.1
var Component, Mat2, Pool, Tween, Vec2, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

Pool = require('./pool');

_ref = require('./math'), Vec2 = _ref.Vec2, Mat2 = _ref.Mat2;

Tween = (function(_super) {

  __extends(Tween, _super);

  Tween.prototype.tag = 'tween';

  Tween.prototype.attributes = {
    pos: Vec2(),
    angle: 0,
    alpha: 1
  };

  function Tween() {
    this.animation = [];
  }

  Tween.prototype.instantiate = function(attributes) {
    this.angle = attributes.angle, this.alpha = attributes.alpha;
    Vec2.copy(this.pos, attributes.pos);
    return this;
  };

  Tween.prototype.setTween = function(pos, angle, silent) {
    if (pos != null) {
      Vec2.copy(this.pos, pos);
    }
    if (angle != null) {
      this.angle = angle;
    }
    this.dirty = true;
    if (!silent) {
      this.entity.pub('onTween', this.pos, this.angle);
    }
    return this;
  };

  Tween.prototype.applyMatrix = function(ctx) {
    if (Vec2.lenSq(this.pos)) {
      ctx.translate(this.pos[0] | 0, this.pos[1] | 0);
    }
    if (this.angle) {
      ctx.rotate(this.angle);
    }
    return this;
  };

  return Tween;

})(Component);

new Pool(Tween);

module.exports = Tween;