import React from 'react';
import { Route } from 'react-router-dom';
import BusqForo from '../pages/ForoCatedras/BusqForo';
import UploadForo from '../pages/ForoCatedras/SubidaForo';
import Foro from '../pages/ForoCatedras/Foro';

export default class ForoCatedrasRoutes extends React.Component {
    render() {
        return (
            <section>
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}`}>
                    <BusqForo idSec={this.props.sec} nomb={this.props.name} />
                </Route>
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}/createForo`}>
                    <UploadForo idSec={this.props.sec} nomb={this.props.name} />
                </Route>
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}/foro/:idForo`}
                    component={(props) => <Foro id={props.match.params.idForo} herencia={props} />} >
                </Route>
            </section>
        )
    }
}