import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import Modal from '../../common_components/Modal';
import {doJwtPreflightCorsPostRequest,isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import { connect } from 'react-redux';
import { logout } from '../../redux/actions/useractions';
import imgSeparador from '../../../static_files/imgs/separador.png';
import lupa from '../../../static_files/imgs/icons/lupa3.svg';
import MateriasField from '../../common_components/FormFields/materiaField';
import CatedrasField from '../../common_components/FormFields/catedraField';
import ProfesoresField from '../../common_components/FormFields/profesoresField';
import volver from '../../../static_files/imgs/icons/return.svg';

class SubidaForo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            materia: '',
            catedra: '',
            profesor: '',
            subiendoForo: false,
            msj: '',
            showModal: false,
            showModalmsj: false,
            wrongsection: false,
            by:false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.checkInputs = this.checkInputs.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.checkSection = this.checkSection.bind(this)
    }
    componentDidMount() {
        this.checkSection();
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        }
    }
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
        if (this.state.autor === null || this.state.profesor === '' || this.state.profesor.length > 100) {
            this.setState({ msj: 'completa el profesor correctamente' })
            this.setState({ showModal: true })
            return false;
        }
        if (this.state.catedra === null || this.state.catedra === '' || this.state.catedra > 60) {
            this.setState({ msj: 'completa con una catedra' })
            this.setState({ showModal: true })
            return false;
        }
        return true;
    }
    handleSubmit(event) {
        event.preventDefault();
        if (this.checkInputs()) {
            if (!isTokenOk(this.props.user.token)) {               
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/temas/cursos/',
                    JSON.stringify({ materia: this.state.materia, catedra: this.state.catedra, profesor: this.state.profesor})
                    , false, this.props.user.token)
                    .then(rta => {
                        this.setState({ materia: '', catedra: '', profesor: '',msj:'El foro para el curso se creó' });
                        this.setState({ showModalmsj: true })
                    })
                    .catch(err => {
                        this.setState({ msj: err.message });
                        this.setState({ showModalmsj: true })
                    });
            }
        }
    }
    handleChange(e) {this.setState({[e.target.name]:e.target.value});}
    render() {
        return <>
        {this.state.wrongsection ? (<Redirect to="/" />) :
            (this.props.user.logged ? (
                <Template>
                    <img src={imgSeparador} alt="imagen" className='linea' />
                    <h1 className='txt-claro titulo-1'>Crear un foro de opiniones de una materia/catedra</h1>
                    <img src={imgSeparador} alt="imagen" className='linea' />
                    
                    <form onSubmit={this.handleSubmit}>
                        <MateriasField valor={this.state.materia} manejarCambio={this.handleChange}/>
                        <CatedrasField valor={this.state.catedra} manejarCambio={this.handleChange}/>
                        <ProfesoresField valor={this.state.profesor} manejarCambio={this.handleChange}/>
                        <button className="boton-oscuro ph-2 mv-2 centrade" type="submit" >
                            <img src={lupa} className='icono-1 mr-1' />Crear Foro
                        </button>
                    </form>

                    <img src={imgSeparador} alt="imagen" className='linea' />

                    <NavLink to={`/secciones/${this.props.idSec}/${this.props.nomb}`}>
                        <button className="boton-oscuro ph-2 mv-1 centrade" type="submit" >
                            <img src={volver} className='icono-1'/>Volver a buscar
                        </button>
                    </NavLink>
                    <img src={imgSeparador} alt="imagen" className='linea' />
                    
                </Template>
                ) :
                (this.state.by?
                    <Redirect to="/" />
                    :
                    <Modal show={this.state.showModal} manejaCierre={() => this.setState({ showModal: false})} titulo='Crear un foro de opiniones de una materia-catedra' cuerpo={this.state.msj}/>
                )
            )
        }  
        <Modal show={this.state.showModalmsj} manejaCierre={() => this.setState({ showModalmsj: false})} titulo='Crear un foro de opiniones de una materia-catedra' cuerpo={this.state.msj}/>
      
    </>
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() };
export default connect(mapStateToProps, mapDispatchToProps)(SubidaForo);