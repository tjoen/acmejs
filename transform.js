// Generated by CoffeeScript 1.3.3
var Transform,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Transform = (function(_super) {

  __extends(Transform, _super);

  Transform.prototype.name = 'transform';

  function Transform() {
    Transform.__super__.constructor.call(this);
    this.pos = Vec2();
  }

  Transform.prototype.alloc = function(parent, pos) {
    Transform.__super__.alloc.call(this, parent);
    Vec2.copy(this.pos, pos);
    this.rotation = 0;
    return this;
  };

  return Transform;

})(Component);

new Pool(Transform);