import {createStore, combineReducers, applyMiddleware} from 'redux';
import { routerReducer as routing } from 'react-router-redux'
import thunk from "redux-thunk";
import * as API from 'api';
import {categories} from 'base/reducers/categories';
import {documents} from 'base/reducers/documents';
import {calendar} from 'base/reducers/calendar';
import {ratings} from 'base/reducers/ratings';
import {searchfile} from 'base/reducers/searchfile';
import {procedures} from 'base/reducers/procedure';
import {units} from 'base/reducers/units';
import {fields} from 'base/reducers/fields';
import {searchProcedure} from 'base/reducers/searchProcedure';
import {status} from 'base/reducers/status';
import {storeKeySearch} from 'base/reducers/storeKeySearch';
import {notifications} from 'base/reducers/notification';
import {changeFile} from 'base/reducers/changeFile';
import {plans} from 'base/reducers/plans';
import {categoryplans} from 'base/reducers/categoryplans';
import {auth} from 'base/reducers/auth';
import {products} from 'base/reducers/products';
import {productsBill} from 'base/reducers/productsBill';
import {orders} from 'base/reducers/orders';

let rootReducer = combineReducers(
{
    routing,
    categories,
    documents,
    calendar,
    ratings,
    searchfile,
    procedures,
    units,
    fields,
    searchProcedure,
    status,
    storeKeySearch,
    notifications,
    changeFile,
    categoryplans,
    plans,
    auth,
    products,
    productsBill,
    orders
  }
);

const store = createStore(rootReducer, applyMiddleware(thunk));

export {store, rootReducer};
