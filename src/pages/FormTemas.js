import React from 'react';
import { IoIosCreate, IoIosBook, IoIosBookmarks, IoMdListBox, IoMdBookmark} from 'react-icons/io';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import { Modal, Form, Row, Col, Button} from 'react-bootstrap';
import Editor from '../common_components/Editor';
import { Redirect } from 'react-router-dom';
import { doJwtPreflightCorsPostRequest, isTokenOk } from '../api_requests/requests';
import { logout } from '../redux/actions/useractions';

class FormTema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msjInicial: '',
            titulo: '',
            pal1: '',
            pal2: '',
            pal3: '',
            msj: '',
            showModal: false,
            showModalBye: false,
            bye: false,
            submitOk: false,
            temaCreated: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.ckeditChg = this.ckeditChg.bind(this);
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado ' });
            this.setState({ showModalBye: true })
            this.props.dispatchLogout();
        }
    }
    checkInputs() {
        if (this.state.titulo === null || this.state.titulo === '' || this.state.titulo.length > 140) { //dejo 40 caracteres (el max es 180) libres para escapar
            this.setState({ msj: 'corrige el titulo' })
            return false;
        }
        if (this.state.msjInicial === null || this.state.msjInicial === '' || this.state.msjInicial.length > 20000) {
            this.setState({ msj: 'corrige el mensaje inicial' })
            return false;
        }
        if (this.state.pal1 === null || this.state.pal1 === '' || this.state.pal2 === null || this.state.pal2 === '' || this.state.pal3 === null || this.state.pal3 === '') {
            this.setState({ msj: 'debes completar las palabras relacionadas al tema' })
            return false;
        }
        if (this.state.pal1.length > 24 || this.state.pal2.length > 24 || this.state.pal3.length > 24) {
            this.setState({ msj: 'las palabras no deben ser tan extensas' })
            return false;
        }
        return true;
    }
    handleShow() { this.setState({ showModal: true }) }
    handleClose() {
        this.setState({ showModal: false });
        if (this.state.submitOk) this.setState({ temaCreated: true });
    }
    ckeditChg(event) {
        this.setState({ msjInicial: event.editor.getData() });
    }
    handleChange(event) {
        switch (event.target.name) {
            case 'titulo':
                this.setState({ titulo: event.target.value });
                break;
            case 'pal1':
                this.setState({ pal1: event.target.value });
                break;
            case 'pal2':
                this.setState({ pal2: event.target.value });
                break;
            case 'pal3':
                this.setState({ pal3: event.target.value });
                break;
            default:
                break;
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModalBye: true })
            this.props.dispatchLogout();
        } else if (this.checkInputs()) {
            doJwtPreflightCorsPostRequest('/temas', JSON.stringify({
                idSec: this.props.idSec,
                msj: this.state.msjInicial,
                titulo: this.state.titulo,
                pal1: this.state.pal1,
                pal2: this.state.pal2,
                pal3: this.state.pal3,
            }), false, this.props.user.token)
                .then(rta => {
                    this.setState({ msj: rta.msj });
                    this.setState({ submitOk: true })
                })
                .catch(err => {
                    this.setState({ msj: 'No se pudo crear el tema, intenta mas tarde' });
                });
        }
        this.handleShow();
    }
    render() {
        //Ckeditor.editorUrl = '/ckeditor/ckeditor.js';
        return this.props.user.logged ? (
            this.state.temaCreated ?
                (<Redirect to={this.props.dir} />)
                :
                (
                    <Template>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group as={Row} className="mt-3 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoIosBook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Título del tema</h5>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control placeholder="Escoge un titulo que de una idea sobre lo que tratara el tema" maxLength={160} name="titulo" id="titulo" onChange={this.handleChange} value={this.state.titulo} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} >
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoMdListBox style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Mensaje inicial</h5>
                                </Form.Label>
                                <Col sm={8}>
                                    <Editor funcUpdate={this.ckeditChg} contenido={this.state.msjInicial} />
                                </Col>
                            </Form.Group>
                            <h5><IoIosBookmarks style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Indica tres palabras relacionadas al tema que iniciarás</h5>
                            <br />
                            <Form.Group as={Row}>
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoMdBookmark style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Palabra 1</h5>
                                </Form.Label>
                                <Col sm={4}>
                                    <Form.Control id="pal1" name="pal1" maxLength={20} onChange={this.handleChange} value={this.state.pal1} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoMdBookmark style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Palabra 2</h5>
                                </Form.Label>
                                <Col sm={4}>
                                    <Form.Control id="pal2" name="pal2" maxLength={20} onChange={this.handleChange} value={this.state.pal2} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoMdBookmark style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Palabra 3</h5>
                                </Form.Label >
                                <Col sm={4}>
                                    <Form.Control id="pal3" name="pal3" maxLength={20} onChange={this.handleChange} value={this.state.pal3} />
                                </Col>
                            </Form.Group>

                            <Button variant="outline-info" type="submit" > <IoIosCreate style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                            Crear el tema
                        </Button>
                            <br /><br />

                            <Modal show={this.state.showModal} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Iniciar un tema</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p style={{ color: 'rgb(5,6,28' }}>{this.state.msj}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={this.handleClose}>Ok</Button>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    </Template>
                )
        ) : (this.state.bye ?
            <Redirect to="/" />
            :
            <Modal show={this.state.showModalBye} onHide={() => this.setState({ showModalBye: false })}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear un Tema</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.setState({ showModalBye: false, bye: true })}>Ok</Button>
                </Modal.Footer>
            </Modal>
            )
    }
}

const mapDispatchToProps = { dispatchLogout: () => logout() }
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(FormTema);
