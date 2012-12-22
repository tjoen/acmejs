Composite = require('./composite')
Pool = require('./pool')
{Vec2} = require('./math')
Color = require('./color')
Engine = require('./engine')
Particle = require('./particle')
Kinetic = require('./kinetic')
Border = require('./border')
Boid = require('./boid')

class Catapult extends Composite

	type: 'catapult'

	presets:
		pos: Vec2()
		color: Color.white

	constructor: ->
		@pos = Vec2()
		@color = Color()
		@start = Vec2()
		@end = Vec2()
		@acc = Vec2()
		@accNorm = Vec2()

	reset: (presets) ->
		Vec2.copy(@pos, presets.pos)
		Color.copy(@color, presets.color)

		@state = null
		@radius = 90
		@listenRadius = @radius * 0.15
		@fireRadius = @radius * 0.1
		@listenRadiusSq = @listenRadius * @listenRadius
		Vec2.set(@acc)
		@

	update: (dt) ->
		if @state is 'fired'
			acc = Vec2.scal(@accNorm, -Kinetic.maxAcc, Vec2.cache[0])
			rand = Vec2.cache[1]
			perAcc = Vec2.cache[2]
			perPos = Vec2.cache[3]

			randAcc = Kinetic.maxAcc * 0.2

			for i in [0..Math.rand(50, 75)] by 1
				Vec2.add(
					acc,
					Vec2.set(
						rand,
						Math.rand(-randAcc, randAcc),
						Math.rand(-randAcc, randAcc)
					),
					perAcc
				)

				Vec2.add(
					@pos,
					Vec2.set(
						rand,
						Math.rand(-5, 5),
						Math.rand(-5, 5)
					),
					perPos
				)

				particle = Particle.alloc(
					@root,
					perPos,
					perAcc,
					Math.rand(15, 25, Math.cubicOut),
					Math.rand(1, 15, Math.quadIn)
				)
				Boid.alloc(particle)
				# Collider.alloc(particle)
				border = Border.alloc(particle)
				# border.kill = true

		# Poll input
		input = Engine.input

		switch @state
			when null
				if input.touchState is 'began' and Vec2.distSq(input.pos, @pos) <= @listenRadiusSq
					@state = 'active'
					Vec2.copy(@start, input.pos)
					Vec2.set(@acc)
					Vec2.set(@accNorm)
				break
			when 'active'
				switch input.touchState
					when 'moved'
						end = Vec2.copy(Vec2.cache[0], input.pos)
						Vec2.limit(
							Vec2.sub(end, @start, @acc),
							@radius
						)
						if Vec2.len(@acc) < @fireRadius
							Vec2.set(@acc)
						Vec2.scal(@acc, 1 / @radius, @accNorm)
						@
					when 'ended'
						if Vec2.dist(@start, input.pos) < @fireRadius
							@state = null
						else
							@state = 'fired'
				break
			when 'fired'
				@state = null
				break
		@


	render: (ctx) ->
		active = @state is 'active'
		pos = @pos

		@color[3] = if active then 1 else 0.3
		ctx.strokeStyle = Color.rgba(@color)

		ctx.beginPath()
		ctx.arc(pos[0] | 0, pos[1] | 0, @listenRadius, 0, Math.TAU, true)
		ctx.closePath()
		ctx.stroke()

		if active

			target = Vec2.add(pos, @acc, Vec2.cache[0])

			ctx.lineWidth = 1
			@color[3] = 0.5
			ctx.strokeStyle = Color.rgba(@color)
			@color[3] = 0.2
			ctx.fillStyle = Color.rgba(@color)

			ctx.beginPath()
			ctx.arc(target[0] | 0, target[1] | 0, @fireRadius, 0, Math.TAU, true)
			ctx.closePath()
			ctx.stroke()
			ctx.fill()
		@

new Pool(Catapult)

module.exports = Catapult