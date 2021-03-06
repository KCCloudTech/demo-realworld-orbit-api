'use strict'

const { pluralize, singularize } = require('inflected');
const { Schema } = require('@orbit/data');
const { Plugin, SQLSource } = require('@orbit-server/fastify');

module.exports = function(fastify, opts, next) {
  const schemaJson = require('./schema.json');
  schemaJson.pluralize = pluralize;
  schemaJson.singularize = singularize;
  const schema = new Schema(schemaJson);
  const source = new SQLSource({
    schema,
    knex: {
      client: 'pg',
      connection: process.env.DATABASE_URL
    }
  });

  fastify.register(Plugin, {
    source,
    jsonapi: true,
    graphql: {
      introspection: true,
      playground: {
        settings: {
          'schema.polling.enable': false
        }
      }
    }
  });

  next();
}
