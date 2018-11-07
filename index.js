"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store = require('./Store');
const combineReducers = require('./combine-reducers');
const normalizeReducer = require('./normalize-reducer');
const yafi = {
    Store,
    combineReducers,
    normalizeReducer,
};
module.exports = yafi;
