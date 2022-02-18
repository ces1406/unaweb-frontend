import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import check from '../../static_files/imgs/icons/check.svg';
import Modal from '../common_components/Modal';
import Template from '../common_components/pageTemplate';
import ApodoField from '../common_components/FormFields/apodoField';
import PassField from '../common_components/FormFields/passField';
import MailField from '../common_components/FormFields/mailField';
import FacebookField from '../common_components/FormFields/facebookField';
import SocialField from '../common_components/FormFields/socialField';
import YoutubeField from '../common_components/FormFields/youtubeField';
import ImageField from '../common_components/FormFields/imageField';
import {doSimpleCorsGetRequest,doSimpleCorsPostRequest} from '../api_requests/requests';
import imgSeparador from '../../static_files/imgs/separador.png';


class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrado: false,
            submitOk: false,
            avisoApodoRepe: false,
            apodo: '',
            mail: '',
            face: '',
            blog: '',
            youtube: '',
            pass1: '',
            pass2: '',
            avatar: '',
            msj: '',
            archivo: null,
            showModal: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.handleImg = this.handleImg.bind(this)
        this.checkApodo = this.checkApodo.bind(this)
    }
    handleImg(e) { this.setState({ archivo: e.target.files[0] }) }
    checkInputs() {
        if (this.state.apodo === null || this.state.apodo === '') {
            this.setState({ msj: 'completa el apodo' })
            return false;
        }
        if (this.state.mail === null || this.state.mail === '') {
            this.setState({ msj: 'completa el mail' })
            return false;
        }
        if (this.state.pass1 === null || this.state.pass1 === '' || this.state.pass2 === null || this.state.pass2 === '') {
            this.setState({ msj: 'debes completar las contraseñas' })
            return false;
        }
        if (this.state.pass1 !== this.state.pass2) {
            this.setState({ msj: 'ambas contraseñas deben coincidir' })
            return false;
        }
        if (this.state.pass1.length < 6 || this.state.pass1.length>8) {
            this.setState({ msj: 'la contraseña debe tener entre 6 y 8 caracteres' })
            return false;
        }
        return true;
    }
    handleShow() {
        this.setState({ showModal: true })
    }
    checkApodo() {
        if (this.state.apodo !== null || this.state.apodo !== '') {
            doSimpleCorsGetRequest('/usuarios/checknick/' + this.state.apodo )
                .then(rta => {
                    if (!rta.disponible) {
                        this.setState({ avisoApodoRepe: true})
                    }
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }                
    }
    handleClose() {
        this.setState({ showModal: false });
        if (this.state.submitOk) this.setState({ registrado: true });
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value})
    }
    handleAvatar(evento) {
        this.setState({ avatar: evento.target.files[0] })
    }
    handleSubmit(event) {
        event.preventDefault();
        var data = new FormData(event.target);
        if (this.checkInputs()) {
            doSimpleCorsPostRequest('/usuarios', data, false)
                .then(rta => {
                    this.setState({ submitOk: true });
                    this.setState({ msj: rta.msj })
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }
        this.handleShow(); 
    }
    render() {
        return this.state.registrado ? (<Redirect to="/" />) : (
            <Template>
                <div style={this.state.showModal?{backgroundColor:'rgba(20,20,20,0.74)'}:null}>
                
                    <div style={this.state.showModal?{zIndex:'-1',position:'relative'}:null}>
                    <h1 className='titulo-1 txt-claro centrade mv-2'>Registrarse en UNAweb</h1>
                    <img alt="" src={imgSeparador} className='linea' />
                    <form onSubmit={this.handleSubmit}>
                        <ApodoField sobreClick={()=>this.setState({avisoApodoRepe:false})} sobreBlur={this.checkApodo} manejarCambio={this.handleChange} apodo={this.state.apodo}/>
                        {this.state.avisoApodoRepe ? <h5 style={{color:'rgb(250,25,66)'}}>¡Atencion: ya existe un usuario con ese apodo!</h5> : null }
                        <MailField manejarCambio={this.handleChange} mail={this.state.mail} placeholder={'indica una dirección de mail para contactarte'}/>
                        <FacebookField manejarCambio={this.handleChange} redSoc1={this.state.redSoc1}/>
                        <SocialField manejarCambio={this.handleChange}redSoc2={this.state.redSoc2}/>
                        <YoutubeField manejarCambio={this.handleChange} redSoc3={this.state.redSoc3}/>
                        <ImageField/>
                        <PassField  manejarCambio={this.handleChange} pass={this.state.pass1} name='pass1'/>
                        <PassField  manejarCambio={this.handleChange} pass={this.state.pass2} name='pass2'/>                        
                        <br/>

                        <button type="submit" className="boton-oscuro pv-1 ph-2 mb-2 centrade"> <img className='icono-1' src={check} />Registrarse</button>
                        <img alt="" src={imgSeparador} className='linea' />
                        <br/>
                    </form>                
                    </div>
                    
                    <Modal show={this.state.showModal} manejaCierre={this.handleClose} titulo='Registrarse' cuerpo={this.state.msj} />
                
                </div>
            </Template>
        )
    }
}

export default RegisterForm;