import {createStore, combineReducers, applyMiddleware} from 'redux';
import { routerReducer as routing } from 'react-router-redux'
import thunk from "redux-thunk";
import * as API from 'api';
import {categories} from 'base/reducers/categories';
import {documents} from 'base/reducers/documents';
import {calendar} from 'base/reducers/calendar';
import {ratings} from 'base/reducers/ratings';

let rootReducer = combineReducers(
  {
    routing,
    categories,
    documents,
    calendar,
    ratings
  }
);

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store, rootReducer};
