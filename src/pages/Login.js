import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../common_components/pageTemplate';
import { Form, Button, Modal, Row } from 'react-bootstrap';
import { IoMdWarning, IoIosCreate, IoIosRepeat } from 'react-icons/io';
import { connect } from 'react-redux';
import { login, setToken } from '../redux/actions/useractions'
import {doPreflightCorsPostRequest} from '../api_requests/requests';
import ApodoField from '../common_components/FormFields/apodoField';
import PassField from '../common_components/FormFields/passField';
import MailField from '../common_components/FormFields/mailField';
import Pop from '../common_components/Pop';

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            submitOk: false,
            by:false,
            olvido:false,
            apodo: '',
            pass: '',
            //apodOlvido: '',
            mail:'',
            msj: '',
            showModal: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.recuperarPass = this.recuperarPass.bind(this);
    }
    checkInputs() {
        console.log('chequeando inputs')
        if (this.state.apodo === null || this.state.apodo === '') {
            this.setState({ msj: 'completa el apodo' })
            return false;
        }
        if (this.state.pass === null || this.state.pass === '' || this.state.pass2 === null || this.state.pass2 === '') {
            this.setState({ msj: 'debes completar las contraseñas' })
            return false;
        }
        if (this.state.pass.length < 6 || this.state.pass.length>8) {
            console.log('mal passs')
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
        console.log('haciendo handleChange a->'+e.target.name)
        this.setState({[e.target.name]:e.target.value})
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            doPreflightCorsPostRequest('/usuarios/login', JSON.stringify({apodo:this.state.apodo,password:this.state.pass}), false)
                .then(rta => {
                    console.log('login-rta:',rta)
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
                    console.log('->Error; ',err)
                    this.setState({ msj: err.message });
                    this.handleShow();
                });
        }else{
            this.handleShow();
        } 
    }
    recuperarPass() {
        console.log('recuperarPass-0')
        if (this.state.apodo === null || this.state.apodo === ''|| this.state.mail===null||this.state.mail.length<5) {
            console.log('recuperarPass-1')
            this.setState({ msj: 'completa correctamente los datos' })       
            this.handleShow()   
        } else {
            console.log('recuperarPass-2')
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
                <Form onSubmit={this.handleSubmit}>
                    <ApodoField sobreClick={this.onClick} manejarCambio={this.handleChange} apodo={this.state.apodo}/>
                    <PassField manejarCambio={this.handleChange} pass={this.state.pass} name='pass'/>

                    <Button variant="outline-info" type="submit" className="mb-3 mt-4">
                        <IoIosCreate style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Iniciar Sesión
                    </Button>
                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    {
                    this.state.olvido?
                    null: <Button onClick={() => this.setState({ olvido: true })} variant="dark" size="sm" className="smallButton mt-1" >
                            <IoMdWarning style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Olvide mi contraseña
                        </Button>
                    }
                    <Pop showModal={this.state.showModal} handleClose={this.handleClose} msj={this.state.msj} />
                </Form>
                {
                    this.state.olvido ?
                        <Form className="mt-4">
                            <h5 className="mb-3">Indica tu apodo y el mail registrado en el sitio para recuperar la contraseña</h5>
                            <ApodoField sobreClick={this.onClick} manejarCambio={this.handleChange} apodo={this.state.apodo}/>   
                            <MailField manejarCambio={this.handleChange} mail={this.state.mail} placeholder={'a donde enviaremos la nueva contraseña'}/>  
                            <Button onClick={this.recuperarPass} variant="dark" size="sm" className="smallButton mt-1" >
                                <IoIosRepeat style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Recuperar
                            </Button>
                        </Form> : null
                }
            </Template>)
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchLogin: (usuario) => login(usuario),
    dispatchSetToken: (token) => setToken(token)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);