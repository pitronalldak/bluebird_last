import * as types from '../constants/admin';
import objectAssign from 'object-assign';


const initialState = {
  isFetchingUsers: false,
  noMoreUsers: false,
  isFetchingPeManager: false,
  noMorePeManager: false,
  isFetchingReviews: false,
  noMoreReviews: false,
  users: [],
  peManagers: [],
  reviews: []
};


function adminReducer(state = initialState, action) {
  switch (action.type) {
    case types.USERS_FETCH_START:
      return objectAssign({}, state, { isFetchingUsers: true });
    case types.USERS_FETCH_SUCCESS: {
      let users = [];
      if (action.sort) {
        users = action.data.results;
      } else {
        users = state.users.concat(action.data.results);
      }
      return objectAssign(
        {},
        state,
        { isFetchingUsers: false, noMoreUsers: false, users, peManagers: [] }
      );
    }
    case types.USERS_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingUsers: false, noMoreUsers: true });

    case types.USERS_ADD_ERROR:
      return objectAssign({}, state, action.data);
    case types.USERS_ADD_SUCCESS: {
      const users = state.users.slice();
      if (action.data.isEdit) {
        let index = 0;
        for (const user of users) {
          if (user.id === action.data.user.id) {
            users[index] = action.data.user;
            break;
          }
          index += 1;
        }
      } else {
        users.unshift(action.data.user);
      }
      return objectAssign({}, state, { users });
    }
    case types.USERS_RM_SUCCESS: {
      const users = state.users.slice();
      let index = 0;
      for (const user of state.users) {
        if (user.id === action.data.id) {
          break;
        }
        index += 1;
      }
      users.splice(index, 1);

      return objectAssign({}, state, { users });
    }

    case types.PEMANAGER_FETCH_START:
      return objectAssign({}, state, { isFetchingPeManager: true });
    case types.PEMANAGER_FETCH_SUCCESS: {
      let peManagers = [];
      if (action.sort) {
        peManagers = action.data.results;
      } else {
        peManagers = state.peManagers.concat(action.data.results);
      }
      return objectAssign(
        {},
        state,
        { isFetchingPeManager: false, peManagers, users: [] }
      );
    }
    case types.PEMANAGER_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingPeManager: false, noMorePeManager: true });

    case types.PEMANAGER_ADD_ERROR:
      return objectAssign({}, state, action.data);
    case types.PEMANAGER_ADD_SUCCESS: {
      const peManagers = state.peManagers.slice();
      if (action.data.isEdit) {
        let index = 0;
        for (const peManager of peManagers) {
          if (peManager.id === action.data.peManager.id) {
            peManagers[index] = action.data.peManager;
            break;
          }
          index += 1;
        }
      } else {
        peManagers.unshift(action.data.peManager);
      }
      return objectAssign({}, state, { peManagers });
    }
    case types.PEMANAGER_RM_SUCCESS: {
      const peManagers = state.peManagers.slice();
      let index = 0;
      for (const peManager of state.peManagers) {
        if (peManager.id === action.data.id) {
          break;
        }
        index += 1;
      }
      peManagers.splice(index, 1);

      return objectAssign({}, state, { peManagers });
    }

    case types.REVIEWS_FETCH_START:
      return objectAssign({}, state, { isFetchingReviews: true });
    case types.REVIEWS_FETCH_SUCCESS: {
      let reviews = [];
      if (action.sort) {
        reviews = action.data.results;
      } else {
        reviews = state.reviews.concat(action.data.results);
      }
      return objectAssign(
        {},
        state,
        { isFetchingReviews: false, noMoreReviews: false, reviews, peManagers: [] }
      );
    }
    case types.REVIEWS_FETCH_NO_MORE:
      return objectAssign({}, state, { isFetchingRevies: false, noMoreReviews: true });

    case types.REVIEWS_ADD_ERROR:
      return objectAssign({}, state, action.data);
    case types.REVIEWS_ADD_SUCCESS: {
      const reviews = state.reviews.slice();
      if (action.data.isEdit) {
        let index = 0;
        for (const review of reviews) {
          if (review.id === action.data.review.id) {
            review[index] = action.data.review;
            break;
          }
          index += 1;
        }
      } else {
        reviews.unshift(action.data.review);
      }
      return objectAssign({}, state, { reviews });
    }
    case types.REVIEWS_RM_SUCCESS: {
      const reviews = state.reviews.slice();
      let index = 0;
      for (const review of state.reviews) {
        if (review.id === action.data.id) {
          break;
        }
        index += 1;
      }
      reviews.splice(index, 1);
      return objectAssign({}, state, { reviews });
    }
    default:
      return state;
  }
}

export default adminReducer;
