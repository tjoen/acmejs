// Generated by CoffeeScript 1.3.3
var Pool, fn, _i, _len, _ref;

require('./math');

Pool = (function() {

  Pool.typedHooks = ['fixedUpdate', 'simulate', 'update', 'lateUpdate', 'render'];

  Pool.hookRegx = /^on[A-Z]/;

  Pool.hooks = {};

  Pool.types = {};

  Pool.defaults = {};

  Pool.order = {
    render: false
  };

  Pool.prototype.toString = function() {
    return "Pool {@type} [" + this.roster.length + "]";
  };

  function Pool(cls) {
    var fn, keys, proto, types, _i, _j, _len, _len1,
      _this = this;
    this.cls = cls;
    proto = cls.prototype;
    this.type = proto.type;
    this.isComponent = this.type && this.type !== 'composite';
    this.light = (!this.isComponent) || proto.light || false;
    if (this.type) {
      Pool.types[this.type] = this;
    }
    proto.pool = this;
    cls.pool = this;
    this.roster = [];
    this.subs = [];
    this.hooks = [];
    this.enabled = false;
    this.allocd = 0;
    this.layer = proto.layer || cls.layer || 0;
    if (this.isComponent && !this.light) {
      types = Pool.typedHooks;
      keys = Object.keys(proto).concat(Object.keys(cls));
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        fn = keys[_i];
        if (Pool.hookRegx.test(fn)) {
          if (!~types.indexOf(fn)) {
            types.push(fn);
            Pool.hooks[fn] = [];
          }
          this.subs.push(fn);
        }
      }
      for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
        fn = types[_j];
        if (fn in cls) {
          this[fn] = cls[fn];
          Pool.hooks[fn].push(this);
        } else if (fn in proto) {
          this.hooks.push(fn);
        }
      }
    }
    cls.alloc = function(parent, presets) {
      return _this.alloc(parent, presets);
    };
  }

  Pool.prototype.preinstantiate = function(i) {
    while (i--) {
      this.instantiate();
    }
    return this;
  };

  Pool.prototype.instantiate = function() {
    var cls, hook, _i, _len, _ref;
    cls = new this.cls();
    this.roster.push(cls);
    _ref = this.hooks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hook = _ref[_i];
      Pool.hooks[hook].push(cls);
    }
    return cls;
  };

  Pool.prototype.alloc = function(parent, presets) {
    var defaults, entity, hook, i, roster, topic, uid, _i, _j, _len, _len1, _ref, _ref1;
    roster = this.roster;
    i = roster.length;
    while (i--) {
      if (!roster[i].allocd) {
        entity = roster[i];
        break;
      }
    }
    if (!entity) {
      entity = this.instantiate();
    }
    this.allocd++;
    this.enabled = true;
    _ref = this.hooks;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hook = _ref[_i];
      if (hook in Pool.order) {
        Pool.order[hook] = true;
      }
    }
    entity.uid = uid = Math.uid();
    entity.enabled = true;
    entity.allocd = true;
    entity.parent = parent || null;
    entity.root = parent && parent.root || parent || entity;
    entity.layer = (parent && parent.layer || 0) + this.layer + 2 - 1 / uid;
    if (entity.root.descendants) {
      entity.root.descendants[uid] = entity;
    } else {
      entity.descendants = {};
    }
    if (this.isComponent) {
      if (defaults = entity.presets) {
        if (presets && !presets._merged) {
          presets.__proto__ = defaults;
          presets._merged = true;
        }
      }
      _ref1 = this.subs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        topic = _ref1[_j];
        parent.sub(entity, topic);
      }
    }
    entity.alloc(presets || defaults || null);
    return entity;
  };

  Pool.prototype.free = function(entity) {
    if (entity.root === entity) {
      entity.descendants = null;
    } else if (entity.root.descendants) {
      delete entity.root.descendants[entity.uid];
    }
    entity.enabled = false;
    entity.allocd = false;
    entity.uid = null;
    entity.root = null;
    entity.parent = null;
    this.enabled = this.allocd-- > 1;
    return this;
  };

  return Pool;

})();

_ref = Pool.typedHooks;
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  fn = _ref[_i];
  Pool.hooks[fn] = [];
}

Pool.dump = function(free) {
  var pool, type, _ref1;
  _ref1 = Pool.types;
  for (type in _ref1) {
    pool = _ref1[type];
    console.log("%s: %d/%d allocd", type, pool.allocd, pool.roster.length);
  }
  if (free) {
    Pool.free();
  }
  return null;
};

if ('console' in window) {
  console.pool = Pool.dump;
}

Pool.free = function() {
  var freed, i, pool, roster, type, _ref1;
  _ref1 = Pool.types;
  for (type in _ref1) {
    pool = _ref1[type];
    roster = pool.roster;
    i = roster.length;
    freed = 0;
    while (i--) {
      if (!(!roster[i].allocd)) {
        continue;
      }
      roster.splice(i, 1);
      freed++;
    }
    console.log("%s: %d/%d freed", type, freed, pool.roster.length);
  }
  return this;
};

Pool.invoke = function(fn, a0, a1, a2, a3) {
  var i, stack;
  if ((stack = this.hooks[fn]) && (i = stack.length)) {
    if (fn in Pool.order && Pool.order[fn]) {
      stack.sort(Pool.orderFn);
      Pool.order[fn] = false;
    }
    while (i--) {
      if (stack[i].enabled) {
        stack[i][fn](a0, a1, a2, a3);
      }
    }
  }
  return this;
};

Pool.orderFn = function(a, b) {
  return b.layer - a.layer;
};

module.exports = Pool;
