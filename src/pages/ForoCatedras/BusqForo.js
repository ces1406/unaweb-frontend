import React from 'react';
import {NavLink, Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import {doJwtPreflightCorsPostRequest,doPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import Paginacion from '../../common_components/paginacion'
import { ITEMS_POR_PAG } from '../../globals';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import imgSeparador from '../../../static_files/imgs/separador.png';
import Modal from '../../common_components/Modal';
import volver from '../../../static_files/imgs/icons/return.svg';
import check from '../../../static_files/imgs/icons/check-simple.svg';
import materia from '../../../static_files/imgs/icons/listado-black.svg';
import catedra from '../../../static_files/imgs/icons/portada-black.svg';
import profesor from '../../../static_files/imgs/icons/profesor-black.svg';
import close from '../../../static_files/imgs/icons/close.svg';
import nube from '../../../static_files/imgs/icons/nube.svg';
import lupa from '../../../static_files/imgs/icons/lupa3.svg';
import MateriasField from '../../common_components/FormFields/materiaField';
import CatedrasField from '../../common_components/FormFields/catedraField';
import ProfesoresField from '../../common_components/FormFields/profesoresField';

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
                    elem.fecha = new Date(elem.fechaHora);
                    elem.erasable = false;
                    return elem
                })
                rtaAux.sort((a, b) => a.fecha.milisecs - b.fecha.milisecs)
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
                    <img src={imgSeparador} className='linea' />
                    <h1 className='titulo-1 txt-claro' style={{ textAlign: "center" }}>Resultados </h1>
                    {this.state.resultados.map((elem,i) =>
                        <div key={i}>
                            <img src={imgSeparador} className='linea' />
                            <div className='card-compuesta' >
                                <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={materia} className='icono-1 mr-0'/> Materia:&nbsp;{elem.materia}</div>
                                <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={catedra} className='icono-1 mr-0'/> C&aacute;tedra:&nbsp;{elem.catedra}</div>
                                <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={profesor} className='icono-1 mr-0'/>Profesor/es: {elem.profesores}</div>
                                <div className='titulo-card-1'>
                                    (creado el {elem.fecha.toLocaleString(undefined,{day:'numeric',month:'numeric',year:'numeric', hour:'2-digit',minute:'2-digit'})}hs)
                                </div>
                            </div>
                            <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}/foro/${elem.idCatedra}`}>
                                <button className="boton-oscuro ph-2 mv-1" type="submit" onClick={this.cleanBusq}>
                                    <img src={volver} className='icono-1'/>Ir al foro
                                </button>
                            </NavLink>
                            {this.props.user.rol === 'ADMI' ?
                                <form onSubmit={this.delForo} >
                                    <input type="hidden" name="idCatedra" value={elem.idCatedra} />
                                    <div>
                                            <button disabled={elem.erasable} value={elem.idCatedra} onClick={this.setErasable} className="boton-oscuro ph-2 mv-1 centrade" style={{ marginBottom: "0.2em" }}>
                                                <img src={close} className='icono-1 mr-1' />Eliminar foro
                                            </button>
                                    </div>
                                    {(elem.erasable) ?
                                        <>
                                            <div className='titulo-3 txt-claro centrade mt-1'>Si eliminas este foro se borrará todo su contenido y comentarios</div>
                                            <div style={{display:'flex', justifyContent:'center'}}>
                                                <button type="submit" className="boton-oscuro ph-2 mr-2" >
                                                    <img src={check} className='icono-1 mr-1' />Cofirmar
                                                </button>
                                                <button onClick={this.unsetErasable} value={elem.idCatedra} name="cancelRedSoc3" className="boton-oscuro" >
                                                    <img src={close} className='icono-1 mr-1'/>Cancelar
                                                </button>
                                            </div>
                                        </>
                                        : null}
                                </form>
                                : null}
                        </div>
                    )}
                    <div className='mv-3'>
                        <Paginacion cant={this.state.cantOpiniones} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                    </div>
                    <img src={imgSeparador} alt="imagen" className='linea' />
                    <div >
                        <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}`}>
                            <button className="boton-oscuro ph-2" type="submit" onClick={this.cleanBusq} >
                                <img src={volver} className='icono-1 mr-1'/>Volver a buscar
                            </button>
                        </NavLink>
                    </div>
                    <img src={imgSeparador} alt="imagen" className='linea' />
                </Template>
            )
                : (
                    <Template>
                        <img src={imgSeparador} className='linea' />
                        <h1 className='titulo-1 txt-claro'>Búscar foros de opiniones de cátedras/materias </h1>
                        <img src={imgSeparador} className='linea' />
                        <form onSubmit={this.handleSubmit}>
                            <MateriasField valor={this.state.materia} manejarCambio={this.handleChange}/>
                            <CatedrasField valor={this.state.catedra} manejarCambio={this.handleChange}/>
                            <ProfesoresField valor={this.state.profesora} manejarCambio={this.handleChange}/>
                            <button className="boton-oscuro ph-2 mv-2 centrade" type="submit" >
                                <img src={lupa} className='icono-1 mr-1' />Buscar
                            </button>
                        </form>
                        <img src={imgSeparador} alt="imagen" className='linea' />

                        {this.props.user.logged ?
                            <>
                                    <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}/createForo`}>
                                        <button className="boton-oscuro ph-2" type="submit" >
                                            <img src={nube} className='icono-1 mr-1' />Crear un foro de opiniones sobre una materia/catedra
                                        </button>
                                    </NavLink>
                                <img src={imgSeparador} alt="imagen" className='linea' />
                            </> : null
                        }

                        <Modal show={this.state.showModal} manejaCierre={() => this.setState({ showModal: false })} titulo='Búsqueda de opiniones' cuerpo={this.state.msj} />
                    </Template>
                )
            )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() };
export default connect(mapStateToProps, mapDispatchToProps)(BusqForo);