// Generated by CoffeeScript 1.3.3
var Component, Pool, Transform, Vec2,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Component = require('./component');

Pool = require('./pool');

Vec2 = require('./math').Vec2;

Transform = (function(_super) {

  __extends(Transform, _super);

  Transform.prototype.type = 'transform';

  Transform.prototype.presets = {
    pos: Vec2()
  };

  function Transform() {
    this.pos = Vec2();
  }

  Transform.prototype.reset = function(presets) {
    Vec2.copy(this.pos, presets.pos);
    return this;
  };

  Transform.prototype.toWorld = function() {
    this.worldPos.copy(this.pos);
    this.worldAngle = this.angle;
    return this;
  };

  Transform.prototype.transform = function(ctx) {
    ctx.translate(this.pos[0] | 0, this.pos[1] | 0);
    return this;
  };

  return Transform;

})(Component);

new Pool(Transform);

module.exports = Transform;
