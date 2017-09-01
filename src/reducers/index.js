import {createStore, combineReducers, applyMiddleware} from 'redux';
import { routerReducer as routing } from 'react-router-redux'
import thunk from "redux-thunk";
import * as API from 'api';
import {categories} from 'base/reducers/categories';

let rootReducer = combineReducers(
  {
    routing,
    categories
  }
);

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store, rootReducer};
