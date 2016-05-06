import * as types from '../constants/peManager';
import objectAssign from 'object-assign';


const initialState = {
  isFetchingPeManager: false,
  noMorePeManager: false,
  isFetchingReview: false,
  noMoreReview: false,
  peManager: {},
  reviews: [],
  isThumb: true
};


function peManagerReducer(state = initialState, action) {
  switch (action.type) {
    case types.PEMANAGER_FETCH_START:
      return objectAssign({}, state, { isFetchedPeManager: true });
    case types.PEMANAGER_FETCH_SUCCESS: {
      const peManager = action.data.results[0];
      return objectAssign(
        {},
        state,
        { isFetchingPeManager: false, peManager }
      );
    }
    case types.PEMANAGER_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingReview: false, noMoreReview: true });
    case types.REVIEW_ADD_SUCCESS: {
      return state;
    }
    case types.REVIEW_FETCH_START:
      return objectAssign({}, state, { isFetchingReview: true });
    case types.REVIEW_FETCH_SUCCESS: {
      const reviews = action.data.results;
      return objectAssign(
        {},
        state,
        { isFetchingReview: false, reviews }
      );
    }
    case types.REVIEW_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingReview: false, noMoreReview: true });
    case types.RAPORT_ADD_SUCCESS:
      return state;
    case types.THUMB_ADD_SUCCESS:
      return state;
    default:
      return state;
  }
}

export default peManagerReducer;
