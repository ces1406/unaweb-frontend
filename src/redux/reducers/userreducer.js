import { ADD_TOKEN, LOGIN_SUCCESS, LOGOUT, UPDATE_MAIL/*, UPDATE_PASS*/, UPDATE_REDSOC1, UPDATE_REDSOC2, UPDATE_REDSOC3, UPDATE_IMG } from '../actions/useractions';

const initialState = { logged: false, token: '', apodo: '', pass: '',rol:'', idUser: '', mail: '', redSoc1: '', redSoc2: '', redSoc3: '', dirImg: '' }

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TOKEN:
            return { ...state, token: action.payload };
        case LOGIN_SUCCESS:
            return {
                ...state, logged: true, apodo: action.payload.apodo,/* pass: action.payload.pass,*/rol:action.payload.rol,idUser: action.payload.idUser, mail: action.payload.mail,
                redSoc1: action.payload.redSoc1, redSoc2: action.payload.redSoc2, redSoc3: action.payload.redSoc3, dirImg: action.payload.img
            };
        case LOGOUT:
            return { initialState }
        /*case UPDATE_PASS:
            return { ...state, pass: action.payload };*/
        case UPDATE_REDSOC1:
            return { ...state, redSoc1: action.payload };
        case UPDATE_REDSOC2:
            return { ...state, redSoc2: action.payload };
        case UPDATE_REDSOC3:
            return { ...state, redSoc3: action.payload };
        case UPDATE_MAIL:
            return { ...state, mail: action.payload };
        case UPDATE_IMG:
            return { ...state, dirImg: action.payload };
        default:
            return state;
    }
}

export default userReducer;