// Generated by CoffeeScript 1.3.3
var Fsm;

Fsm = (function() {

  function Fsm() {
    this.states = {};
  }

  Fsm.prototype.alloc = function(parent) {
    parent.sm = this;
    parent.pubsub.sub(this, 'free');
    this.parent = parent;
    return this;
  };

  Fsm.prototype.free = function() {
    this.allocd = false;
    this.parent.pubsub.unsub(this);
    this.parent = this.parent.sm = null;
    return this;
  };

  Fsm.prototype.start = function(type) {
    this.state = type;
    return this;
  };

  Fsm.prototype.add = function(state) {
    this.states[this.state.type] = this.state;
    return this;
  };

  Fsm.prototype.set = function(toName) {
    var to;
    to = this.states[toName];
    return this;
  };

  Fsm.prototype.get = function(type) {
    return this.state;
  };

  return Fsm;

})();

Fsm.State = (function() {

  State.prototype.from = {};

  State.prototype.children = {};

  function State(fsm, type, options) {
    var parent, state, _i, _len, _ref;
    this.fsm = fsm;
    this.type = type;
    if (options == null) {
      options = {};
    }
    this.parent = options.parent || null;
    _ref = options.from || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      state = _ref[_i];
      this.from[state] = true;
    }
    parent = this.parent;
    if (parent) {
      this.from[this.type] = parent.children[this.type] = true;
    }
  }

  return State;

})();
