import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import Materias from '../../common_components/Materias';
import { Row, Col, Button, Form, Modal} from 'react-bootstrap';
import {IoIosSchool,IoIosApps,IoIosCloudUpload,IoIosReturnLeft,IoIosContacts} from 'react-icons/io';
import {doJwtPreflightCorsPostRequest,doPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';

class SubidaForo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            materia: '',
            catedra: '',
            profesor: '',
            subiendoForo: false,
            msj: '',
            showModal: false,
            showModalmsj: false,
            wrongsection: false,
            by:false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkInputs = this.checkInputs.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.checkSection = this.checkSection.bind(this)
    }
    componentDidMount() {
        this.checkSection();
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        }
    }
    checkSection() {
        doSimpleCorsGetRequest('/secciones/checksection/' + this.props.idSec + '/' + this.props.nomb)
            .then(rta => {
                this.setState({ wrongsection: !(rta.rta) })
            })
            .catch(err);
    }
    checkInputs() {
        if (this.state.materia === null || this.state.materia === '' || this.state.materia === 'Elige una materia de este listado') {
            this.setState({ msj: 'elige una materia' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.autor === null || this.state.profesor === '' || this.state.profesor.length > 100) {
            this.setState({ msj: 'completa el profesor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra === null || this.state.catedra === '' || this.state.catedra > 60) {
            this.setState({ msj: 'completa con una catedra' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            if (!isTokenOk(this.props.user.token)) {               
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/temas/cursos/',
                    JSON.stringify({ materia: this.state.materia, catedra: this.state.catedra, profesor: this.state.profesor})
                    , false, this.props.user.token)
                    .then(rta => {
                        this.setState({ materia: '', catedra: '', profesor: '' });
                        this.setState({ msj: rta.msg })
                        this.setState({ showModalmsj: true })
                    })
                    .catch(err => {
                        this.setState({ msj: err.message });
                        this.setState({ showModalmsj: true })
                    });
            }
        }
    }
    handleChange(e) {this.setState({[e.target.name]:e.target.value});}
    render() {
        return <>
        {this.state.wrongsection ? (<Redirect to="/" />) :
            (this.props.user.logged ? (
                <Template>
                    <img src="./static_files/imgs/separador.png"alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <h2 style={{ textAlign: "center" }}>Crear un foro de opiniones de una materia/catedra</h2>
                    <img src="./static_files/imgs/separador.png"alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <Form onSubmit={this.handleSubmit}>

                        <Form.Group as={Row} className="mt-5">
                            <Form.Label sm={4} className="mr-1 pt-1">
                                <h5><IoIosApps style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Materia</h5>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control as="select" name="materia" onChange={this.handleChange} value={this.state.materia} custom="true">
                                    {Materias.map((elem, index) => <option key={index}>{elem}</option>)}
                                </Form.Control>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-5">
                            <Form.Label sm={4} className="mr-1 pt-1">
                                <h5><IoIosSchool style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Catedra</h5>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control placeholder="indica la catedra" name="catedra" onChange={this.handleChange} value={this.state.catedra} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-5" >
                            <Form.Label sm={4} className="mr-1 pt-1">
                                <h5><IoIosContacts style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Profesor/es</h5>
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control placeholder="indica el/los profesor/es" name="profesor" onChange={this.handleChange} value={this.state.profesor} />
                            </Col>
                        </Form.Group>

                        <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" >
                            <IoIosCloudUpload style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Crear Foro
                    </Button>
                    </Form>
                    <img src="./static_files/imgs/separador.png"alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

                    <Col md={{ span: 4, offset: 4 }} >
                        <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}`}>
                            <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" block>
                                <IoIosReturnLeft style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Volver a buscar
                    </Button>
                        </NavLink>
                    </Col>

                    <img src="./static_files/imgs/separador.png"alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    
                </Template>
                ) :
                (this.state.by?
                    <Redirect to="/" />
                    :
                    <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false})}>
                        <Modal.Header closeButton>
                            <Modal.Title>Crear un foro de opiniones de una materia-catedra</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.setState({ showModal: false,by:true  })}>Ok</Button>
                        </Modal.Footer>
                    </Modal>                    
                )
            )
        }  
        <Modal show={this.state.showModalmsj} onHide={() => this.setState({ showModalmsj: false})}>
            <Modal.Header closeButton>
                <Modal.Title>Crear un foro de opiniones de una materia-catedra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => this.setState({ showModalmsj: false})}>Ok</Button>
            </Modal.Footer>
        </Modal>            
    </>
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() };
export default connect(mapStateToProps, mapDispatchToProps)(SubidaForo);