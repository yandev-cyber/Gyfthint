import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

// Reducers
import * as Reducers from '../redux/reducers';

const rootReducer = combineReducers(Reducers);

export default () => {
  return createStore(rootReducer, applyMiddleware(thunk));
};
