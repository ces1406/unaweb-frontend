export const ADD_RESULTS = 'ADD_RESULTS';

export function addSearchResults(vecResults) {
    return {
        type: ADD_RESULTS,
        payload: vecResults
    }
}