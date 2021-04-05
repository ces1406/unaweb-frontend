import React from 'react';
import {NavLink, Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import Materias from '../../common_components/Materias';
import { Row, Col, Button, Form, Modal, Media,Container } from 'react-bootstrap';
import {IoIosSchool,IoIosApps,IoMdSearch,IoIosCloseCircle,IoMdCheckmarkCircle,IoIosCloudUpload,IoIosReturnLeft,IoIosContacts} from 'react-icons/io';
import {doJwtPreflightCorsPostRequest,doPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import Paginacion from '../../common_components/paginacion'
import { ITEMS_POR_PAG } from '../../globals';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import imgSeparador from '../../static_files/imgs/separador.png';

class BusqForo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            materia: '',
            catedra: '',
            profesor: '',
            busqHecha: false,
            creandoForo: false,
            resultados: [],
            cantOpiniones: 0,
            pagActiva: 1,
            showModal: false,
            msj: '',
            wrongsection: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.checkInputs = this.checkInputs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.cleanBusq = this.cleanBusq.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.getForos = this.getForos.bind(this)
        this.checkSection = this.checkSection.bind(this)
        this.delForo = this.delForo.bind(this)
        this.setErasable = this.setErasable.bind(this)
        this.unsetErasable = this.unsetErasable.bind(this)
    }
    componentDidMount() {        
        this.checkSection();
        if ( this.props.user.token !== undefined) {
            if (!isTokenOk(this.props.user.token)) {
                /*this.setState({ msj: 'Tu sesión de usuario ha expirado' });
                this.setState({ showModal: true })*/
                this.props.dispatchLogout();
            }
        }
    }
    goToPage(nro) { this.setState({ pagActiva: nro }) }
    nextPage() {
        let activa = this.state.pagActiva + 1
        this.setState({ pagActiva: activa });
    }
    prevPage() { this.setState({ pagActiva: this.state.pagActiva - 1 }) }
    cleanBusq() { this.setState({ resultados: [], busqHecha: false })  }
    checkSection() {
        doSimpleCorsGetRequest('/secciones/checksection/' + this.props.idSec + '/' + this.props.nomb)
            .then(rta => {
                this.setState({ wrongsection: !(rta.rta) })
            })
            .catch();
    }
    checkInputs() {
        if (this.state.materia === null || this.state.materia === '' || this.state.materia === 'Elige una materia de este listado') {
            this.setState({ msj: 'elige una materia' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra.length > 60) {
            this.setState({ msj: 'completa la catedra correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.profesor.length > 100) {
            this.setState({ msj: 'completa el profesor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleChange(e) {this.setState({[e.target.name]:e.target.value}); }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva) {
            this.getForos({ materia: this.state.materia, catedra: this.state.catedra, profesor: this.state.profesor })
        }
    }
    getForos(obj) {
        doPreflightCorsPostRequest('/temas/cursos/search/' + this.state.pagActiva + '/' + ITEMS_POR_PAG, JSON.stringify(obj), false)
            .then(rta => {
                this.setState({cantOpiniones: rta.length, busqHecha: true })
                let rtaAux = rta.map(elem => {
                    let fecha = new Date(elem.fechaHora)
                    elem.dia = fecha.getDate();
                    elem.mes = fecha.getMonth();
                    elem.anio = fecha.getFullYear();
                    elem.hora = fecha.getHours();
                    elem.min = fecha.getMinutes();
                    elem.milisecs = fecha.getTime();
                    elem.erasable = false;
                    return elem
                })
                rtaAux.sort((a, b) => a.milisecs - b.milisecs)
                this.setState({resultados:rtaAux})
            })
            .catch(err => {
                this.setState({ msj: 'no se encontraron resultados', showModal: true });
            });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            this.getForos({ materia: this.state.materia, catedra: this.state.catedra, profesor: this.state.profesor })
        }
    }
    delForo(event) {
        event.preventDefault();
        var valor = event.target[0].defaultValue
        var data = JSON.stringify({ idForo: valor })
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsPostRequest('/cursos/delforo', data, false, this.props.user.token)
                .then(rta => {
                        let index= this.state.resultados.findIndex(elem=>{
                            return elem.idCatedra===valor
                        })
                        let vecAux = this.state.resultados;
                        vecAux.splice(index, 1);
                        this.setState({resultados:vecAux})
                    })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }
    }
    setErasable(e){
        let indice = this.state.resultados.findIndex(elem=>{
            return (elem.idCatedra===parseInt(e.target.value));
        })
        let foro = this.state.resultados[indice];
        foro.erasable=true;
        let aux1 = this.state.resultados.slice(0,indice);
        let aux2 = this.state.resultados.slice(indice+1);
        let aux3 = aux1.concat(foro).concat(aux2);
        this.setState({resultados:aux3})
    }
    unsetErasable(e){
        let indice = this.state.resultados.findIndex(elem=>{
            return (elem.idCatedra===parseInt(e.target.value))
        });
        let foro = this.state.resultados[indice];
        foro.erasable=false;
        let aux1=this.state.resultados.slice(0,indice);
        let aux2=this.state.resultados.slice(indice+1);
        let aux3 = aux1.concat(foro).concat(aux2);
        this.setState({resultados:aux3})
    }
    render() {
        return this.state.wrongsection ? (<Redirect to="/" />) :
            (this.state.busqHecha ? (
                <Template>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <h1 style={{ textAlign: "center" }}>Resultados </h1>
                    {this.state.resultados.map(elem =>
                        <>
                            <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                            <Media className="mr-2 mt-2 mb-2" key={elem.idCatedra} style={{ display: "inline-flex !important", backgroundColor: "rgba(40,42,52,0.5)", borderRadius: "1em" }}>
                                <Media.Body>
                                    <div id='rtaComentario'><IoIosApps style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Materia: {elem.materia}
                                    </div>
                                    <div id='rtaComentario'><IoIosSchool style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Catedra: {elem.catedra}
                                    </div>
                                    <div id='rtaComentario'><IoIosContacts style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Profesor/es: {elem.profesores}
                                    </div>
                                    <div id='rtaComentario'><IoIosContacts style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    (creado el {elem.dia}/{elem.mes}/{elem.anio} - {elem.hora}:{(elem.min<10)?'0':null}{elem.min} hs)
                                    </div>
                                </Media.Body>
                            </Media>
                            <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}/foro/${elem.idCatedra}`}>
                                <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" onClick={this.cleanBusq}>
                                    <IoIosReturnLeft style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Ir al foro
                                </Button>
                            </NavLink>
                            {this.props.user.rol === 'ADMI' ?
                                <Form onSubmit={this.delForo} >
                                    <input type="hidden" name="idCatedra" value={elem.idCatedra} />
                                    <Container>
                                        <Row className="justify-content-md-center">
                                            <Button disabled={elem.erasable} value={elem.idCatedra} variant="dark" size="sm" onClick={this.setErasable} className="smallButton mt-1" style={{ marginBottom: "0.2em" }}>
                                                <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Eliminar foro
                                            </Button>
                                        </Row>
                                    </Container>
                                    {(elem.erasable) ?
                                        <>
                                            <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                                            <h6 style={{ textAlign: "center" }}>Si eliminas este foro se borrará todo su contenido y comentarios</h6>
                                            <Row className="justify-content-md-center">
                                                <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                                                    <IoMdCheckmarkCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cofirmar
                                                </Button>&nbsp;&nbsp;
                                                <Button onClick={this.unsetErasable} value={elem.idCatedra} name="cancelRedSoc3" variant="dark" size="sm" className="smallButton mb-2 mt-1" >
                                                    <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cancelar
                                                </Button>
                                            </Row>
                                        </>
                                        : null}
                                </Form>
                                : null}
                        </>
                    )}
                    <div className='mt-3'>
                        <Paginacion cant={this.state.cantOpiniones} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                    </div>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <Col md={{ span: 4, offset: 4 }} >
                        <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}`}>
                            <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" onClick={this.cleanBusq} block>
                                <IoIosReturnLeft style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Volver a buscar
                    </Button>
                        </NavLink>
                    </Col>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                </Template>
            )
                : (
                    <Template>
                        <h1 style={{ textAlign: "center" }}>Búscar foros de opiniones de cátedras/materias </h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group as={Row} className="mt-5">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoIosApps style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Materia</h5>
                                </Form.Label>
                                <Col sm={6}>
                                    <Form.Control as="select" name="materia" onChange={this.handleChange} value={this.state.materia} custom="true" >
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
                                    <Form.Control placeholder="indica el/les autor/es" name="profesor" onChange={this.handleChange} value={this.state.profesor} />
                                </Col>
                            </Form.Group>
                            <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" >
                                <IoMdSearch style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Buscar
                        </Button>
                        </Form>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

                        {this.props.user.logged ?
                            <>
                                <Col md={{ span: 4, offset: 4 }} >
                                    <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}/createForo`}>
                                        <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" block>
                                            <IoIosCloudUpload style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Crear un foro de opiniones sobre una materia/catedra
                                        </Button>
                                    </NavLink>
                                </Col>
                                <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                            </> : null
                        }

                        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Búsqueda de opiniones</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={() => this.setState({ showModal: false })}>Ok</Button>
                            </Modal.Footer>
                        </Modal>
                    </Template>
                )
            )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() };
export default connect(mapStateToProps, mapDispatchToProps)(BusqForo);