'use strict';

/*
 * http://docs.unity3d.com/Documentation/ScriptReference/Mathf.html
 * https://github.com/secretrobotron/gladius.math/
 * https://github.com/toji/gl-matrix/tree/master/src/gl-matrix
 *
 * TODO: https://github.com/photonstorm/phaser/blob/master/Phaser/GameMath.ts
 */
var Mth = Math;

var sqrt = Mth.sqrt;
var pow = Mth.pow;
var abs = Mth.abs;
var random = Mth.random;

var EPSILON = Mth.EPSILON = 0.001;

var TAU = Mth.TAU = Mth.PI * 2;
Mth.PIRAD = 0.0174532925;
Mth.UID = 1;

Mth.uid = function() {
	return Mth.UID++;
};

Mth.clamp = function(a, low, high) {
	if (a < low) {
		return low;
	}
	if (a > high) {
		return high;
	} else {
		return a;
	}
};

Mth.rand = function(low, high, ease) {
	return (ease || Mth.linear)(random()) * (high - low) + low;
};

Mth.randArray = function(array) {
	return array[random() * array.length + 0.5 | 0];
};

Mth.chance = function(chance) {
	return random() <= chance;
};

var powIn = function(strength) {
	if (strength == null) {
		strength = 2;
	}
	return function(t) {
		return pow(t, strength);
	};
};

var toOut = function(fn) {
	return function(t) {
		return 1 - fn(1 - t);
	};
};

var toInOut = function(fn) {
	return function(t) {
		return (t < 0.5 ? fn(t * 2) : 2 - fn(2 * (1 - t))) / 2;
	};
};

Mth.linear = function(t) {
	return t;
};

var transitions = ['quad', 'cubic', 'quart', 'quint'];
for (var i = 0, l = transitions.length; i < l; i++) {
	var transition = transitions[i];
	var fn = powIn(i + 2);
	Mth[transition + 'In'] = fn;
	Mth[transition + 'Out'] = toOut(fn);
	Mth[transition + 'InOut'] = toInOut(fn);
}

Mth.distAng = function(a, b) {
	if (a == b) {
		return 0;
	}
	var ab = (a < b);
	var l = ab ? (-a - TAU + b) : (b - a);
	var r = ab ? (b - a) : (TAU - a + b);

	return (Math.abs(l) > Math.abs(r)) ? r : l;
};

/*
 * Typed Array to use for vectors and matrix
 */
var ARRAY_TYPE = Mth.ARRAY_TYPE = window.Float32Array || function(arr) {
	return arr;
};

/**
 * Vec2
 *
 * @constructor
 * Initialize from Vec2 array or x/y values. Returns a new (typed) array.
 *
 * @param {Number[]|Number} fromOrX Typed array to copy from or x
 * @param {Number} y y, when x was provided as first argument
 */
var Vec2 = Mth.Vec2 = function(fromOrX, y) {
	if (y != null) {
		return new ARRAY_TYPE([fromOrX, y]);
	}
	if (fromOrX != null) {
		return new ARRAY_TYPE(fromOrX);
	}
	return new ARRAY_TYPE(Vec2.zero);
};

Vec2.zero = Vec2.center = Vec2(0, 0);
Vec2.cache = [Vec2(), Vec2(), Vec2(), Vec2(), Vec2()];
Vec2.topLeft = Vec2(-1, -1);
Vec2.topCenter = Vec2(0, -1);
Vec2.topRight = Vec2(1, -1);
Vec2.centerLeft = Vec2(-1, 0);
Vec2.centerRight = Vec2(1, 0);
Vec2.bottomLeft = Vec2(-1, 1);
Vec2.bottomCenter = Vec2(0, 1);
Vec2.bottomRight = Vec2(1, 1);

var radCache = [Vec2(), Vec2()];
var objCache = {
	x: 0,
	y: 0
};
var objVecCache = Vec2();

Vec2.set = function(result, x, y) {
	result[0] = x || 0;
	result[1] = y || 0;
	return result;
};

Vec2.copy = function(result, b) {
	result.set(b || Vec2.zero);
	return result;
};

Vec2.valid = function(a) {
	return !(isNaN(a[0]) || isNaN(a[1]));
};

Vec2.toString = function(a) {
	return "[" + a[0] + ", " + a[1] + "]";
};

