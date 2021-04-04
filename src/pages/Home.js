import React from 'react';
import Template from '../common_components/pageTemplate';
import { NavLink } from 'react-router-dom';
import {Card, CardColumns, Row, Col, Button, Badge} from 'react-bootstrap';
import imgSeparador from '../../static_files/imgs/separador.png';
import {doSimpleCorsGetRequest,isTokenOk} from '../api_requests/requests';
import UltimosComents from './UltimosComents';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/useractions'

class Home extends React.Component {
    constructor(props) {
        console.log('Home->constructor()')
        super(props);
        this.state = {
            secciones: []
        }
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        };
        this.getSections();
    }
    getSections() {
        doSimpleCorsGetRequest('/secciones')
        .then(rta=>{this.setState({secciones:rta.secciones});console.log('Secciones->rta: ',rta)})
        .catch(err=>console.log('Error - '+err));
    }
    render() {
        console.log('Home->render()->secciones: '+JSON.stringify(this.state.secciones))
        return (
            <Template >
                <Row>
                    <Col xs={8}>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                        <h1 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>Secciones</h1>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                        <CardColumns>
                            {this.state.secciones.map(sec =>
                                <Card key={sec.idSeccion}>
                                    <Card.Img variant="top" src={"./static_files/imgs/" + sec.img} />
                                    <Card.Body>
                                        <Card.Title style={{textAlign: 'center'}}>
                                            {sec.nombreSeccion}                                            
                                        </Card.Title>
                                        <Card.Text id="h3Dark">{sec.descripcion}</Card.Text>
                                        <div  style={{textAlign: 'center'}}>
                                        <Badge pill variant="secondary">
                                                {sec.idSeccion===9?'apuntes subidos':'temas creados'}: {sec.cantTemas} 
                                        </Badge>                                        
                                        </div>                                        
                                        <Card.Footer>
                                            <NavLink to={`/secciones/${sec.idSeccion}/${sec.nombreSeccion}`}>
                                                <Button variant="outline-primary" >Ir a la sección</Button>
                                            </NavLink>
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            )}
                        </CardColumns>
                    </Col>
                    <UltimosComents />
                </Row>
            </Template>
        )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() }

export default connect(mapStateToProps, mapDispatchToProps)(Home);