import React from 'react';
//import { Row, Col, Button,Form, ListGroup } from 'react-bootstrap';
import { doJwtPreflightCorsPostRequest,doJwtPreflightCorsGetRequest, isTokenOk } from '../../api_requests/requests';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import imgSeparador from '../../../static_files/imgs/separador.png';
import usuario from '../../../static_files/imgs/icons/usuario2.svg';
import idavuelta from '../../../static_files/imgs/icons/idavuelta.svg';
import lupa from '../../../static_files/imgs/icons/lupa3.svg';

class AdminSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nickName: '',
            usuarioTraido: false,
            usuario: null,
            tam: window.innerWidth
        }
        this.handleChange = this.handleChange.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.buscarUsuario = this.buscarUsuario.bind(this);
        this.habilitarInhabilitar = this.habilitarInhabilitar.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }
    componentDidMount() {
        window.addEventListener("resize", () => this.setState({ tam: window.innerWidth }));
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
            .catch();
        }        
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }
    render() {
        return (
            <>
                <div className='txt-claro titulo-2'>Funciones de Administrador</div>
                <h4 className='txt-claro titulo-3'>Buscar un usuario para modificar su estado (habilitado/inhabilitado):</h4>
                {this.state.usuarioTraido ?
                    <>
                        <div className='card-compuesta'>
                            <h5 className='titulo-3'>Apodo: {this.state.usuario.apodo}</h5>
                            <div className='titulo-3'>
                                Estado: {this.state.usuario.estadoCuenta}
                                <button onClick={this.habilitarInhabilitar} name="cancelPass" className="boton-oscuro" >
                                    <img className='icono-1' src={idavuelta}/> Habilitar/Inhabilitar
                                </button>
                            </div>
                            <h5 className='titulo-3'>Mail: {this.state.usuario.mail}</h5>
                            <h5 className='titulo-3'>Fecha de ingreso: {this.state.usuario.fechaIngreso}</h5>
                            <h5 className='titulo-3'>Facebook: {this.state.usuario.redSocial1}</h5>
                            <h5 className='titulo-3'>Blog: {this.state.usuario.redSocial2}</h5>
                            <h5 className='titulo-3'>Canal de Youtube: {this.state.usuario.redSocial3}</h5>
                        </div>
                        <button onClick={() => this.setState({ usuarioTraido: false })} name="cancelPass" className="boton-oscuro" >
                            <img className='icono-1' src={idavuelta}/>Limpiar busqueda
                        </button>
                    </> :
                        <form onSubmit={this.buscarUsuario} name="buscarUserForm">
                            <div className="txt-claro campo-formu mv-3  mt-0">
                                <div className='etiqueta'>
                                    <img className='icono-1' src={usuario}/>
                                    <label className='titulo-2 mr-1 ml-0'>Apodo del usuario</label>
                                </div>
                                <input className='inputo' onChange={this.handleChange} value={this.state.nickName} name="nickName" />
                                <input type="hidden" name="tipo" value="userCommon" />
                            </div>
                            <button type="submit" className="boton-oscuro" >
                                <img className='icono-1' src={lupa}/> Buscar
                            </button>
                        </form>
                }
                <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
            </> 
        )
    }
}

const mapDispatchToProps = {
    dispatchLogout: () => logout()
}
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);