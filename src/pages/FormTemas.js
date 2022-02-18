import React from 'react';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import Modal from '../common_components/Modal';
import Editor from '../common_components/Editor';
import { Redirect } from 'react-router-dom';
import { doJwtPreflightCorsPostRequest, isTokenOk } from '../api_requests/requests';
import { logout } from '../redux/actions/useractions';
import titulo from '../../static_files/imgs/icons/portada.svg';
import bookmark from '../../static_files/imgs/icons/bookmark.svg';
import docu from '../../static_files/imgs/icons/documento.svg';
import check from '../../static_files/imgs/icons/check.svg';

class FormTema extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msjInicial: '',
            titulo: '',
            pal1: '',
            pal2: '',
            pal3: '',
            msj: '',
            showModal: false,
            showModalBye: false,
            bye: false,
            submitOk: false,
            temaCreated: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
        this.ckeditChg = this.ckeditChg.bind(this);
    }
    componentDidMount() {
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado ' });
            this.setState({ showModalBye: true })
            this.props.dispatchLogout();
        }
    }
    checkInputs() {
        if (this.state.titulo === null || this.state.titulo === '' || this.state.titulo.length > 140) { //dejo 40 caracteres (el max es 180) libres para escapar
            this.setState({ msj: 'corrige el titulo' })
            return false;
        }
        if (this.state.msjInicial === null || this.state.msjInicial === '' || this.state.msjInicial.length > 20000) {
            this.setState({ msj: 'corrige el mensaje inicial' })
            return false;
        }
        if (this.state.pal1 === null || this.state.pal1 === '' || this.state.pal2 === null || this.state.pal2 === '' || this.state.pal3 === null || this.state.pal3 === '') {
            this.setState({ msj: 'debes completar las palabras relacionadas al tema' })
            return false;
        }
        if (this.state.pal1.length > 24 || this.state.pal2.length > 24 || this.state.pal3.length > 24) {
            this.setState({ msj: 'las palabras no deben ser tan extensas' })
            return false;
        }
        return true;
    }
    handleShow() { this.setState({ showModal: true }) }
    handleClose() {
        this.setState({ showModal: false });
        if (this.state.submitOk) this.setState({ temaCreated: true });
    }
    ckeditChg(event) {
        this.setState({ msjInicial: event.editor.getData() });
    }
    handleChange(event) {
        switch (event.target.name) {
            case 'titulo':
                this.setState({ titulo: event.target.value });
                break;
            case 'pal1':
                this.setState({ pal1: event.target.value });
                break;
            case 'pal2':
                this.setState({ pal2: event.target.value });
                break;
            case 'pal3':
                this.setState({ pal3: event.target.value });
                break;
            default:
                break;
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModalBye: true })
            this.props.dispatchLogout();
        } else if (this.checkInputs()) {
            doJwtPreflightCorsPostRequest('/temas', JSON.stringify({
                idSec: this.props.idSec,
                msj: this.state.msjInicial,
                titulo: this.state.titulo,
                pal1: this.state.pal1,
                pal2: this.state.pal2,
                pal3: this.state.pal3,
            }), false, this.props.user.token)
                .then(rta => {
                    this.setState({ msj: rta.msj });
                    this.setState({ submitOk: true })
                })
                .catch(err => {
                    this.setState({ msj: 'No se pudo crear el tema, intenta mas tarde' });
                });
        }
        this.handleShow();
    }
    render() {
        //Ckeditor.editorUrl = '/ckeditor/ckeditor.js';
        return this.props.user.logged ? (
            this.state.temaCreated ?
                (<Redirect to={this.props.dir} />)
                :
                (<Template>
                    <div style={this.state.showModal?{backgroundColor:'rgba(20,20,20,0.74)'}:null}>
                        
                        <div style={this.state.showModal?{zIndex:'-1',position:'relative'}:null}>
                            <h1 className='titulo-1 txt-claro mv-2' >Crear un tema nuevo</h1>
                            <form onSubmit={this.handleSubmit} style={{marginBottom:'1.4em'}}>
                                <div className="campo-formu txt-claro mb-2">
                                    <div className='etiqueta'>
                                        <img className='icono-1 mr-1' src={titulo}/>
                                        <label className='titulo-3 mr-1'>Título del tema </label>
                                    </div>
                                    <input placeholder="Escoge un titulo que para el tema" name="titulo" id="titulo" className="inputo" onChange={this.handleChange} value={this.state.titulo} size={40}/>
                                </div>
                                <div className='campo-formu txt-claro'>
                                    <div className='etiqueta'>
                                        <img className='icono-1 mr-1' src={docu}/>
                                        <label className='titulo-2'> Mensaje inicial </label>
                                    </div>
                                </div>
                                <div>
                                    <Editor funcUpdate={this.ckeditChg} contenido={this.state.msjInicial} />
                                </div>

                                <h2 className='titulo-2 txt-claro mv-1'>Indica tres palabras relacionadas al tema que iniciarás: </h2>
                                
                                <div className="campo-formu txt-claro ">
                                    <div className='etiqueta'>
                                        <img className='icono-1 mr-1' src={bookmark} />
                                        <label className='titulo-3 mr-1'>Palabra 1</label>
                                    </div>
                                    <input className='inputo' id="pal1" name="pal1" maxLength={20} onChange={this.handleChange} value={this.state.pal1} />
                                </div>    

                                <div className= "campo-formu txt-claro mv-2">
                                    <div className='etiqueta'>
                                        <img className='icono-1 mr-1' src={bookmark} />
                                        <label className='titulo-3 mr-1'>Palabra 2</label>
                                    </div>
                                    <input className='inputo' id="pal2" name="pal2" maxLength={20} onChange={this.handleChange} value={this.state.pal2} />
                                </div>
                                <div className="campo-formu txt-claro">
                                    <div className='etiqueta'>
                                        <img className='icono-1 mr-1' src={bookmark} />
                                        <label className='titulo-3 mr-1'>Palabra 3</label>                                
                                    </div>    
                                    <input className='inputo' id="pal3" name="pal3" maxLength={20} onChange={this.handleChange} value={this.state.pal3} />
                                </div>
                                <button className='boton-oscuro pv-1 ph-2 mb-2 centrade' type="submit" > <img className='icono-1' src={check} />
                                    Crear el tema
                                </button>
                            </form>                            
                        </div>
                        <Modal show={this.state.showModal} manejaCierre={this.handleClose} titulo='Iniciar un tema' cuerpo={this.state.msj}/>
                    </div>
                </Template>)
        ) : (this.state.bye ?
            <Redirect to="/" />
            :
            <Modal show={this.state.showModalBye} manejaCierre={() => this.setState({ showModalBye: false })} titulo='Crear un Tema' cuerpo={this.state.msj}/>
            )
    }
}

const mapDispatchToProps = { dispatchLogout: () => logout() }
const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, mapDispatchToProps)(FormTema);
