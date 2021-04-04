import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/rootreducer';
import CSS from "../static_files/index.css";

// Respaldando Redux en LocalStorage:
function saveOnLocalStorage(estado){
    try{
        const estadoAux = JSON.stringify(estado);
        localStorage.setItem('estado',estadoAux);
    }catch(err){ }
};
function loadOfLocalStorage(){
    try{
        const estadoAux = localStorage.getItem('estado');
        if(estadoAux === null) {
            return undefined;
        }
        return JSON.parse(estadoAux);
    }catch(err){
        return undefined;
    }
}

const store = createStore(rootReducer,loadOfLocalStorage(),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.subscribe(()=>saveOnLocalStorage(store.getState()));

class Index extends React.Component{
    render(){
        console.log('Index->render()')
        return(
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

ReactDOM.render(<Index/>,document.getElementById('root'));