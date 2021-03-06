'use strict';

var Box2D = require('./lib/box2d').Box2D;

module.exports = {
  Vec2: Box2D.b2Vec2,
  BodyDef: Box2D.b2BodyDef,
  Body: Box2D.b2Body,
  FixtureDef: Box2D.b2FixtureDef,
  Fixture: Box2D.b2Fixture,
  World: Box2D.b2World,
  MassData: Box2D.b2MassData,
  PolygonShape: Box2D.b2PolygonShape,
  CircleShape: Box2D.b2CircleShape,
  DebugDraw: Box2D.b2DebugDraw,
  WorldManifold: Box2D.b2WorldManifold,
  staticBody: Box2D.b2_staticBody,
  dynamicBody: Box2D.b2_dynamicBody,
  ContactListener: Box2D.b2ContactListener,
  Contact: Box2D.b2Contact,
  customizeVTable: Box2D.customizeVTable,
  wrapPointer: Box2D.wrapPointer
};
