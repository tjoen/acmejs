'use strict';

var Component = require('./component');
var Pool = require('./pool');
var Vec2 = require('./math').Vec2;
var Engine = require('./engine');

/**
 * Collider
 *
 * Circle only
 *
 * http://jsperf.com/circular-collision-detection/2
 * https://sites.google.com/site/t3hprogrammer/research/circle-circle-collision-tutorial#TOC-Dynamic-Circle-Circle-Collision
 * http://gamedev.tutsplus.com/tutorials/implementation/when-worlds-collide-simulating-circle-circle-collisions/
 *
 * @extends Component
 */
function Collider() {}

Collider.prototype = {

  attributes: {
    trigger: false,
    include: null,
    exclude: null
  },

  create: function(attributes) {
    this.trigger = attributes.trigger;
    this.include = attributes.include;
    this.exclude = attributes.exclude;
  }

};

Collider.simulate = function(dt) {
  var colliders = this.register;
  var i = colliders.length;
  while (i--) {
    var collider1 = colliders[i];
    if (!collider1.enabled) {
      continue;
    }
    var j = i;
    while (j-- && collider1.enabled) {
      var collider2 = colliders[j];
      var kinetic1 = collider1.kinetic;
      var kinetic2 = collider2.kinetic;
      var entity1 = collider1.entity;
      var entity2 = collider2.entity;

      if (!collider2.enabled || (kinetic1.sleeping && kinetic2.sleeping) || (collider1.include && !collider2[collider1.include]) || (collider2.include && !collider1[collider2.include]) || (collider1.exclude && collider2[collider1.exclude]) || (collider2.exclude && collider1[collider2.exclude])) {
        continue;
      }

      var radius1 = entity1.bounds.radius;
      var radius2 = entity2.bounds.radius;
      var pos1 = entity1.transform.pos;
      var pos2 = entity2.transform.pos;
      var radiusSum = radius1 + radius2;

      var diffSq = Vec2.distSq(pos1, pos2);
      if (diffSq > radiusSum * radiusSum) {
        continue;
      }

      var p = Vec2.norm(Vec2.sub(pos1, pos2, Vec2.cache[0]));
      var diff = Math.sqrt(diffSq);

      if (collider1.trigger || collider2.trigger) {
        entity1.pub('onTrigger', entity2, p, diff);
        entity2.pub('onTrigger', entity1, p, diff);
        continue;
      }

      diff -= radiusSum;
      var vel1 = kinetic1.velocity;
      var vel2 = kinetic2.velocity;
      var mass1 = kinetic1.mass || 1;
      var mass2 = kinetic2.mass || 1;

      if (diff < 0) {
        Vec2.add(pos1, Vec2.scal(p, -diff * 2 * radius1 / radiusSum, Vec2.cache[1]));
        Vec2.add(pos2, Vec2.scal(p, diff * 2 * radius2 / radiusSum, Vec2.cache[1]));
      }

      // normal vector to collision direction
      var n = Vec2.perp(p, Vec2.cache[1]);

      var vp1 = Vec2.dot(vel1, p); // velocity of P1 along collision direction
      var vn1 = Vec2.dot(vel1, n); // velocity of P1 normal to collision direction
      var vp2 = Vec2.dot(vel2, p); // velocity of P2 along collision direction
      var vn2 = Vec2.dot(vel2, n); // velocity of P2 normal to collision

      // fully elastic collision (energy & momentum preserved)
      var vp1After = (mass1 * vp1 + mass2 * (2 * vp2 - vp1)) / (mass1 + mass2);
      var vp2After = (mass1 * (2 * vp1 - vp2) + mass2 * vp2) / (mass1 + mass2);

      Vec2.add(Vec2.scal(p, vp1After, Vec2.cache[2]), Vec2.scal(n, vn1, Vec2.cache[3]), vel1);
      Vec2.add(Vec2.scal(p, vp2After, Vec2.cache[2]), Vec2.scal(n, vn2, Vec2.cache[3]), vel2);

      entity1.pub('onCollide', entity2, n);
      entity2.pub('onCollide', entity1, n);
    }
  }
};

new Component('collider', Collider);

module.exports = Collider;
