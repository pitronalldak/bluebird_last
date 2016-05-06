import { AUTH, GETPROFILE, REG } from '../constants/profile';
import objectAssign from 'object-assign';

const initialState = {
  isAuth: false,
  isFetched: false
};

function profileReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH:
      return objectAssign({}, state, action.data);
    case REG:
      return objectAssign({}, state, action.data);
    case GETPROFILE:
      return objectAssign({}, state, action.data);
    default:
      return state;
  }
}

export default profileReducer;
