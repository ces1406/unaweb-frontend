import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import Home from '../pages/Home';
import SeccionesRoutes from './SeccionesRoutes';
import ApuntesRoutes from './ApuntesRoutes';
import ForoCatedrasRoutes from './ForoCatedrasRoutes';
import UserSettings from '../pages/Settings/UserSettings';
import Searching from '../pages/Searching';

function SomeSection({ match }) {
    switch (match.params.nameSec) {
        case 'Opiniones de cátedras y profesores':
            return <ForoCatedrasRoutes sec={match.params.idSec} name={match.params.nameSec} />
        case 'Apuntes':
            return <ApuntesRoutes sec={match.params.idSec} name={match.params.nameSec} />
        default:
            return <SeccionesRoutes sec={match.params.idSec} name={match.params.nameSec} />
    }
}

class MainRoutes extends React.Component {    
    render() {
        return (         
            <Router>   
                <Switch>                 
                    <Route path="/" exact> <Home /> </Route>
                    <Route path={"/secciones/:idSec/:nameSec"} component={SomeSection} />
                    <Route path="/register" component={Registration}></Route>
                    <Route path="/loggin" component={Login}></Route>
                    <Route path="/settings"><UserSettings/> </Route>
                    <Route path="/searching/:unaPalabra" component={props=><Searching palabra={props.match.params.unaPalabra}/>}></Route>              
                </Switch>                    
            </Router>  
        )
    }
}
export default MainRoutes