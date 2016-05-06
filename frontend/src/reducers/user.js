import * as types from '../constants/user';
import objectAssign from 'object-assign';


const initialState = {
  isFetchingUser: false,
  isFetchingReview: false,
  noMoreReview: false,
  user: {},
  reviews: []
};


function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.USER_FETCH_START:
      return objectAssign({}, state, { isFetchingUser: true });
    case types.USER_FETCH_SUCCESS: {
      const user = action.data;
      return objectAssign(
        {},
        state,
        { isFetchingUser: false, user }
      );
    }
    case types.REVIEW_ADD_SUCCESS: {
      return state;
    }
    case types.REVIEW_FETCH_START:
      return objectAssign({}, state, { isFetchingReview: true });
    case types.REVIEW_FETCH_SUCCESS: {
      const reviews = state.reviews.concat(action.data.results);
      return objectAssign(
        {},
        state,
        { isFetchingReview: false, reviews }
      );
    }
    case types.REVIEW_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingReview: false, noMoreReview: true });
    default:
      return state;
  }
}

export default userReducer;
