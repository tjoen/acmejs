'use strict';

var Box2D = require('./lib/box2dweb');

module.exports = {
  Vec2: Box2D.Common.Math.b2Vec2,
  BodyDef: Box2D.Dynamics.b2BodyDef,
  Body: Box2D.Dynamics.b2Body,
  FixtureDef: Box2D.Dynamics.b2FixtureDef,
  Fixture: Box2D.Dynamics.b2Fixture,
  World: Box2D.Dynamics.b2World,
  MassData: Box2D.Collision.Shapes.b2MassData,
  PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
  CircleShape: Box2D.Collision.Shapes.b2CircleShape,
  DebugDraw: Box2D.Dynamics.b2DebugDraw,
  WorldManifold: Box2D.Collision.b2WorldManifold
};
