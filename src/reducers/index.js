import {createStore, combineReducers, applyMiddleware} from 'redux';
import { routerReducer as routing } from 'react-router-redux'
import thunk from "redux-thunk";
import * as API from 'api';
import {categories} from 'base/reducers/categories';
import {auth} from 'base/reducers/auth';
import {products} from 'base/reducers/products';
import {productsBill} from 'base/reducers/productsBill';
import {orders} from 'base/reducers/orders';
import {status} from 'base/reducers/status';

let rootReducer = combineReducers(
{
    routing,
    categories,
    auth,
    products,
    productsBill,
    orders,
    status
  }
);

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store, rootReducer};
