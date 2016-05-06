import * as types from '../constants/main';
import objectAssign from 'object-assign';


const initialState = {
  isFetchingPeManager: false,
  noMorePeManager: false,
  peManagers: [],
  search: '',
  filters: {}
};


function mainReducer(state = initialState, action) {
  switch (action.type) {
    case types.PEMANAGER_FETCH_START:
      return objectAssign({}, state, { isFetchedPeManager: true });
    case types.PEMANAGER_FETCH_SUCCESS: {
      let peManagers = [];
      let search = '';
      let filters = '';
      if (action.search === undefined) {
        search = state.search;
      } else {
        search = action.search;
      }
      if (action.filters === undefined) {
        filters = state.filters;
      } else {
        filters = action.filters;
      }
      if (action.sort) {
        peManagers = action.data.results;
      } else {
        peManagers = state.peManagers.concat(action.data.results);
      }
      return objectAssign(
        {},
        state,
        { isFetchingPeManager: false, filters, peManagers, search }
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
    default:
      return state;
  }
}

export default mainReducer;
