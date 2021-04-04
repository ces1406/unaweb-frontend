import {SERVER_URL} from '../globals';

export function isTokenOk(token) {
    let jwt = JSON.parse(atob(token.split('.')[1]))      
    //let out = new Date(jwt.exp*1000)
    //let now = new Date();
    /*console.log('-->requests.js->isTokenOk->jwt.seconds: ' + jwt.exp)  
    console.log('-->requests.js->isTokenOk->now.seconds: ' + now.getTime())  
    console.log('-->requests.js->isTokenOk->now.seconds: ' + Date.now()/1000)  
    console.log('-->requests.js->isTokenOk->now:   ' + now)
    console.log('-->requests.js->isTokenOk->out:   ' + out)
    console.log('-->requests.js-> jwt->: ' + out.getHours()+':'+out.getMinutes()+':'+out.getSeconds()+' del '+out.getDate()+'/'+out.getMonth()+'/'+out.getFullYear());
    console.log('-->requests.js-> now->: ' + now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+' del '+now.getDate()+'/'+now.getMonth()+'/'+now.getFullYear());
    */
    //let rta = (jwt.exp>(Date.now()/1000))?true:false;
    //console.log('-->requests.js->isTokenOk.->rta: ' + rta);
    return (jwt.exp>(Date.now()/1000))
}
export function doSimpleCorsGetRequest(addres) {
    console.log('doSimpleCorsGetRequest->address:'+addres)
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { Accept: 'application/json', Origin: null }        
        fetch(addres, cabecera)
            .then((resp) => {
                //console.log('doSimpleCorsGetRequest-resp->'+JSON.stringify(resp))
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search(SERVER_URL+'/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                //console.log('doSimpleCorsGetRequest-resp->'+JSON.stringify(rta));
                res(rta);
            })
            .catch((err) => { rej(err) });
    })
}
export function doSimpleCorsPostRequest(addres,data,sinFormData) {
    console.log('doSimpleCorsPostRequest->address:'+addres)
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'POST' }
        cabecera.headers = { 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json',
        };
        cabecera.body = data;  
        console.log('doSimplecorsPostRequest->data: ',data)      
        fetch(addres, cabecera)
            .then((resp) => {
                console.log('doSimplecorsPostRequest->resp:',resp)
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then((rta) => { res(rta);console.log('doSimplecorsPostRequest->rta:',rta) })
            .catch((err) => { rej(err); console.log('doSimplecorsPostRequest->err:',err) });
    })
}
export function doPreflightCorsGetRequest(addres) { //---TODO: No se usa ?
    console.log('doPreflightCorsGetRequest->address:'+addres)
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            Accept: 'application/json', 
            'Content-Type': 'application/json' ,
            Origin: 'http://localhost:1111'
        }
        
        fetch(addres, cabecera)
            .then((resp) => {
                console.log('doPreflightCorsGetRequest->resp:',resp)
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                console.log('doPreflightCorsGetRequest->resp:',rta);
                res(rta); 
            })
            .catch((err) => { rej(err) });
    })
}
export function doPreflightCorsPostRequest(addres, data, withFormData) {
    console.log('doPreflightCorsPostRequest->address:'+addres)
    return new Promise((res, rej) => {
        let cabecera = { method:'POST' }
        cabecera.headers = {  Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json' }
        if (!withFormData) cabecera.headers['Content-Type'] = 'application/json';
        cabecera.body = data;
        /*cabecera.headers = { 
            Accept: 'application/json',
            methods:'OPTIONS', 
            'Access-Control-Request-Method': 'POST' ,
            'Access-Control-Request-Headers': 'Content-Type',
            //'Content-Type': 'application/json',
            Origin: 'http://localhost:1111'
        }*/
        console.log('cabecera lista...');
        
        fetch(SERVER_URL + addres, cabecera)
            .then((resp) => {
                console.log('doPreflightCorsPostRequest-resp->'+JSON.stringify(resp))
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => {
                console.log('doPreflightCorsPostRequest-rta->'+JSON.stringify(rta));
                res(rta) })
            .catch((err) => { 
                console.log('doPreflightCorsPostRequest-err->',err.message)
                rej(err) 
            });
    })
}
export function doJwtPreflightCorsPostRequest(direccion, data, withFormData, token) {
    console.log('doJwtPreflightCorsPostRequest->address:'+direccion)
    return new Promise((res, rej) => {
        var cabecera = { method:'POST' }
        cabecera.headers = { 'Access-Control-Request-Headers': 'Authorization', Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json', Authorization: 'Bearer ' + token }
        if (!withFormData) cabecera.headers['Content-Type'] = 'application/json';
        cabecera.body = data
       
        fetch(SERVER_URL + direccion, cabecera)
            .then((resp) => {
                console.log('doJwtPreflightCorsPostRequest-resp: '+JSON.stringify(resp))
                //console.log('--requests.js->doJwtRequest-resp.ok: '+resp.ok)
                if (!resp.ok) {
                    //console.log('--requests.js->doJwtRequest-resp.code.ok-false: '+resp.ok)
                    throw new Error(resp.statusText);
                }
                return (direccion.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                console.log('doJwtPreflightCorsPostRequest-resp: '+JSON.stringify(rta));
                res(rta) 
            })
            .catch((err) => { 
                rej(err) 
            });
    })
}
export function doJwtPreflightCorsGetRequest(addres,token) {
    console.log('doJwtPreflightCorsGetsRequest->address:'+addres)
    addres = SERVER_URL + addres;
    return new Promise((res, rej) => {
        let cabecera = { method:'GET' }
        cabecera.headers = { 
            'Access-Control-Request-Headers': 'Authorization', 
            Accept: 'text/html,apllication/xhtml+xml,application/xml,application/json', 
            Authorization: 'Bearer ' + token }
        
        fetch(addres, cabecera)
            .then((resp) => {
                console.log('doJwtPreflightCorsGetsRequest-resp->'+JSON.stringify(resp))
                if (!resp.ok) throw new Error(resp.statusText);
                return (addres.search('/usuarios/avatar/') === 0) ? resp.blob() : resp.json();
            })
            .then((rta) => { 
                console.log('doJwtPreflightCorsGetsRequest-resp->'+JSON.stringify(rta));
                res(rta) 
            })
            .catch((err) => { rej(err) });
    })
}