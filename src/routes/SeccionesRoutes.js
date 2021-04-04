import React from 'react';
import { Route} from 'react-router-dom';
import TemaSimple from '../pages/TemaSimple';
import SeccionSimple from '../pages/SeccionSimple';
import FormTemas from '../pages/FormTemas';

class SeccionesRoutes extends React.Component {
    render() {
        return (
            <section>
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}`}>
                    <SeccionSimple sec={this.props.sec} name={this.props.name} />
                </Route>
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}/:idTema`}
                    component={(props) => <TemaSimple id={props.match.params.idTema} name={this.props.name} herencia={props} />} />
                <Route exact path={`/secciones/${this.props.sec}/${this.props.name}/new/tema`}
                    component={()=><FormTemas dir={`/secciones/${this.props.sec}/${this.props.name}`} idSec={this.props.sec} />
                }/>
            </section>
        )
    }
}

export default SeccionesRoutes;