import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import { Button, Modal, Media, Image,Nav } from 'react-bootstrap';
import {IoMdText,IoIosPerson,IoLogoFacebook,IoLogoYoutube,IoIosGlobe} from 'react-icons/io';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import Paginacion from '../../common_components/paginacion'
import { ITEMS_POR_PAG } from '../../globals';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import Editor from '../../common_components/Editor';
import imgSeparador from '../../static_files/imgs/separador.png';

class Foro extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            idCatedra: props.id,
            pagActiva: 1,
            cantComents: 0,
            comentadoOk: false,
            materia: '',
            catedra: '',
            profesor: '',
            comentario: '',
            creandoForo: false,
            resultados: [],
            msj: ''
        }
        this.ckeditChg = this.ckeditChg.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cleanBusq = this.cleanBusq.bind(this);
        this.getOpinions = this.getOpinions.bind(this);
        this.getCatedra = this.getCatedra.bind(this);
        this.getUserAvatar = this.getUserAvatar.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.goToPage = this.goToPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        };
        this.getCatedra(this.state.idCatedra);
        this.getOpinions(this.state.idCatedra);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva) {
            this.getOpinions(this.state.id);
        }
    }
    getCatedra() {
        doSimpleCorsGetRequest('/temas/cursos/' + this.state.idCatedra)
            .then(rta => {
                let fecha = new Date(rta.fechaHora);
                this.setState({ materia: rta.materia, catedra: rta.catedra, profesor: rta.profesores, cantComents: rta.cantOpiniones,dia:fecha.getDate(),
                                mes:fecha.getMonth(),anio:fecha.getUTCFullYear(),hora:fecha.getHours(),min:fecha.getMinutes() })
            })
            .catch(err => {
                this.setState({ msj: err.message });
            });
    }
    getOpinions() {
        return new Promise((res, rej) => {
            doSimpleCorsGetRequest('/temas/cursos/opiniones/' + this.state.idCatedra + '/' + this.state.pagActiva + '/' + ITEMS_POR_PAG)
                .then(rta => {
                    let rtaAux = rta.map(elem => {
                        let fecha = new Date(elem.fechaHora);
                        elem.dia = fecha.getDate();
                        elem.mes = fecha.getMonth();
                        elem.anio = fecha.getFullYear();
                        elem.hora = fecha.getHours();
                        elem.min = fecha.getMinutes();
                        elem.milisecs = fecha.getTime();
                        return elem
                    })
                    rtaAux.sort((a, b) => a.milisecs - b.milisecs)
                    return (rtaAux)
                })
                .then((rta) => {
                    this.setState({ resultados: rta })
                    return this.state.resultados
                })
                .then((rta) => {
                    return Promise.resolve((this.state.resultados.map( e => e.dirImg )))
                })
                .then((rta) => {
                    let imgs = new Map();
                    rta.forEach((e,indice,vec)=>{
                        let item = imgs.get(e);
                        if(e!==null){
                            if (item==undefined){
                                imgs.set(e,[indice])
                            }else{
                                item.push(indice)
                            }
                        }                        
                    })
                    return imgs;
                })
                .then(async (rta) => {
                    let comentarios = this.state.resultados;
                    if(rta.length > 0){                        
                        for await (const e of rta.keys()){
                            let avatar = await this.getUserAvatar(e);
                            let item = rta.get(e);
                            for (const poss of item){
                                comentarios[poss].src = avatar.src;
                            }
                        }
                    }                    
                    return comentarios;
                })
                .then(async (rta) => {
                    this.setState({resultados:rta})
                    return Promise.resolve(true);
                })
                .catch((err) => {
                    rej('Error -getComments- en GET->/comments/idtema (' + err + ')')
                });
        })
    }
    getUserAvatar (name) {
        return new Promise(async (res, rej) => {
            var resp = await doSimpleCorsGetRequest('/usuarios/avatar/' + name);
            let src = URL.createObjectURL(resp);
            res({ name, src });
        })
    }
    cleanBusq() {
        this.setState({ resultados: [], busqHecha: false });
    }
    checkInputs() {
        if (this.state.materia === 'Elige una materia de este listado') {
            this.setState({ msj: 'elige una materia' })
            return false;
        }
        if (this.state.catedra.length > 60) {
            this.setState({ msj: 'completa la catedra correctamente' })
            return false;
        }
        if (this.state.profesor.length > 100) {
            this.setState({ msj: 'completa el profesor correctamente' })
            return false;
        }
        return true;
    }
    ckeditChg(event) {
        this.setState({ comentario: event.editor.getData() });
    }
    goToPage(nro) {
        this.setState({ pagActiva: nro })
    }
    nextPage() {
        let activa = this.state.pagActiva + 1
        this.setState({ pagActiva: activa });
    }
    prevPage() {
        this.setState({ pagActiva: this.state.pagActiva - 1 })
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();

            } else {
                doJwtPreflightCorsPostRequest('/temas/cursos/opinion', JSON.stringify({
                    idCatedra: this.state.idCatedra, contenido: this.state.comentario
                }), false, this.props.user.token)
                    .then(rta => {
                        this.setState({ resultados: rta, comentadoOk: true })
                    })
                    .catch(err => {
                        this.setState({ msj: err.message });
                    });
            }
        }
    }
    render() {
        //Ckeditor.editorUrl = '/ckeditor/ckeditor.js';
        return this.state.comentadoOk ? (<Redirect to={this.props.herencia.location.pathname} />) : (
            <Template>
                <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                <h1 style={{ textAlign: "center" }}>Opiniones</h1>
                <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                <h2>Materia: {this.state.materia}</h2>
                <h2>Catedra: {this.state.catedra}</h2>
                <h2>Profesor/es: {this.state.profesor}</h2>
                <small>(creado el {this.state.dia}/{this.state.mes + 1}/{this.state.anio}&nbsp;a las&nbsp;{this.state.hora}:{(this.state.min<10)?'0':null}{this.state.min}&nbsp;hs)</small>
                <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                <div style={{ backgroundColor: "rgba(20,20,32,0.65)", borderRadius: "1em" }}>
                {
                    this.state.resultados.map(coment =>
                        <Media className="mr-2 mt-2 mb-2" key={coment.idComentario} style={{ display: "inline-flex !important", backgroundColor: "rgba(40,42,52,0.85)", borderRadius: "1em" }}>
                            <div>
                            {coment.src?<Image rounded width={64} height={64} className="mt-2 ml-2 mr-2 mb-2" src={coment.src} alt="usuario" />
                            :   <Button variant="outline-info" size="sm" className="mt-2 ml-2 mr-2 mb-2 pb-0 pt-0">
                                    <IoIosPerson className="mb-0 mt-0 pb-0 pt-0" size={34}/>
                                </Button>
                            }
                            {coment.redSoc1?<Nav.Link href={coment.redSoc1} className="mb-0 mt-0 pb-0 pt-0">
                                                <Button variant="outline-info" size="sm" className="mt-0 ml-0 mr-0 mb-0 pb-0 pt-0">
                                                    <IoLogoFacebook className="mb-0 mt-0 pb-0 pt-0" size={14} /></Button>
                                            </Nav.Link>:null}
                                            {coment.redSoc2?<Nav.Link href={coment.redSoc2} className="mb-0 mt-0 pb-0 pt-0">
                                                <Button variant="outline-info" size="sm" className="mt-0 ml-0 mr-0 mb-0 pb-0 pt-0">
                                                    <IoIosGlobe className="mb-0 mt-0 pb-0 pt-0" size={14} />
                                                </Button>
                                            </Nav.Link>:null}
                                            {coment.redSoc3?<Nav.Link href={coment.redSoc3} className="mb-0 mt-0 pb-0 pt-0">
                                                <Button variant="outline-info" size="sm" className="mt-0 ml-0 mr-0 mb-0 pb-0 pt-0">
                                                    <IoLogoYoutube className="mb-0 mt-0 pb-0 pt-0" size={14} />
                                                </Button>
                                            </Nav.Link>:null}
                            </div>
                            <Media.Body>
                                <div id="infoUser">
                                    <IoMdText style={{ fontSize: 26 }} /> {coment.apodo}&nbsp;
                                </div>
                                <div id='rtaComentario' dangerouslySetInnerHTML={{ __html: coment.contenido }} />
                                <div id="infoFech" className="mt-3">
                                (el {coment.dia}/{coment.mes + 1}/{coment.anio}&nbsp;a las&nbsp;{coment.hora}:{(coment.min<10)?'0':null}{coment.min}&nbsp;hs)
                                </div>
                            </Media.Body>
                        </Media>
                    )
                }
                {
                    (this.state.pagActiva === Math.ceil(this.state.cantComents / ITEMS_POR_PAG) || this.state.cantComents === 0) ?
                        <>
                            {this.props.user.logged ?
                                <Media className="mr-2 mt-2 mb-2" style={{ backgroundColor: "rgba(40,42,52,0.5)", borderRadius: "1em" }}>
                                    <Media.Body className="pr-2 pl-4 pt-2 pb-2">
                                        <Editor funcUpdate={this.ckeditChg} contenido={this.state.comentario} />
                                        <Button variant="outline-info" onClick={this.handleSubmit} className="mr-2 mt-3 ml-5 mb-2">Comentar</Button>
                                    </Media.Body>
                                </Media>
                                : null}
                        </>
                        : null
                }

                <div>
                    <Paginacion cant={this.state.cantComents} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                </div>
                <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Foro de opiniones de una materia-catedra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({ showModal: false })}>Ok</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            </Template>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() }
export default connect(mapStateToProps, mapDispatchToProps)(Foro);