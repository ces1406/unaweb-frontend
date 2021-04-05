import React from 'react';
import Template from '../common_components/pageTemplate';
import { NavLink } from 'react-router-dom';
import {Card, CardColumns, Row, Col, Button, Badge} from 'react-bootstrap';
import imgSeparador from '../../static_files/imgs/separador.png';
import {doSimpleCorsGetRequest,isTokenOk} from '../api_requests/requests';
import UltimosComents from './UltimosComents';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/useractions';
import a from '../../static_files/imgs/1.png';
import b from '../../static_files/imgs/2.png';
import c from '../../static_files/imgs/3.png';
import d from '../../static_files/imgs/4.png';
import e from '../../static_files/imgs/5.png';
import f from '../../static_files/imgs/6.png';
import g from '../../static_files/imgs/7.png';
import h from '../../static_files/imgs/8.png';
import i from '../../static_files/imgs/9.png';
import j from '../../static_files/imgs/10.png';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secciones: [],
            imagenes: new Map()
        }
    }
    componentDidMount() {
        let mapa = new Map();
        mapa.set("1.png",a);
        mapa.set("2.png",b);
        mapa.set("3.png",c);
        mapa.set("4.png",d);
        mapa.set("5.png",e);
        mapa.set("6.png",f);
        mapa.set("7.png",g);
        mapa.set("8.png",h);
        mapa.set("9.png",i);
        mapa.set("10.png",j);
        this.setState({imagenes:mapa});
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        };
        this.getSections();
    }
    getSections() {
        doSimpleCorsGetRequest('/secciones')
        .then(rta=>{this.setState({secciones:rta.secciones})})
        .catch();
    }
    render() {
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
                                    <Card.Img variant="top" src={this.state.imagenes.get(sec.img)}/>
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