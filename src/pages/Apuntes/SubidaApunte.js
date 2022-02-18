import React from 'react';
import { connect } from 'react-redux';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import { NavLink, Redirect } from 'react-router-dom';
import Modal from '../../common_components/Modal';
import Template from '../../common_components/pageTemplate';
import TituloField from '../../common_components/FormFields/tituloField';
import AutorField from '../../common_components/FormFields/autorField';
import MateriaField from '../../common_components/FormFields/materiaField';
import CatedraField from '../../common_components/FormFields/catedraField';
import LinkField from '../../common_components/FormFields/linkField';
import { logout } from '../../redux/actions/useractions';
import imgSeparador from '../../../static_files/imgs/separador.png';
import volver from '../../../static_files/imgs/icons/return.svg';
import nube from '../../../static_files/imgs/icons/nube.svg';

class SubidaApunte extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            titulo: '',
            materia: '',
            catedra: '',
            autor: '',
            link: '',
            subiendoApte: false,
            msj: '',
            showModal: false,
            wrongsection: false,
            by: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        }
    }
    checkSection() {
        doSimpleCorsGetRequest('/checksection/' + this.props.sec + '/' + this.props.name)
            .then(rta => {
                this.setState({ wrongsection: !(rta.rta) })
            })
            .catch();
    }
    checkInputs() {
        if (this.state.materia === null || this.state.materia === '' || this.state.materia === 'Elige una materia de este listado') {
            this.setState({ msj: 'Debes elegir una materia' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra.length >60) {
            this.setState({ msj: 'Completa la catedra correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.titulo === null || this.state.titulo === '' || this.state.titulo.length > 100) {
            this.setState({ msj: 'Debes completar el titulo correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.autor === null || this.state.autor === '' || this.state.autor.length > 100) {
            this.setState({ msj: 'Debes completar el autor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra > 60) {
            this.setState({ msj: 'El nombre de catedra es muy extenso' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.link === null || this.state.link === '' || this.state.link.length > 170) {
            this.setState({ msj: 'completa con un enlace al apunte correcto' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/temas/apuntes',JSON.stringify({
                    titulo: this.state.titulo, materia: this.state.materia, catedra: this.state.catedra,
                    autor: this.state.autor, link: this.state.link
                }), false, this.props.user.token)
                    .then(rta => {
                        this.setState({ titulo: '', materia: '', catedra: '', autor: '', link: '' });
                        this.setState({ msj: 'El apunte fue subido'})
                        this.setState({ showModal: true })
                    })
                    .catch(err => {
                        this.setState({ msj: err.message });
                        this.setState({ showModal: true })
                    });
            }
        }
    }
    handleChange(e) {this.setState({[e.target.name]:e.target.value}) }
    render() {
        return this.state.wrongsection ? (<Redirect to="/" />) : (
            this.props.user.logged ? 
                (<Template>
                    <img src={imgSeparador} className='linea'/>
                    <h2 className='titulo-1 txt-claro'>Subir un Apunte</h2>
                    <img src={imgSeparador} className='linea'/>
                    <form onSubmit={this.handleSubmit}>
                        <TituloField valor={this.state.titulo} manejarCambio={this.handleChange}/>
                        <AutorField valor={this.state.autor} manejarCambio={this.handleChange}/>
                        <MateriaField valor={this.state.materia} manejarCambio={this.handleChange}/>
                        <CatedraField valor={this.state.catedra} manejarCambio={this.handleChange}/>
                        <LinkField valor={this.state.link} manejarCambio={this.handleChange}/>
                        <button className="boton-oscuro ph-2 mv-2 centrade" type="submit" > <img src={nube} className='icono-1'/>Publicar </button>
                    </form>
                    <img src={imgSeparador} className='linea'/>

                    <div>
                        <NavLink to={`/secciones/9/Apuntes`}>
                            <button className="boton-oscuro ph-2 centrade" type="submit"><img src={volver} className='icono-1'/>Volver a la búsqueda</button>
                        </NavLink>
                    </div>

                    <img src={imgSeparador} className='linea'/>

                    <Modal show={this.state.showModal} manejaCierre={() => this.setState({ showModal: false })} titulo='Subir apunte' cuerpo={this.state.msj} />
                </Template>)
                :
                (this.state.by ?
                    <Redirect to="/" />
                    :
                    <Modal show={this.state.showModal} manejaCierre={() => this.setState({ showModal: false })} titulo='Crear un foro de opiniones de una materia-catedra' cuerpo={this.state.msj}/>
                )
        )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchLogout: () => logout()
}
export default connect(mapStateToProps, mapDispatchToProps)(SubidaApunte);