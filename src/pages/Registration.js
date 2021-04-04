import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {  IoIosCreate } from 'react-icons/io';
import { Form, Button, Modal } from 'react-bootstrap';
import Template from '../common_components/pageTemplate';
import ApodoField from '../common_components/FormFields/apodoField';
import PassField from '../common_components/FormFields/passField';
import MailField from '../common_components/FormFields/mailField';
import FacebookField from '../common_components/FormFields/facebookField';
import SocialField from '../common_components/FormFields/socialField';
import YoutubeField from '../common_components/FormFields/youtubeField';
import ImageField from '../common_components/FormFields/imageField';
import {doSimpleCorsGetRequest,doSimpleCorsPostRequest} from '../api_requests/requests';


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
            showModal: false
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
            doSimpleCorsPostRequest('/user', data, false)
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
                <Form onSubmit={this.handleSubmit}>
                    <ApodoField sobreClick={()=>this.setState({avisoApodoRepe:false})} sobreBlur={this.checkApodo} manejarCambio={this.handleChange} apodo={this.state.apodo}  />
                    {this.state.avisoApodoRepe ? <h5 style={{color:'rgb(250,25,66)'}}>¡Atencion: ya existe un usuario con ese apodo!</h5> : null }
                    <MailField manejarCambio={this.handleChange} mail={this.state.mail} placeholder={'indica una dirección de mail para contactarte'}/>
                    <FacebookField manejarCambio={this.handleChange} mail={this.state.redSoc1}/>
                    <SocialField manejarCambio={this.handleChange} mail={this.state.redSoc2}/>
                    <YoutubeField manejarCambio={this.handleChange} mail={this.state.redSoc3}/>
                    <ImageField manejarCambio={this.handleImg}/>
                    <PassField  manejarCambio={this.handleChange} pass={this.state.pass1} name='pass1' />
                    <PassField  manejarCambio={this.handleChange} pass={this.state.pass2} name='pass2'/>

                    <Button variant="outline-info" type="submit" className="mb-3 mt-4">
                        <IoIosCreate style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Registrarse
                    </Button>

                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton> <Modal.Title>Registrarse</Modal.Title> </Modal.Header>
                        <Modal.Body> <p style={{ color: 'rgb(5,6,28' }}>{this.state.msj}</p> </Modal.Body>
                        <Modal.Footer> <Button variant="primary" onClick={this.handleClose}>Ok</Button> </Modal.Footer>
                    </Modal>
                </Form>
            </Template>
        )
    }
}

export default RegisterForm;