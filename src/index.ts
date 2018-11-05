export {}
const Store = require('./Store');
const combineReducers = require('./combine-reducers');
const normalizeReducer = require('./normalize-reducer');

const yafi = {
  Store,
  combineReducers,
  normalizeReducer
};

module.exports = yafi;
