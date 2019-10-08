import axios from "axios";
import {delay, put} from 'redux-saga/effects'
import * as actions from "../actions/index";

export function* logoutSaga(action) {
	yield localStorage.removeItem("token");
	yield localStorage.removeItem("expirationDate");
	yield localStorage.removeItem("userId");
	yield put(actions.logoutSucceed())
}

export function* checkAuthTimeoutSaga(action) {
	yield delay(action.expirationTime * 1000);
	yield put(actions.logout())
}

export function* authUserSaga(action) {
	let expirationDate;
	yield put(actions.authStart());
	
	let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDRZN-FbkxZgPz5JXGHfT7SFRlPMp1POt8';
	const authData = {
		email: action.email,
		password: action.password,
		returnSecureToken: true
	};
	if (!action.isSignup) {
		url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDRZN-FbkxZgPz5JXGHfT7SFRlPMp1POt8'
	}
	try{
		const res = yield axios.post(url, authData);
		
		const {localId, idToken, expiresIn} = res.data;
		expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
		yield localStorage.setItem("token", idToken);
		yield localStorage.setItem("expirationDate", expirationDate);
		yield localStorage.setItem("userId", localId);
		yield put(actions.authSuccess(idToken, localId));
		yield put(actions.checkAuthTimeout(expiresIn));
	}
	catch (e) {
		yield put(actions.authFail(e.response.data.error));
	}
}

export function* authCheckStateSaga(action) {
	const token = yield localStorage.getItem("token");
	if (!token) {
		yield put(actions.logout())
	} else {
		const expirationDate = new Date (localStorage.getItem("expirationDate"));
		if (expirationDate <= new Date()) {
			yield put(actions.logout())
		} else {
			const userId = yield localStorage.getItem("userId");
			yield put(actions.authSuccess(token, userId));
			yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
		}
	}
}
