import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import TituloField from '../../common_components/FormFields/tituloField';
import AutorField from '../../common_components/FormFields/autorField';
import MateriaField from '../../common_components/FormFields/materiaField';
import CatedraField from '../../common_components/FormFields/catedraField';
import LinkField from '../../common_components/FormFields/linkField';
import { Col, Button, Form, Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { IoIosCloudUpload, IoIosReturnLeft} from 'react-icons/io';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import { logout } from '../../redux/actions/useractions';

class SubidaApunte extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            titulo: '',
            materia: '',
            catedra: '',
            autor: '',
            link: '',
            subiendoApte: false,
            msj: '',
            showModal: false,
            wrongsection: false,
            by: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        }
    }
    checkSection() {
        doSimpleCorsGetRequest('/checksection/' + this.props.sec + '/' + this.props.name)
            .then(rta => {
                this.setState({ wrongsection: !(rta.rta) })
            })
            .catch();
    }
    checkInputs() {
        if (this.state.materia === null || this.state.materia === '' || this.state.materia === 'Elige una materia de este listado') {
            this.setState({ msj: 'Debes elegir una materia' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra.length >60) {
            this.setState({ msj: 'Completa la catedra correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.titulo === null || this.state.titulo === '' || this.state.titulo.length > 100) {
            this.setState({ msj: 'Debes completar el titulo correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.autor === null || this.state.autor === '' || this.state.autor.length > 100) {
            this.setState({ msj: 'Debes completar el autor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra > 60) {
            this.setState({ msj: 'El nombre de catedra es muy extenso' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.link === null || this.state.link === '' || this.state.link.length > 170) {
            this.setState({ msj: 'completa con un enlace al apunte correcto' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/temas/apuntes',JSON.stringify({
                    titulo: this.state.titulo, materia: this.state.materia, catedra: this.state.catedra,
                    autor: this.state.autor, link: this.state.link
                }), false, this.props.user.token)
                    .then(rta => {
                        this.setState({ titulo: '', materia: '', catedra: '', autor: '', link: '' });
                        this.setState({ msj: rta.msg })
                        this.setState({ showModal: true })
                    })
                    .catch(err => {
                        this.setState({ msj: err.message });
                        this.setState({ showModal: true })
                    });
            }
        }
    }
    handleChange(e) {this.setState({[e.target.name]:e.target.value}) }
    render() {
        return this.state.wrongsection ? (<Redirect to="/" />) : (
            this.props.user.logged ? 
                (<Template>
                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <h2 style={{ textAlign: "center" }}>Subir un Apunte</h2>
                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <Form onSubmit={this.handleSubmit}>
                        <TituloField valor={this.state.titulo} manejarCambio={this.handleChange}/>
                        <AutorField valor={this.state.autor} manejarCambio={this.handleChange}/>
                        <MateriaField valor={this.state.materia} manejarCambio={this.handleChange}/>
                        <CatedraField valor={this.state.catedra} manejarCambio={this.handleChange}/>
                        <LinkField valor={this.state.link} manejarCambio={this.handleChange}/>
                        <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" >
                            <IoIosCloudUpload style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Publicar
                        </Button>
                    </Form>
                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

                    <Col md={{ span: 4, offset: 4 }} >
                        <NavLink to={`/secciones/9/Apuntes`}>
                            <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" block>
                                <IoIosReturnLeft style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Volver a la búsqueda
                    </Button>
                        </NavLink>
                    </Col>

                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

                    <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Subir apunte</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.setState({ showModal: false })}>Ok</Button>
                        </Modal.Footer>
                    </Modal>
                </Template>)
                :
                (this.state.by ?
                    <Redirect to="/" />
                    :
                    <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                        <Modal.Header closeButton>
                            <Modal.Title>Crear un foro de opiniones de una materia-catedra</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.setState({ showModal: false, by: true })}>Ok</Button>
                        </Modal.Footer>
                    </Modal>
                )
        )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchLogout: () => logout()
}
export default connect(mapStateToProps, mapDispatchToProps)(SubidaApunte);