import { combineReducers } from 'redux';
import main from './main';
import profile from './profile';
import admin from './admin';
import peManager from './peManager';
import user from './user';


const rootReducer = combineReducers({
  main,
  profile,
  admin,
  peManager,
  user
});

export default rootReducer;
