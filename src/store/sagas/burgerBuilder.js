import { put } from 'redux-saga/effects'
import axios from "../../axios-orders";
import * as actions from "../actions/index";


export function* initIngredientsSaga(action) {
	try {
		const res = yield axios.get( 'https://burger-builder-9aed3.firebaseio.com/ingredients.json' )
		yield put(actions.setIngredients(res.data));
	}
	catch (e) {
		yield put(actions.fetchIngredientsFailed());
	}
}
