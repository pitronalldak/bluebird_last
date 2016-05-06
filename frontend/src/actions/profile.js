import fetch from 'isomorphic-fetch';
import * as types from '../constants/profile';
import config from '../config/config';
import { getHeaders } from '../helper';


export function fetchProfile() {
  return dispatch => {
    let isError = false;
    const returnObj = { type: types.GETPROFILE, data: { isFetched: true } };
    if (window.localStorage.jwt) {
      fetch(`${config.baseUrl}/api/auth/current/`,
        { method: 'GET',
          headers: getHeaders()
        })
        .then(response => {
          if (response.status >= 400) {
            window.localStorage.removeItem('jwt');
            returnObj.data.isAuth = false;
            isError = true;
            dispatch(returnObj);
          }
          return response.json();
        })
        .then(json => {
          if (!isError) {
            returnObj.data = json;
            returnObj.data.isAuth = true;
            returnObj.data.isFetched = true;
            dispatch(returnObj);
          }
        });
    } else {
      dispatch(returnObj);
    }
  };
}


export function auth(data, successCallback) {
  return dispatch => {
    let isError = false;
    fetch(`${config.baseUrl}/api/auth/`,
      { method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      })
      .then(response => {
        const returnObj = { type: types.AUTH, data: {} };
        if (response.status >= 400) {
          returnObj.data.isAuth = false;
          returnObj.data.error = 'Email or password is incorrect';
          isError = true;
          dispatch(returnObj);
        }
        return response.json();
      })
      .then(json => {
        if (!isError) {
          window.localStorage.setItem('jwt', json.token);
          if (successCallback) {
            successCallback.apply(null);
          }
          dispatch(fetchProfile());
        }
      });
  };
}

export function reg(data, successCallback) {
  return dispatch => {
    let isError = false;
    fetch(`${config.baseUrl}/api/auth/reg/`,
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
          dispatch({ type: types.REG, data: { errors: json } });
        } else {
          window.localStorage.setItem('jwt', json.token);
          if (successCallback) {
            successCallback.apply(null);
          }
          dispatch(fetchProfile());
        }
      });
  };
}

export function updateUser(data, successCallback) {
  return dispatch => {
    let isError = false;
    fetch(`${config.baseUrl}/api/auth/update-user/`,
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
          dispatch({ type: types.REG, data: { errors: json } });
        } else {
          window.localStorage.setItem('jwt', json.token);
          if (successCallback) {
            successCallback.apply(null);
          }
          dispatch(fetchProfile());
        }
      });
  };
}

export function changeProfile(data, successCallback) {
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
        }
        dispatch({ type: types.USERS_ADD_SUCCESS, data: { isEdit, user: json } });
      });
  };
}

export function logout() {
  window.localStorage.removeItem('jwt');
  return {
    type: types.AUTH,
    data: { isAuth: false }
  };
}
