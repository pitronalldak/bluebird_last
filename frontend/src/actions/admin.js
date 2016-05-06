import fetch from 'isomorphic-fetch';
import * as types from '../constants/admin';
import config from '../config/config';
import { getHeaders, objToGetParams } from '../helper';
import changeCase from 'change-case';


export function getUsers(page, ordering, sort, direction, search) {
  return dispatch => {
    let isError = false;
    const returnObj = { type: types.USERS_FETCH_SUCCESS, data: { page }, sort, ordering };
    const params = objToGetParams({
      ordering: `${direction}${changeCase.snakeCase(ordering)}`,
      page,
      search
    });
    dispatch({ type: types.USERS_FETCH_START });
    fetch(`${config.baseUrl}/api/admin/users/${params}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status === 404) {
          isError = true;
          dispatch({ type: types.USERS_FETCH_NO_MORE });
        } else if (response.status >= 400) {
          window.localStorage.removeItem('jwt');
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          returnObj.data = json;
          dispatch(returnObj);
        }
      });
  };
}

export function addUser(data, successCallback) {
  return dispatch => {
    let isError = false;
    const isEdit = data.id;

    fetch(`${config.baseUrl}/api/admin/users/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        return response.json();
      })
      .then(json => {
        if (isError) {
          dispatch({ type: types.USERS_ADD_ERROR, data: { usersErrors: json } });
        } else if (successCallback) {
          successCallback.apply(null);
          dispatch({ type: types.USERS_ADD_SUCCESS, data: { isEdit, user: json } });
        }
      });
  };
}

export function rmUser(id, successCallback) {
  return dispatch => {
    fetch(`${config.baseUrl}/api/admin/users/${id}/`,
      { method: 'DELETE',
        headers: getHeaders()
      })
      .then(() => {
        if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.USERS_RM_SUCCESS, data: { id } });
      });
  };
}


export function getPeManagers(page, ordering, sort, direction, search, is_verify) {
  return dispatch => {
    let isError = false;
    const returnObj = { type: types.PEMANAGER_FETCH_SUCCESS, data: { page }, sort, ordering };
    const params = objToGetParams({
      ordering: `${direction}${changeCase.snakeCase(ordering)}`,
      page,
      search,
      is_verify
    });
    dispatch({ type: types.PEMANAGER_FETCH_START });
    fetch(`${config.baseUrl}/api/admin/pe-managers/${params}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status === 404) {
          isError = true;
          dispatch({ type: types.PEMANAGER_FETCH_NO_MORE });
        } else if (response.status >= 400) {
          window.localStorage.removeItem('jwt');
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          returnObj.data = json;
          dispatch(returnObj);
        }
      });
  };
}

export function addPeManager(data, successCallback) {
  return dispatch => {
    let isError = false;
    const isEdit = data.id;
    fetch(`${config.baseUrl}/api/admin/pe-managers/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        return response.json();
      })
      .then(json => {
        if (isError) {
          dispatch({ type: types.PEMANAGER_ADD_ERROR, data: { peManagerErrors: json } });
        } else if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.PEMANAGER_ADD_SUCCESS, data: { isEdit, peManager: json } });
      });
  };
}

export function rmPeManager(id, successCallback) {
  return dispatch => {
    fetch(`${config.baseUrl}/api/admin/pe-managers/${id}/`,
      { method: 'DELETE',
        headers: getHeaders()
      })
      .then(() => {
        if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.PEMANAGER_RM_SUCCESS, data: { id } });
      });
  };
}

export function getReviews(page, ordering, sort, direction, search, is_verify) {
  return dispatch => {
    let isError = false;
    const returnObj = { type: types.REVIEWS_FETCH_SUCCESS, data: { page }, sort, ordering };
    const params = objToGetParams({
      ordering: `${direction}${changeCase.snakeCase(ordering)}`,
      page,
      search,
      is_verify
    });
    dispatch({ type: types.REVIEWS_FETCH_START });
    fetch(`${config.baseUrl}/api/admin/reviews/${params}`,
      { method: 'GET',
        headers: getHeaders()
      })
      .then(response => {
        if (response.status === 404) {
          isError = true;
          dispatch({ type: types.REVIEWS_FETCH_NO_MORE });
        } else if (response.status >= 400) {
          window.localStorage.removeItem('jwt');
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          returnObj.data = json;
          dispatch(returnObj);
        }
      });
  };
}

export function addReview(data, successCallback) {
  return dispatch => {
    let isError = false;
    const isEdit = data.id;

    fetch(`${config.baseUrl}/api/admin/reviews/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        isError = (response.status >= 400);
        return response.json();
      })
      .then(json => {
        if (isError) {
          dispatch({ type: types.REVIEWS_ADD_ERROR, data: { reviewsErrors: json } });
        } else if (successCallback) {
          successCallback.apply(null);
          dispatch({ type: types.REVIEWS_ADD_SUCCESS, data: { isEdit, review: json } });
        }
      });
  };
}

export function rmReview(id, successCallback) {
  return dispatch => {
    fetch(`${config.baseUrl}/api/admin/reviews/${id}/`,
      { method: 'DELETE',
        headers: getHeaders()
      })
      .then(() => {
        if (successCallback) {
          successCallback.apply(null);
        }
        dispatch({ type: types.REVIEWS_RM_SUCCESS, data: { id } });
      });
  };
}
