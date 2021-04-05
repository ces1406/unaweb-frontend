import React from 'react';
import { IoIosQuote, IoMdQuote, IoIosCreate, IoMdListBox, IoMdCalendar} from 'react-icons/io'
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import { Modal, Row, Col, Button, Card, Badge} from 'react-bootstrap';
import AdminTemas from './AdminTemas';
import { doSimpleCorsGetRequest, doJwtPreflightCorsPostRequest, isTokenOk } from '../api_requests/requests';
import Paginacion from '../common_components/paginacion';
import { ITEMS_POR_PAG } from '../globals';
import { logout } from '../redux/actions/useractions'

class SeccionSimple extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDelete: false,
            msj: '',
            showModal: false,
            pagActiva: 1,
            cantTemas: 0,
            temas: [],
            wrongsection: false,
        }
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.delTema = this.delTema.bind(this)
        this.checkSection = this.checkSection.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.setErasable = this.setErasable.bind(this)
        this.unsetErasable = this.unsetErasable.bind(this)
    }
    componentDidMount() {
        if ( this.props.user.logged) {
            if (!isTokenOk(this.props.user.token)) {
                this.setState({ msj: 'Tu sesión de usuario ha expirado' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            }
        }
        this.checkSection();
        this.getTemas(this.props.sec);
    }
    handleClose() { this.setState({ showModal: false }); }
    delTema(event) {
        event.preventDefault();
        var valor = event.target[0].defaultValue
        var data = JSON.stringify({ idTema: valor })
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsPostRequest('/temas/deletetema', data, false, this.props.user.token)
                .then(rta => {
                    let index= this.state.temas.findIndex(elem=>{
                        return elem.idTema===valor
                    })
                    let vecAux = this.state.temas;
                    vecAux.splice(index, 1);
                    this.setState({temas:vecAux})
                })
                .catch(err => {
                    this.setState({ msj: err.message });
                });
        }
    }
    checkSection() {
        doSimpleCorsGetRequest('/secciones/checksection/' + this.props.sec + '/' + this.props.name)
            .then(rta => { this.setState({ wrongsection: !(rta.rta) }) })
            .catch(err => {  });
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva) {
            this.getTemas(this.props.sec)
        }
    }
    goToPage(nro) { this.setState({ pagActiva: nro }); }
    nextPage() {
        let activa = this.state.pagActiva + 1
        this.setState({ pagActiva: activa });
    }
    prevPage() { this.setState({ pagActiva: this.state.pagActiva - 1 }); }
    getTemas(idSec) {
        doSimpleCorsGetRequest('/secciones/' + idSec + '/' + this.state.pagActiva + '/' + ITEMS_POR_PAG)
            .then(rta => {
                let rtaAux = rta.temas.map(elem => {
                    let fecha = new Date(elem.fechaCreacion)
                    elem.dia = fecha.getDate();
                    elem.mes = fecha.getMonth();
                    elem.anio = fecha.getFullYear();
                    elem.milisecs = fecha.getTime();
                    return elem
                })
                this.setState({ cantTemas: rta.temas.length })                
                return rtaAux.sort((a, b) => a.milisecs - b.milisecs)                
            })
            .then(rta=>{              
                rta.forEach(el=>{
                    el.erasable=false
                })
                return rta                               
            })
            .then(rta=>{
                this.setState({ temas: rta }) 
            })
            .catch();
    }
    setErasable(e){
        let indice = this.state.temas.findIndex(elem=>{
            return (elem.idTema===parseInt(e.target.value))
        })
        let tema = this.state.temas[indice]
        tema.erasable=true;
        let aux1 = this.state.temas.slice(0,indice)
        let aux2 = this.state.temas.slice(indice+1)
        let aux3 = aux1.concat(tema).concat(aux2)
        this.setState({temas:aux3})
    }
    unsetErasable(e){
        let indice = this.state.temas.findIndex(elem=>{
            return (elem.idTema===parseInt(e.target.value))
        })
        let tema = this.state.temas[indice]
        tema.erasable=false;
        let aux1=this.state.temas.slice(0,indice)
        let aux2=this.state.temas.slice(indice+1)
        let aux3 = aux1.concat(tema).concat(aux2)
        this.setState({temas:aux3})
    }
    render() {
        return this.state.wrongsection ? (<Redirect to="/" />) : (
            <Template>
                <Row>
                    <Col xs={12}>
                        <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                        <h1 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>{this.props.name}</h1>
                        <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                        {
                            this.props.user.logged ?
                                <Col md={{ span: 6, offset: 3 }} >
                                    <NavLink to={`/secciones/${this.props.sec}/${this.props.name}/new/tema`}style={{backgroundColor:'rgba(24, 33, 37,0.77)'}}>
                                    <Button size="lg" variant="secondary" className="mt-3 mb-3" block  >                                        
                                            <IoIosCreate style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                            Iniciar un Tema                                    
                                    </Button>
                                    </NavLink>
                                </Col>
                                : null
                        }
                        {this.state.temas.length === 0 ? <h5>Todavía no hay temas creados.</h5> : <h5>Temas creados :</h5>}
                        <Col xs={{span:10,offset:1}} >
                        {
                            this.state.temas.map(tem =>
                                <Card className="mb-1" style={{ backgroundColor:  "rgba(40,42,52,0.85)", borderRadius: "0.4em",borderColor:"rgb(10,10,12)"}} key={tem.idTema}>                                    
                                    <Card.Header className="text-center pb-0">
                                        <Card.Title as="h5" style={{color: "rgb(233, 212, 134)"}}>
                                            <IoIosQuote size={14}/>&nbsp;{tem.titulo}&nbsp;<IoMdQuote size={14}/> 
                                        </Card.Title>                                            
                                    </Card.Header>
                                    <Card.Body className="mb-0 pb-0 mt-0">
                                        <Card.Text id="comentarioInicial" dangerouslySetInnerHTML={{ __html: tem.comentarioInicial }} className="mb-0 pb-0 mt-0" ></Card.Text>
                                            <small className="text-muted text-right mb-0 pb-0 mt-0" style={{color: "rgb(233, 212, 134)"}} >                                                                                      
                                                (  creado el <IoMdCalendar className="mr-1 " size={18}/>{tem.dia}/{tem.mes + 1}/{tem.anio} )
                                                </small>
                                            <div>
                                            <Badge pill variant="secondary">
                                                comentarios hechos: {tem.cantComentarios} 
                                            </Badge> 
                                            </div>
                                        </Card.Body>                                        
                                        <Card.Footer className="text-center mb-1 pb-0 mt-0">                                        
                                            <NavLink to={`/secciones/${tem.idSeccion}/${this.props.name}/${tem.idTema}`} >
                                                <Button variant="outline-info" size="sm"><IoMdListBox className="mr-1 pb-1" size={20}/>Ir al tema</Button>
                                            </NavLink>
                                            {this.props.user.rol === 'ADMI' ?     
                                                <AdminTemas onsubmit={this.delTema} tema={tem} marcar={this.setErasable} desmarcar={this.unsetErasable}/>
                                                :null
                                            }
                                        </Card.Footer>
                                    </Card>
                                )                                
                            }    
                            </Col>                        
                    </Col>
                    <div>
                        <Paginacion cant={this.state.cantTemas} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                    </div>
                </Row>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ color: 'rgb(5,6,28' }}>{this.state.msj}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose}>Ok</Button>
                    </Modal.Footer>
                </Modal>
            </Template>
        )
    }
}
const mapDispatchToProps = { dispatchLogout: () => logout() }
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(SeccionSimple);