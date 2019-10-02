import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
};

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	}
};

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	}
};

export const logout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT
	}
};

export const checkAuthTimeout = (expTime) => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout())
		}, expTime*1000);
	}
};

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart());
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDRZN-FbkxZgPz5JXGHfT7SFRlPMp1POt8';
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		if(!isSignup){
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDRZN-FbkxZgPz5JXGHfT7SFRlPMp1POt8'
		}
		axios.post(url, authData)
		.then(res => {
			console.log(res);
			dispatch(authSuccess(res.data.idToken, res.data.localId));
			dispatch(checkAuthTimeout(res.data.expiresIn))
		})
		.catch(err => {
			dispatch(authFail(err.response.data.error));
		})
	}
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
};
