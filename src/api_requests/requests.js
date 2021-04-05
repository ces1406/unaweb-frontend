import {SERVER_URL} from '../globals';

export function isTokenOk(token) {
    let jwt = JSON.parse(atob(token.split('.')[1]))      
    return (jwt.exp>(Date.now()/1000))
}
export function doSimpleCorsGetRequest(addres) {
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { Accept: 'application/json', Origin: null }        
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search(SERVER_URL+'/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                res(rta);
            })
            .catch((err) => { rej(err) });
    })
}
export function doSimpleCorsPostRequest(addres,data,sinFormData) {
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'POST' }
        cabecera.headers = { 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json',
        };
        cabecera.body = data;       
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then((rta) => { res(rta); })
            .catch((err) => { rej(err);});
    })
}
export function doPreflightCorsPostRequest(addres, data, withFormData) {
    return new Promise((res, rej) => {
        let cabecera = { method:'POST' }
        cabecera.headers = {  Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json' }
        if (!withFormData) cabecera.headers['Content-Type'] = 'application/json';
        cabecera.body = data;        
        fetch(SERVER_URL + addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => {
                res(rta) })
            .catch((err) => { 
                rej(err) 
            });
    })
}
export function doJwtPreflightCorsPostRequest(direccion, data, withFormData, token) {
    return new Promise((res, rej) => {
        var cabecera = { method:'POST' }
        cabecera.headers = { 'Access-Control-Request-Headers': 'Authorization', Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json', Authorization: 'Bearer ' + token }
        if (!withFormData) cabecera.headers['Content-Type'] = 'application/json';
        cabecera.body = data;       
        fetch(SERVER_URL + direccion, cabecera)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return (direccion.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                res(rta) 
            })
            .catch((err) => { 
                rej(err) 
            });
    })
}
export function doJwtPreflightCorsGetRequest(addres,token) {
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            'Access-Control-Request-Headers': 'Authorization', 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json', 
            Authorization: 'Bearer ' + token }        
        fetch(addres, cabecera)
            .then((resp) => {
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                res(rta) 
            })
            .catch((err) => { rej(err) });
    })
}