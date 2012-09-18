// Generated by CoffeeScript 1.3.3
var Composite;

Composite = (function() {

  Composite.prototype.name = 'composite';

  function Composite() {
    this.uid = Math.uid();
    this.children = {};
    this.components = {};
  }

  Composite.prototype.toString = function() {
    return "Composite " + this.name + "#" + this.uid;
  };

  Composite.prototype.alloc = function(parent) {
    this.parent = parent;
    this.scene = parent.scene || parent;
    this.enabled = true;
    return this;
  };

  Composite.prototype.free = function() {
    var key;
    this.enabled = this.allocd = false;
    if (this.scopes) {
      this.scopes.length = this.topics.length = this.methods.length = 0;
    }
    for (key in this.components) {
      this.components[key].free();
    }
    for (key in this.children) {
      this.children[key].free();
    }
    if (this.parent) {
      delete this.parent.children[this.uid];
    }
    this.scene = this.parent = null;
    return this;
  };

  Composite.prototype.enable = function() {
    this.pub('enable', this);
    return this.enabled = true;
  };

  Composite.prototype.disable = function() {
    this.pub('disable', this);
    return this.enabled = false;
  };

  Composite.prototype.sub = function(scope, topic, method) {
    if (!this.scopes) {
      this.topics = [];
      this.scopes = [];
      this.methods = [];
    }
    this.scopes.push(scope);
    this.topics.push(topic);
    this.methods.push(method);
    return this;
  };

  Composite.prototype.pub = function(topic, a0, a1, a2, a3, a4, a5, a6, a7) {
    var i, scope, scopes, topics, _i, _len;
    if ((scopes = this.scopes)) {
      topics = this.topics;
      for (i = _i = 0, _len = scopes.length; _i < _len; i = ++_i) {
        scope = scopes[i];
        if (scope && (!topics[i] || topics[i] === topic)) {
          scope[this.methods[i] || topic](a0, a1, a2, a3, a4, a5, a6, a7);
        }
      }
    }
    return this;
  };

  Composite.prototype.unsub = function(unscope, topic, method) {
    var i, methods, scope, scopes, topics, _i, _len;
    if ((scopes = this.scopes)) {
      topics = this.topics;
      methods = this.methods;
      for (i = _i = 0, _len = scopes.length; _i < _len; i = ++_i) {
        scope = scopes[i];
        if (scope && (!unscope || scope === unscope) && (!topic || topics[i] === topic) && (!method || methods[i] === method)) {
          topics[i] = scopes[i] = methods[i] = null;
        }
      }
    }
    return this;
  };

  return Composite;

})();