export const ADD_TOKEN = 'ADD_TOKEN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_REDSOC1= 'UPDATE_REDSOC1';
export const UPDATE_REDSOC2= 'UPDATE_REDSOC2';
export const UPDATE_REDSOC3= 'UPDATE_REDSOC3';
export const UPDATE_MAIL= 'UPDATE_MAIL';
export const UPDATE_IMG='UPDATE_IMG';

export function logout() {
    return {
        type: LOGOUT
    }
}

export function login(userData) {
    return {
        type: LOGIN_SUCCESS,
        payload: userData
    }
}

export function setToken(token) {
    return {
        type: ADD_TOKEN,
        payload: token
    }
}
export function update_redSoc1(reds) {
    return {
        type: UPDATE_REDSOC1,
        payload: reds
    }
}
export function update_redSoc2(reds) {
    return {
        type: UPDATE_REDSOC2,
        payload: reds
    }
}
export function update_redSoc3(reds) {
    return {
        type: UPDATE_REDSOC3,
        payload: reds
    }
}
export function update_mail(mail) {
    return {
        type: UPDATE_MAIL,
        payload: mail
    }
}
export function update_img(img) {
    return {
        type: UPDATE_IMG,
        payload: img
    }
}