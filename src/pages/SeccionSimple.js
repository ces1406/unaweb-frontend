import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import Modal from '../common_components/Modal';
import AdminTemas from './AdminTemas';
import { doSimpleCorsGetRequest, doJwtPreflightCorsPostRequest, isTokenOk } from '../api_requests/requests';
import Paginacion from '../common_components/paginacion';
import { ITEMS_POR_PAG } from '../globals';
import { logout } from '../redux/actions/useractions';
import imgSeparador from '../../static_files/imgs/separador.png';
import docu from '../../static_files/imgs/icons/documento.svg';
import calend from '../../static_files/imgs/icons/calendario-black.svg';
import portada from '../../static_files/imgs/icons/portada-black.svg';
import coments from '../../static_files/imgs/icons/coments-black.svg';

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
            .then(rta=>{})
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
                    elem.fecha = new Date(elem.fechaCreacion)
                    /* let fecha = new Date(elem.fechaCreacion)
                    elem.dia = fecha.getDate();
                    elem.mes = fecha.getMonth();
                    elem.anio = fecha.getFullYear();
                    elem.milisecs = fecha.getTime();
                    return elem */
                    return elem;
                })
                this.setState({ cantTemas: rta.cantTemas })                
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
                <div>
                    <img alt="" src={imgSeparador} className='linea' /> 
                    <h1 className='titulo-1 txt-claro'> Secci&oacute;n {this.props.name}</h1>
                    <img alt="" src={imgSeparador} className='linea' />
                        {
                            this.props.user.logged ?
                                <div style={{display:'flex',marginBlock:'1em',marginRight:'auto',marginLeft:'auto',justifyContent:'center',alignItems:'stretch'}}>
                                    <NavLink to={`/secciones/${this.props.sec}/${this.props.name}/new/tema`}style={{backgroundColor:'rgba(24, 33, 37,0.77)'}}>
                                        <button className='boton-oscuro ph-2 pv-1'> <img className='icono-0' src={docu} /> Iniciar un Tema </button>
                                    </NavLink>
                                </div>
                                : null
                        }
                        {this.state.temas.length === 0 ? <h2 className='titulo-2 txt-claro'>Todavía no hay temas creados.</h2> : <h2 className='titulo-2 txt-claro'>Temas creados :</h2>}
                        
                        {
                            this.state.temas.map(tem =>
                                <div key={tem.idTema} style={{marginBlock:'0.8em'}}>
                                <NavLink className="card-compuesta" to={`/secciones/${tem.idSeccion}/${this.props.name}/${tem.idTema}`}>                               
                                        <div className="titulo-2 txt-oscuro centrade"> <img className='icono-0 mr-0' src={portada}/>{tem.titulo}</div>
                                        <div className="texto-comentario-lg txt-oscuro" dangerouslySetInnerHTML={{ __html: tem.comentarioInicial }} />
                                        <div className='card-pie txt-oscuro'>                                            
                                            <div className='titulo-card-1' style={{display:'flex',alignItems:'center'}}><img className='icono-1' src={calend}/>
                                                creado el {tem.fecha.toLocaleString(undefined,{day:'numeric',month:'long',year:'numeric'})}
                                            </div>                                  
                                            <div className='pastilla pv-1 ph-1 texto-comentario-sm'><img className='icono-0' src={coments}/> comentarios hechos: {tem.cantComentarios} </div>
                                        </div>
                                </NavLink>
                                {this.props.user.rol === 'ADMI' ?     
                                    <AdminTemas onsubmit={this.delTema} tema={tem} marcar={this.setErasable} desmarcar={this.unsetErasable}/>
                                    :null
                                }
                                </div>
                            )                                
                        }    
                        
                    <div className='mv-3'>
                        <Paginacion cant={this.state.cantTemas} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                    </div>
                </div>
                <Modal show={this.state.showModal} manejaCierre={this.handleClose} titulo={this.props.name} cuerpo={this.state.msj}/>
            </Template>
        )
    }
}
const mapDispatchToProps = { dispatchLogout: () => logout() }
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(SeccionSimple);