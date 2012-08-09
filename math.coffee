
Vec2 = (fromOrX, y) ->

	if typeof y isnt 'undefined'
		return [fromOrX, y]

	if typeof fromOrX isnt 'undefined'
		return [fromOrX[0], fromOrX[1]]

	return [0, 0]

# if 'Float32Array' of window
#	Vec2Wrappped = Vec2
#	Vec2 = (fromOrX, y) ->
#		return new Float32Array(Vec2Wrappped(fromOrX, y))

Vec2.cache = [Vec2(), Vec2(), Vec2(), Vec2(), Vec2()]
Vec2.radCache = [Vec2(), Vec2()]

e = 0.00001

sqrt = Math.sqrt

Vec2.set = (result, x, y) ->
	result[0] = x or 0
	result[1] = y or 0
	return result

Vec2.copy = (result, b) ->
	result[0] = b[0]
	result[1] = b[1]
	return result

Vec2.eq = (a, b) ->
	d1 = Math.abs(a[0] - b[0])
	d2 = Math.abs(a[1] - b[1])
	return d1 < e and d2 < e

Vec2.add = (a, b, result) ->
	result = result or a

	result[0] = a[0] + b[0]
	result[1] = a[1] + b[1]
	return result

Vec2.sub = (a, b, result) ->
	result = result or a

	result[0] = a[0] - b[0]
	result[1] = a[1] - b[1]
	return result

Vec2.mul = (a, b, result) ->
	result = result or a

	result[0] = a[0] * b[0]
	result[1] = a[1] * b[1]
	return result

Vec2.scal = (a, scalar, result) ->
	result = result or a

	result[0] = a[0] * scalar
	result[1] = a[1] * scalar
	return result

Vec2.inv = (a, result) ->
	result = result or a

	result[0] = -a[0]
	result[1] = -a[1]
	return result

Vec2.norm = (a, result) ->
	result = result or a

	x = a[0]
	y = a[1]
	len = 1 / sqrt(x * x + y * y)

	result[0] = x * len
	result[1] = y * len
	return result

Vec2.lenSq = (a) ->
	return a[0] * a[0] + a[1] * a[1]

Vec2.len = (a) ->
	return sqrt(a[0] * a[0] + a[1] * a[1])

Vec2.dot = (a, b) ->
	return a[0] * b[0] + a[1] * b[1]

Vec2.cross = (a, b) ->
	return a[0] * b[1] - a[1] * b[0]

Vec2.dist = (a, b) ->
	x = b[0] - a[0]
	y = b[1] - a[1]
	return sqrt(x * x + y * y)

Vec2.distSq = (a, b) ->
	x = b[0] - a[0]
	y = b[1] - a[1]
	return x * x + y * y

Vec2.rad = (a, b) ->
	if not b
		return Math.atan2(a[0], a[1])

	return Math.acos(Vec2.dot(
		Vec2.norm(a, Vec2.radCache[0]),
		Vec2.norm(b, Vec2.radCache[1])
	))

Vec2.rot = (a, rad, result) ->
	result = result or a

	sinA = Math.sin(rad)
	cosA = Math.cos(rad)
	x = a[0]
	y = a[1]

	result[0] = x * cosA - y * sinA
	result[1] = x * sinA + y * cosA
	return result

Vec2.limit = (a, max, result) ->
	result = result or a

	x = a[0]
	y = a[1]
	len = sqrt(x * x + y * y)

	if length > max
		ratio = max / length
		result[0] = x * ratio
		result[1] = y * ratio
	else if result isnt a
		result[0] = x
		result[1] = y

	return result

# Math

Math.TAU = Math.PI * 2
Math.PIRAD = 0.0174532925

Math.clamp = (a, low, high) ->
	if a < low
		return low
	return if a > high then high else a

random = Math.random

Math.randomFloat = (low, high) ->
	return low + random() * (high - low + 1)

Math.randomBool = (chance) ->
	return random() <= chance

# Tweens

pow = Math.pow

powIn = (strength = 2) ->
	# (t) -> return pow(1, strength - 1) * pow(t, strength)
	(t) -> return pow(t, strength)

powOut = (strength) ->
	fn = powIn(strength)
	(t) -> return 1 - fn(1 - t)

powInOut = (strength) ->
	fn = powIn(strength)
	(t) ->
		return (if t < 0.5 then fn(t * 2) else (2 - fn(2 * (1 - t)))) / 2


for transition, i in ['quad', 'cubic', 'quart', 'quint']
	Math[transition + 'In'] = powIn(i + 2)
	Math[transition + 'Out'] = powOut(i + 2)
	Math[transition + 'InOut'] = powInOut(i + 2)

Math.linear = ->
	return t