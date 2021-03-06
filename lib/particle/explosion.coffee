Component = require('./component')
Pool = require('./pool')
{Vec2} = require('./math')
Color = require('./color')
Kinetic = require('./kinetic')
Particle = require('./particle')
Engine = require('./engine')

class Explosion extends Component

	tag: 'explosion'

	attributes:
		lifetime: 0.4
		maxSize: 100
		color: Color.white

	constructor: ->
		@color = Color()

	instantiate: (attributes) ->
		Color.copy(@color, attributes.color)
		@lifetime = attributes.lifetime
		@maxSize = attributes.maxSize

		@pos = @transform.pos
		@age = 0
		@state = 'began'
		@

	update: (dt, scene) ->
		if @state is 'began'
			max = Kinetic.maxForce

			radius = @maxSize
			radiusSq = @maxSize * @maxSize
			for kinetic in Kinetic.pool.register when kinetic.mass and (dist = Vec2.distSq(@pos, kinetic.pos)) < radiusSq
				factor = Math.quadOut(1 - Math.sqrt(dist) / radius)
				Vec2.add(
					kinetic.force,
					Vec2.scal(
						Vec2.norm(
							Vec2.sub(kinetic.pos, @pos, Vec2.cache[0])
						),
						max * factor
					)
				)

			impulse = Vec2.cache[0]
			for i in [0..100] by 1
				Vec2.norm(
					Vec2.set(impulse, Math.rand(-1, 1), Math.rand(-1, 1)),
					null,
					Math.rand(0, max)
				)
				particle = Particle.alloc(@root, @pos, impulse, Math.rand(@lifetime / 2, @lifetime * 2), Math.rand(1, 4), 0)
				# Jitter.alloc(particle, 0.1, 1000)
			@state = 'exploding'

		age = (@age += dt)

		if age >= @lifetime
			@entity.destroy()
		else
			@factor = Math.quadOut(age / @lifetime)
			@size = @factor * @maxSize
		@


	render: (ctx) ->
		ctx.save()
		ctx.globalCompositeOperation = 'lighter'
		pos = @pos

		circles = 10
		for i in [1..circles] by 1
			factor = Math.quadOut(i / circles)
			ctx.beginPath()
			ctx.arc(pos[0] | 0, pos[1] | 0, @size * factor | 0, 0, Math.TAU, true)
			ctx.closePath()

			@color[3] = factor * (1 - @factor)
			ctx.lineWidth = 10 * factor
			ctx.strokeStyle = Color.rgba(@color)
			ctx.stroke()

		ctx.restore()
		@

new Pool(Explosion)

module.exports = Explosion
