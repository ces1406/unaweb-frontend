import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import { doSimpleCorsGetRequest, doJwtPreflightCorsPostRequest, isTokenOk } from '../api_requests/requests';
import Paginacion from '../common_components/paginacion';
import { ITEMS_POR_PAG } from '../globals';
import { logout } from '../redux/actions/useractions'
import { Button, Media, Image, Modal, Row, Nav,Form,Container } from 'react-bootstrap';
import Editor from '../common_components/Editor';
import InitialComent from '../common_components/InitialComent';
import { IoMdText, IoIosPerson, IoLogoFacebook, IoLogoYoutube,IoMdCheckmarkCircle,IoIosCloseCircle, IoIosGlobe} from 'react-icons/io';

class TemaSimple extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            tema: {},
            userpost: {},
            cantComents: 0,
            pagActiva: 1,
            comments: [],
            comentario: '',
            comentadoOk: false,
            avatar: '',
            showModal: false,
            msj: '',
            imgs: [],
            srcs: [],
            wrongtem: false,
            delComent:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkInput = this.checkInput.bind(this);
        this.ckeditChg = this.ckeditChg.bind(this);
        this.getUserAvatar = this.getUserAvatar.bind(this);
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.setErasable = this.setErasable.bind(this)
        this.unsetErasable = this.unsetErasable.bind(this)
        this.delComent = this.delComent.bind(this)
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        };
        this.getTema(this.state.id)
            .then(async (rta) => {
                return (rta.rta.Usuario.dirImg?this.getUserAvatar(rta.rta.Usuario.dirImg):null)
            })
            .then(async (rta0) => {
                this.setState({ avatar: rta0 })
                return await this.getComments(this.props.id);
            })
            .catch((err) => {
                return ('Error en ComponentDidMount() (' + err + ')')
            });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva||this.state.delComent) {
            this.getComments(this.state.id);
            this.setState({delComent:false})
        }
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
    getTema (idTema) {
        return new Promise((res, rej) => {
            doSimpleCorsGetRequest('/temas/' + idTema)
                .then(resp => {
                    this.setState({ tema:{
                        idTema:resp.rta.idTema,
                        titulo:resp.rta.titulo,
                        comentarioInicial:resp.rta.comentarioInicial,
                        palabraClave1:resp.rta.palabraClave1,
                        palabraClave2:resp.rta.palabraClave2,
                        palabraClave3:resp.rta.palabraClave3,
                        fechaCreacion:resp.rta.fechaCreacion,
                        idSeccion:resp.rta.idSeccion
                    } });
                    this.setState({ userpost: resp.rta.Usuario })
                    this.setState({ cantComents: resp.rta.cantComents })
                    res(resp)
                })
                .catch(err );
        })
    }
    ckeditChg(event) {
        this.setState({ comentario: event.editor.getData() });
    }
    checkInput() {
        if (this.state.comentario.trim() === null || this.state.comentario === '' || this.state.comentario.length === 0) {
            return false;
        }
        if (this.state.comentario.length > 20000) {
            return false;
        }
        return true;
    }
    getUserAvatar (name) {
        return new Promise(async (res, rej) => {
            var resp = await doSimpleCorsGetRequest('/usuarios/avatar/' + name)//this.getUserAvatar(rta.userpost.dirImg)
            let src = URL.createObjectURL(resp);
            res({ name, src });
        })
    }
    getComments (id) {
        return new Promise((res, rej) => {
            doSimpleCorsGetRequest('/temas/comentarios/' + id + '/' + this.state.pagActiva + '/' + ITEMS_POR_PAG)
                .then(rta => {
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
                    return (rtaAux)
                })
                .then((rta) => {
                    this.setState({ comments: rta })
                    return this.state.comments
                })
                .then((rta) => {
                    // Devuelvo un array con las dirImg de cada comentario:
                    return Promise.resolve((this.state.comments.map(e =>e.Usuario.dirImg)))
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
                    let comentarios = this.state.comments;
                    for await (const e of rta.keys()){
                        let avatar = await this.getUserAvatar(e);
                        let item = rta.get(e);
                        for (const poss of item){
                            comentarios[poss].src = avatar.src;
                        }
                    }
                    return comentarios;
                })
                .then(async (rta) => {
                    this.setState({comments:rta})
                    return Promise.resolve(true)
                })
                .catch((err) => {
                    rej('Error -getComments- en GET->/comments/idtema (' + err + ')')
                });
        })
    }
    handleSubmit() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else if (this.checkInput()) {
            doJwtPreflightCorsPostRequest('/temas/comentar', JSON.stringify({ 
                    idTema: this.props.id, 
                    comentario: this.state.comentario }), false, this.props.user.token)
                .then(rta => {
                    this.setState({ submitOk: true, comentadoOk: true, msj: rta.msj });
                })
                .catch(err => {
                    this.setState({ msj: 'No se pudo comentar el tema, intenta nuevamente' });
                });
        }
    }
    setErasable(e){
        let indice = this.state.comments.findIndex(elem=>{
            return (elem.idComentario===parseInt(e.target.value))
        })
        let coment = this.state.comments[indice]
        coment.erasable=true;
        let aux1 = this.state.comments.slice(0,indice)
        let aux2 = this.state.comments.slice(indice+1)
        let aux3 = aux1.concat(coment).concat(aux2)
        this.setState({comments:aux3})
    }
    delComent(event) {
        event.preventDefault();
        var valor = event.target[0].defaultValue
        var data = JSON.stringify({ idComent: valor })
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsPostRequest('/tema/deletecoment', data, false, this.props.user.token)
                .then(rta => {
                        let index= this.state.comments.findIndex(elem=>{
                            return elem.idComentario===valor
                        })
                        let vecAux = this.state.comments;
                        vecAux.splice(index, 1);
                        this.setState({comments:vecAux,delComent:true})
                    })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }
    }
    unsetErasable(e){
        let indice = this.state.comments.findIndex(elem=>{
            return (elem.idComentario===parseInt(e.target.value))
        })
        let coment = this.state.comments[indice]
        coment.erasable=false;
        let aux1=this.state.comments.slice(0,indice)
        let aux2=this.state.comments.slice(indice+1)
        let aux3 = aux1.concat(coment).concat(aux2)
        this.setState({comments:aux3})
    }
    render() {
        return this.state.comentadoOk ? (<Redirect to={this.props.herencia.location.pathname} />) : (
            <Template>
                <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                <h2 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>
                    Sección {this.props.name}
                </h2>
                <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                <h3>Tema {this.state.tema.titulo}</h3>
                <div role="region" className="py-20">
                    <Media style={{ backgroundColor: "rgba(20,20,32,0.65)", borderRadius: "1em" }}>
                        <InitialComent userpost={this.state.userpost} avatarsrc={this.state.avatar.src}/>
                        <Media.Body>
                            <IoMdText style={{ color:"rgb(251, 200, 80)" }} size={30} className="mb-0 pb-0"/> 
                            <div id='comentarioInicial' className="mb-1 mt-1" dangerouslySetInnerHTML={{ __html: this.state.tema.comentarioInicial }} />
                            <div id="infoFech"> (el {(new Date(this.state.tema.fechaCreacion)).getDate()}-{(new Date(this.state.tema.fechaCreacion)).getMonth() + 1}-{(new Date(this.state.tema.fechaCreacion)).getFullYear()}
                                &nbsp;a las&nbsp;{(new Date(this.state.tema.fechaCreacion)).getHours()}:{(new Date(this.state.tema.fechaCreacion)).getMinutes()}hs)
                            </div>
                            {
                                this.state.comments.map(coment =>
                                    <div key={coment.idComentario} >
                                    <Media className="mr-2 mt-2 mb-2" style={{ display: "inline-flex !important", backgroundColor: "rgba(40,42,52,0.85)", borderRadius: "1em" }}>
                                        <div  className="text-center">
                                            {coment.src?<Image rounded width={64} height={64} className="mt-2 ml-2 mr-2 mb-0" src={coment.src} alt="usuario" />:
                                                            <IoIosPerson style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={34}/>
                                                }
                                            <div id="infoUser" className="mb-0 mt-0 pb-0 pt-0">{coment.Usuario.apodo}</div>
                                            {coment.Usuario.redSocial1?<Nav.Link href={coment.Usuario.redSocial1} className="mb-0 mt-0 pb-0 pt-0">
                                                    <IoLogoFacebook style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={18} />
                                            </Nav.Link>:null}
                                            {coment.Usuario.redSocial2?<Nav.Link href={coment.Usuario.redSocial2} className="mb-0 mt-0 pb-0 pt-0">
                                                    <IoIosGlobe style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={18} />
                                            </Nav.Link>:null}
                                            {coment.Usuario.redSocial3?<Nav.Link href={coment.Usuario.redSocial} className="mb-0 mt-0 pb-0 pt-0">
                                                    <IoLogoYoutube style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={18} />
                                            </Nav.Link>:null}
                                        </div>                                          
                                        <Media.Body>
                                            <IoMdText style={{ color:"rgb(251, 200, 80)" }} size={26} className="mb-0 pb-0"/> 
                                            <div id='rtaComentario' dangerouslySetInnerHTML={{ __html: coment.contenido }} />
                                            <div id="infoFech" className="mt-3">
                                                (el {coment.dia}-{coment.mes + 1}-{coment.anio}&nbsp;a las&nbsp;{coment.hora}:{coment.min}&nbsp;hs)
                                            </div>
                                        </Media.Body>                                                                                
                                    </Media>
                                    {this.props.user.rol === 'ADMI' ?
                                    <div style={{clear: "left!important"}}>
                                        <Form onSubmit={this.delComent} >
                                            <input type="hidden" name="idCatedra" value={coment.idComentario} />
                                            <Container>
                                                <Row className="justify-content-md-center">
                                                    <Button disabled={coment.erasable} value={coment.idComentario} variant="dark" size="sm" onClick={this.setErasable} className="smallButton mt-1" style={{ marginBottom: "0.2em" }}>
                                                        <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Eliminar comentario
                                                    </Button>
                                                </Row>
                                            </Container>
                                            {(coment.erasable) ?
                                                <>                                                    
                                                    <Row className="justify-content-md-center">
                                                        <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                                                            <IoMdCheckmarkCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cofirmar
                                                        </Button>&nbsp;&nbsp;
                                                        <Button onClick={this.unsetErasable} value={coment.idComentario} name="cancelRedSoc3" variant="dark" size="sm" className="smallButton mb-2 mt-1" >
                                                            <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cancelar
                                                        </Button>
                                                    </Row>
                                                </>
                                            : null}
                                            <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '3.2ex' }} />
                                        </Form>
                                        </div>
                                    : null}
                                    </div>
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
                                            : null
                                        }
                                    </>
                                    : null
                            }
                            <div>
                                <Paginacion cant={this.state.cantComents} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                            </div>
                        </Media.Body>
                    </Media>
                </div>
                <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Comentar tema</Modal.Title>
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
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() }

export default connect(mapStateToProps, mapDispatchToProps)(TemaSimple);