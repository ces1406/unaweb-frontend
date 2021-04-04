export const ADD_RESULTS = 'ADD_RESULTS';

export function addSearchResults(vecResults) {
    console.log('searchactions->addSearchResults->vecResults: '+JSON.stringify(vecResults))
    return {
        type: ADD_RESULTS,
        payload: vecResults
    }
}