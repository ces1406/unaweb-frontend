import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../common_components/pageTemplate';
import log from '../../static_files/imgs/icons/in.svg';
import alerta from '../../static_files/imgs/icons/alerta.svg';
import idavuelta from '../../static_files/imgs/icons/idavuelta.svg';
import { connect } from 'react-redux';
import { login, setToken } from '../redux/actions/useractions'
import {doPreflightCorsPostRequest} from '../api_requests/requests';
import ApodoField from '../common_components/FormFields/apodoField';
import PassField from '../common_components/FormFields/passField';
import MailField from '../common_components/FormFields/mailField';
import Modal from '../common_components/Modal';
import imgSeparador from '../../static_files/imgs/separador.png';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            submitOk: false,
            by:false,
            olvido:false,
            apodo: '',
            pass: '',
            mail:'',
            msj: '',
            tam: window.innerWidth,
            showModal: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.recuperarPass = this.recuperarPass.bind(this);
    }
    componentDidMount() {
        window.addEventListener("resize", () => this.setState({ tam: window.innerWidth }));
    }
    checkInputs() {
        if (this.state.apodo === null || this.state.apodo === '') {
            this.setState({ msj: 'completa el apodo' })
            return false;
        }
        if (this.state.pass === null || this.state.pass === '' || this.state.pass2 === null || this.state.pass2 === '') {
            this.setState({ msj: 'debes completar las contraseñas' })
            return false;
        }
        if (this.state.pass.length < 6 || this.state.pass.length>8) {
            this.setState({ msj: 'la contraseña debe tener entre 6 y 8 caracteres' })
            return false;
        }
        return true;
    }
    handleShow() { 
        this.setState({ showModal: true }); 
    }
    handleClose() { 
        this.setState({ showModal: false });
        if (this.state.submitOk) this.setState({by:true});
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value})
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            doPreflightCorsPostRequest('/usuarios/login', JSON.stringify({apodo:this.state.apodo,password:this.state.pass}), false)
                .then(rta => {
                    this.props.dispatchLogin({ 
                        apodo: rta.usuario.apodo, 
                        rol: rta.usuario.rol, 
                        mail: rta.usuario.mail, 
                        redSoc1: rta.usuario.redSocial1, 
                        redSoc2: rta.usuario.redSocial2, 
                        redSoc3: rta.usuario.redSocial3, 
                        img: rta.usuario.dirImg 
                    });
                    this.props.dispatchSetToken(rta.token);
                    this.handleShow();
                    this.setState({ msj: rta.msj });      
                    this.setState({ submitOk: true });              
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                    this.handleShow();
                });
        }else{
            this.handleShow();
        } 
    }
    recuperarPass() {
        if (this.state.apodo === null || this.state.apodo === ''|| this.state.mail===null||this.state.mail.length<5) {
            this.setState({ msj: 'completa correctamente los datos' })       
            this.handleShow()   
        } else {
            doPreflightCorsPostRequest('/usuarios/recuperapass', JSON.stringify({ apodo: this.state.apodo,mail:this.state.mail}), false)
                .then(rta => {
                    this.setState({ rtaok: true,olvido:false });
                    this.setState({ msj: rta.msj,showModal:true })
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                    this.handleShow()
                });
        }        
    }
    render(){
        return this.state.by ? (<Redirect to="/" />) : (
            <Template>
                <div style={this.state.showModal?{backgroundColor:'rgba(20,20,20,0.74)'}:null}>
                    <div style={this.state.showModal?{zIndex:'-1',position:'relative'}:null}>
                    <h1 className='titulo-1 txt-claro centrade mv-2'>Iniciar sesión en UNAweb</h1>
                    <img alt="" src={imgSeparador} className='linea' />
                        <form onSubmit={this.handleSubmit}>
                            <ApodoField sobreClick={this.onClick} manejarCambio={this.handleChange} apodo={this.state.apodo} tam={this.state.tam}/>
                            <PassField manejarCambio={this.handleChange} pass={this.state.pass} name='pass' tam={this.state.tam}/>
                            <button className='boton-oscuro ph-2 pv-1 centrade' type="submit" >
                                <img className='icono-1 mr-1' src={log} />Iniciar Sesión
                            </button>
                            <img src={imgSeparador} alt="imagen" className='linea mv-2' />
                            {this.state.olvido?
                                null: 
                                <button className="boton-oscuro ph-2 pv-1 centrade" onClick={() => this.setState({ olvido: true })} >
                                    <img className='icono-1 mr-1' src={alerta}/> Olvide mi contraseña
                                </button>
                            }                            
                        </form>

                        {this.state.olvido ?
                            <form >
                                <h5>Indica tu apodo y el mail registrado en el sitio para recuperar la contraseña</h5>
                                <ApodoField sobreClick={this.onClick} manejarCambio={this.handleChange} apodo={this.state.apodo} tam={this.state.tam}/>   
                                <MailField manejarCambio={this.handleChange} mail={this.state.mail} placeholder={'a donde enviaremos la nueva contraseña'} tam={this.state.tam}/>  
                                <button className='boton-oscuro ph-2 pv-1 centrade' onClick={this.recuperarPass}>
                                    <img className='icono-1 mr-1' src={idavuelta} /> Recuperar
                                </button>
                            </form> : null
                        }

                    </div>
                    <Modal show={this.state.showModal} manejaCierre={this.handleClose} titulo='Ingresar' cuerpo={this.state.msj}/>
                </div>
            </Template>)
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchLogin: (usuario) => login(usuario),
    dispatchSetToken: (token) => setToken(token)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);