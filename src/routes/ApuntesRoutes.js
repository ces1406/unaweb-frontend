import React from 'react';
import { Route} from 'react-router-dom';
import BusqApuntes from '../pages/Apuntes/BusqApuntes';
import SubidaApunte from '../pages/Apuntes/SubidaApunte';

export default class ApuntesRoutes extends React.Component {
    render() {
        return (
            <section>
                <Route exact path={'/secciones/' + this.props.sec + '/' + this.props.name}>
                    <BusqApuntes sec={this.props.sec} name={this.props.name} />
                </Route>
                <Route exact path={'/secciones/' + this.props.sec + '/' + this.props.name + '/subida'}>
                    <SubidaApunte sec={this.props.sec} name={this.props.name} />
                </Route>
            </section>
        )
    }
}