Vec2.fromObj = function(obj, a) {
	if (!a) {
		a = objVecCache;
	}
	a[0] = obj.x;
	a[1] = obj.y;
	return a;
};

Vec2.toObj = function(a, obj) {
	if (!obj) {
		obj = objCache;
	}
	obj.x = a[0];
	obj.y = a[1];
	return obj;
};

Vec2.eq = function(a, b) {
	return abs(a[0] - b[0]) < EPSILON && abs(a[1] - b[1]) < EPSILON;
};

Vec2.add = function(a, b, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] + b[0];
	result[1] = a[1] + b[1];
	return result;
};

Vec2.sub = function(a, b, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] - b[0];
	result[1] = a[1] - b[1];
	return result;
};

Vec2.mul = function(a, b, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] * b[0];
	result[1] = a[1] * b[1];
	return result;
};

Vec2.scal = function(a, scalar, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] * scalar;
	result[1] = a[1] * scalar;
	return result;
};

Vec2.norm = function(a, result, scalar) {
	if (!result) {
		result = a;
	}
	var x = a[0];
	var y = a[1];
	var len = (scalar || 1) / (sqrt(x * x + y * y) || 1);
	result[0] = x * len;
	result[1] = y * len;
	return result;
};

Vec2.lenSq = function(a) {
	return a[0] * a[0] + a[1] * a[1];
};

Vec2.len = function(a) {
	return sqrt(a[0] * a[0] + a[1] * a[1]);
};

Vec2.dot = function(a, b) {
	return a[0] * b[0] + a[1] * b[1];
};

Vec2.cross = function(a, b) {
	return a[0] * b[1] - a[1] * b[0];
};

Vec2.lerp = function(a, b, scalar, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] + scalar * (b[0] - a[0]);
	result[1] = a[1] + scalar * (b[1] - a[1]);
	return result;
};

Vec2.max = function(a, b, axis) {
	if (axis != null) {
		if (a[axis] > b[axis]) {
			return a;
		} else {
			return b;
		}
	}
	if (Vec2.lenSq(a) > Vec2.lenSq(b)) {
		return a;
	} else {
		return b;
	}
};

Vec2.perp = function(a, result) {
	if (!result) {
		result = a;
	}
	var x = a[0];
	result[0] = a[1];
	result[1] = -x;
	return result;
};

Vec2.dist = function(a, b) {
	var x = b[0] - a[0];
	var y = b[1] - a[1];
	return sqrt(x * x + y * y);
};

Vec2.distSq = function(a, b) {
	var x = b[0] - a[0];
	var y = b[1] - a[1];
	return x * x + y * y;
};

Vec2.limit = function(a, max, result) {
	if (!result) {
		result = a;
	}
	var x = a[0];
	var y = a[1];
	var ratio = max / sqrt(x * x + y * y);
	if (ratio < 1) {
		result[0] = x * ratio;
		result[1] = y * ratio;
	} else if (result !== a) {
		result[0] = x;
		result[1] = y;
	}
	return result;
};

Vec2.rad = function(a, b) {
	if (!b) {
		return Mth.atan2(a[1], a[0]);
	}
	return Mth.acos(
		Vec2.dot(Vec2.norm(a, radCache[0]), Vec2.norm(b, radCache[1]))
	);
};

Vec2.rot = function(a, theta, result) {
	if (!result) {
		result = a;
	}
	var sinA = Mth.sin(theta);
	var cosA = Mth.cos(theta);
	var x = a[0];
	var y = a[1];
	result[0] = x * cosA - y * sinA;
	result[1] = x * sinA + y * cosA;
	return result;
};

Vec2.rotAxis = function(a, b, theta, result) {
	return Vec2.add(
		Vec2.rot(
			Vec2.sub(a, b, result || a),
			theta
		),
		b
	);
};

Vec2.lookAt = function(a, b, result) {
	var len = Vec2.len(a);
	return Vec2.norm(
		Vec2.rot(
			a,
			Mth.atan2(b[0] - a[0], b[1] - a[1]) - Mth.atan2(a[1], a[0]), result || a
		),
		null, len
	);
};

Vec2.variant = function(a, delta, result) {
	if (!result) {
		result = a;
	}
	result[0] = a[0] + Math.rand(-delta, delta);
	result[1] = a[1] + Math.rand(-delta, delta);
	return result;
};

module.exports.Vec2 = Vec2;

