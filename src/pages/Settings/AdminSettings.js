import React from 'react';
import { Row, Col, Button,Form, ListGroup } from 'react-bootstrap';
import { doJwtPreflightCorsPostRequest,doJwtPreflightCorsGetRequest, isTokenOk } from '../../api_requests/requests';
import { IoIosPerson,IoMdConstruct, IoIosCloseCircle } from 'react-icons/io';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';

class AdminSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nickName: '',
            usuarioTraido: false,
            usuario: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.buscarUsuario = this.buscarUsuario.bind(this);
        this.habilitarInhabilitar = this.habilitarInhabilitar.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }
    checkInputs() {        
        if(this.state.nickName === null || this.state.nickName === '') {
            return false;
        }
        return true;
    }
    doSearch() {
        if (!isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsGetRequest('/usuarios/getuserdata/'+this.state.nickName, this.props.user.token)
                .then(rta => {
                    this.setState({ usuario: rta, usuarioTraido: true, usuarioComun: '' });
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                    this.setState({ showModal: true });
                });
        }
    }
    buscarUsuario(event) {
        event.preventDefault();
        if (this.checkInputs()) { this.doSearch()};
    }
    habilitarInhabilitar(event) {
        event.preventDefault();
        let estado = this.state.usuario.estadoCuenta === 'HABILIT' ? 'INHABIL' : 'HABILIT'
        var data = JSON.stringify({ idUser: this.state.usuario.idUsuario.toString(), estado: estado, tipo: 'estado' });
        if (!isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsPostRequest('/usuarios/update', data, false, this.props.user.token)
            .then(rta => {this.doSearch(JSON.stringify({ userCommon: this.state.usuario.apodo }))})
            .catch(err);
        }        
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }
    render() {
        return (
            <>
                <h5>Funciones de Administrador</h5>
                <h5>Buscar un usuario para modificar su estado (habilitado/inhabilitado):</h5>
                {this.state.usuarioTraido ?
                    <>
                        <ListGroup >
                            <ListGroup.Item>Apodo: {this.state.usuario.apodo}</ListGroup.Item>
                            <ListGroup.Item>
                                Estado: {this.state.usuario.estadoCuenta} &nbsp;&nbsp;
                                <Button onClick={this.habilitarInhabilitar} name="cancelPass" variant="dark" size="sm" className="smallButton mt-1" >
                                    <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Habilitar/Inhabilitar
                                </Button>
                            </ListGroup.Item>
                            <ListGroup.Item>Mail: {this.state.usuario.mail}</ListGroup.Item>
                            <ListGroup.Item>Fecha de ingreso: {this.state.usuario.fechaIngreso}</ListGroup.Item>
                            <ListGroup.Item>Facebook: {this.state.usuario.redSocial1}</ListGroup.Item>
                            <ListGroup.Item>Blog: {this.state.usuario.redSocial3}</ListGroup.Item>
                            <ListGroup.Item>Canal de Youtube: {this.state.usuario.redSocial3}</ListGroup.Item>
                        </ListGroup>
                        <Button onClick={() => this.setState({ usuarioTraido: false })} name="cancelPass" variant="dark" size="sm" className="smallButton mt-1" >
                            <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Limpiar busqueda
                        </Button>
                    </> :
                        <Form onSubmit={this.buscarUsuario} name="buscarUserForm">
                            <Form.Group as={Row} className="mt-2 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoIosPerson  style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Apodo del usuario</h5>
                                </Form.Label>
                                <Col sm={3}>
                                    <Form.Control onChange={this.handleChange} value={this.state.nickName} name="nickName" />
                                    <input type="hidden" name="tipo" value="userCommon" />
                                </Col>
                                <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                                    <IoMdConstruct style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Buscar
                                </Button>
                            </Form.Group>
                        </Form>
                }
                <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
            </> 
        )
    }
}

const mapDispatchToProps = {
    dispatchLogout: () => logout()
}
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);