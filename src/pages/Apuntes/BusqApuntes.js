import React from 'react';
import Template from '../../common_components/pageTemplate';
import { logout } from '../../redux/actions/useractions';
import { connect } from 'react-redux';
import {Col, Button} from 'react-bootstrap';
import { NavLink, Redirect } from 'react-router-dom';
import { IoIosReturnLeft } from 'react-icons/io';
import {doJwtPreflightCorsPostRequest,doPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import Resultados from './ResultBusqApuntes';
import FormBusq from './FormBusqApuntes';
import {ITEMS_POR_PAG} from '../../globals';
import Paginacion from '../../common_components/paginacion';
import imgSeparador from '../../../static_files/imgs/separador.png';

class BusqApuntes extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            titulo: '',
            materia: '',
            catedra: '',
            autor: '',
            busqHecha: false,
            subiendoApte: false,
            resultados: [],
            pagActiva: 1,
            cantApuntes: 0,
            showModal: false,
            msj: '',
            wrongsection: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.checkInputs = this.checkInputs.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.cleanBusq = this.cleanBusq.bind(this)
        this.getApuntes = this.getApuntes.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.checkSection = this.checkSection.bind(this)
        this.delApunte = this.delApunte.bind(this)
        this.setErasable = this.setErasable.bind(this)
        this.unsetErasable = this.unsetErasable.bind(this)
    }
    componentDidMount() {
        this.checkSection();
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) { this.props.dispatchLogout(); }
    }
    checkSection() {
        doSimpleCorsGetRequest ('/secciones/checksection/' + this.props.sec + '/' + this.props.name)
            .then(rta => {
                this.setState({ wrongsection: !(rta.rta) })
            })
            .catch();
    }
    goToPage(nro) { this.setState({ pagActiva: nro }) }
    nextPage() {
        let activa = this.state.pagActiva + 1
        this.setState({ pagActiva: activa });
    }
    prevPage() { this.setState({ pagActiva: this.state.pagActiva - 1 }) }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva) {
            this.getApuntes({ titulo: this.state.titulo, materia: this.state.materia, catedra: this.state.catedra, autor: this.state.autor })
        }
    }
    cleanBusq() { this.setState({ resultados: [], busqHecha: false, titulo: '', materia: '', catedra: '', autor: '' }) }
    checkInputs() {
        if (this.state.titulo.length > 100) {
            this.setState({ msj: 'completa el titulo correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.autor.length > 100) {
            this.setState({ msj: 'completa el autor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra > 60) {
            this.setState({ msj: 'completa la catedra correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleChange(e) { 
        this.setState({[e.target.name]:e.target.value}); 
    }
    getApuntes(obj) {
        doPreflightCorsPostRequest('/temas/apuntes/search/' + this.state.pagActiva + '/' + ITEMS_POR_PAG, JSON.stringify(obj), false)
            .then(rta => {
                this.setState({ cantApuntes: rta.length, busqHecha: true });
                return rta;
            })
            .then(rta=>{
                let rtaAux = rta.map(elem => {
                    let fecha = new Date(elem.fechaSubida)
                    elem.dia = fecha.getDate();
                    elem.mes = fecha.getMonth();
                    elem.anio = fecha.getFullYear();
                    elem.hora = fecha.getHours();
                    elem.min = fecha.getMinutes();
                    elem.milisecs = fecha.getTime();
                    elem.erasable = false;
                    return elem
                })
                rtaAux.sort((a, b) => a.milisecs - b.milisecs);
                this.setState({resultados:rtaAux})
            })
            .catch(err => {
                this.setState({ msj: err.message });
            });
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            this.getApuntes({ titulo: this.state.titulo, materia: this.state.materia, catedra: this.state.catedra, autor: this.state.autor })
        }
    }
    setErasable(e){
        let indice = this.state.resultados.findIndex(elem=>{
            return (elem.idApunte===parseInt(e.target.value))
        })
        let apunte = this.state.resultados[indice]
        apunte.erasable=true;
        let aux1 = this.state.resultados.slice(0,indice)
        let aux2 = this.state.resultados.slice(indice+1)
        let aux3 = aux1.concat(apunte).concat(aux2)
        this.setState({resultados:aux3})
    }
    unsetErasable(e){
        let indice = this.state.resultados.findIndex(elem=>{
            return (elem.idApunte===parseInt(e.target.value))
        })
        let apunte = this.state.resultados[indice]
        apunte.erasable=false;
        let aux1=this.state.resultados.slice(0,indice)
        let aux2=this.state.resultados.slice(indice+1)
        let aux3 = aux1.concat(apunte).concat(aux2)
        this.setState({resultados:aux3})
    }
    delApunte(event) {
        event.preventDefault();
        var valor = event.target[0].defaultValue;
        var data = JSON.stringify({ idApunte: valor });
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            doJwtPreflightCorsPostRequest( '/deleteapunte', data, false, this.props.user.token)
                .then(rta => {
                        let index= this.state.resultados.findIndex(elem=>{
                            return elem.idApunte===valor
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
    render() {
        return this.state.wrongsection ? (<Redirect to="/" />) :
            (this.state.busqHecha ? (
                <Template>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    
                    <Resultados resultados={this.state.resultados} setErasable={this.setErasable} unsetErasable={this.unsetErasable} />
                    
                    <div className='mt-3'>
                        <Paginacion cant={this.state.cantApuntes} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                    </div>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                    <Col md={{ span: 4, offset: 4 }} >
                        <NavLink to={`/secciones/10/Apuntes`}>
                            <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" onClick={this.cleanBusq} block>
                                <IoIosReturnLeft style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Volver a la búsqueda
                            </Button>
                        </NavLink>
                    </Col>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                </Template>)
                :
                (<Template>
                    <FormBusq titulo={this.state.titulo} autor={this.state.autor} materia={this.state.materia} catedra={this.state.catedra}
                                handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
                </Template>
                )
            )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchLogout: () => logout()
}
export default connect(mapStateToProps, mapDispatchToProps)(BusqApuntes);