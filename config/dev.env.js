'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  //BASE_API: '" https://www.easy-mock.com/mock/5aa5f401a99e172c9fe77f05/vue-element-admin"',
  BASE_API: '"http://localhost:8089"',
  //BASE_API: '"http://192.168.1.116:8081"',
})
