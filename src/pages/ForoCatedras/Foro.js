import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import Modal from '../../common_components/Modal';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import Paginacion from '../../common_components/paginacion'
import { ITEMS_POR_PAG } from '../../globals';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import Editor from '../../common_components/Editor';
import Comentario from '../../common_components/Comentario/Comentario';
import imgSeparador from '../../../static_files/imgs/separador.png';

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
            msj: '',
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
                        /* let fecha = new Date(elem.fechaHora);
                        elem.dia = fecha.getDate();
                        elem.mes = fecha.getMonth();
                        elem.anio = fecha.getFullYear();
                        elem.hora = fecha.getHours();
                        elem.min = fecha.getMinutes();
                        elem.milisecs = fecha.getTime(); */
                        elem.fecha = new Date(elem.fechaHora)
                        return elem
                    })
                    rtaAux.sort((a, b) => a.fecha.milisecs - b.fecha.milisecs)
                    return (rtaAux)
                })
                .then((rta) => {
                    this.setState({ resultados: rta })
                    return this.state.resultados
                })
                .then((rta) => {
                    return Promise.resolve((this.state.resultados.map( e => e.Usuario.dirImg )))
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
                    if(rta.size > 0){                       
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
                <img src={imgSeparador} alt="imagen" className='linea'/>
                <h1 className='titulo-1 txt-claro' style={{ textAlign: "center" }}>Opiniones</h1>
                <img src={imgSeparador} alt="imagen" className='linea'/>
                <h2 className='titulo-2 txt-claro'>Materia: {this.state.materia}</h2>
                <h2 className='titulo-2 txt-claro'>Catedra: {this.state.catedra}</h2>
                <h2 className='titulo-2 txt-claro'>Profesor/es: {this.state.profesor}</h2>
                <small className='txt-claro titulo-3'>(creado el {this.state.dia}/{this.state.mes + 1}/{this.state.anio}&nbsp;a las&nbsp;{this.state.hora}:{(this.state.min<10)?'0':null}{this.state.min}&nbsp;hs)</small>
                <img src={imgSeparador} alt="imagen" className='linea'/>
                <div style={{ backgroundColor: "rgba(20,20,32,0.65)", borderRadius: "1em" }}>
                {
                    this.state.resultados.map(coment =>
                        <div key={coment.idComentario}>                          
                            <Comentario user={{redSocial1:coment.Usuario.redSocial1,redSocial2:coment.Usuario.redSocial2,redSocial3:coment.Usuario.redSocial3,apodo:coment.Usuario.apodo}} 
                                avatarsrc={coment.src?coment.src:null} 
                                izq = {coment.fecha.toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric', hour:'2-digit',minute:'2-digit'})+'hs'}
                                cuerpo={coment.contenido}/>
                        </div>
                    )
                }
                {
                    (this.state.pagActiva === Math.ceil(this.state.cantComents / ITEMS_POR_PAG) || this.state.cantComents === 0) ?
                        <>
                            {this.props.user.logged ?
                                <div className="card-compuesta card-comentario">
                                        <Editor funcUpdate={this.ckeditChg} contenido={this.state.comentario} />
                                        <button variant="outline-info" onClick={this.handleSubmit} className="boton-oscuro pv-1 ph-2 centrade">Comentar</button>
                                </div>
                                : null}
                        </>
                        : null
                }

                <div className='mv-3'>
                    <Paginacion cant={this.state.cantComents} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                </div>
                <Modal show={this.state.showModal} manejaCierre={()=>this.setState({showModal:fals })} titulo='Foro de opiniones de una materia-catedra' cuerpo={this.state.msj}/>
                
            </div>
            </Template>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() }
export default connect(mapStateToProps, mapDispatchToProps)(Foro);