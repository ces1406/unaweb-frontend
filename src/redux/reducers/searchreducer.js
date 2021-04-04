import { ADD_RESULTS} from '../actions/searchactions';

const initialState = { resultados: []}

const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_RESULTS:
            return { resultados: action.payload };
        default:
            return state;
    }
}

export default searchReducer;