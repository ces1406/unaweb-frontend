import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import Modal from '../../common_components/Modal';
import { connect } from 'react-redux';
import { update_mail, update_redSoc1, update_redSoc2, update_redSoc3, update_img, logout } from '../../redux/actions/useractions';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import {ConfirmActionField, CancelConfirm} from '../../common_components/FormFields/confirmActionField';
import AdminSettings from './AdminSettings';
import imgSeparador from '../../../static_files/imgs/separador.png';
import usuario from '../../../static_files/imgs/icons/usuario2.svg';
import camara from '../../../static_files/imgs/icons/camara.svg';
import idavuelta from '../../../static_files/imgs/icons/idavuelta.svg';
import mail from '../../../static_files/imgs/icons/mail.svg';
import facebook from '../../../static_files/imgs/icons/facebook.svg';
import instagram from '../../../static_files/imgs/icons/instagram.svg';
import youtube from '../../../static_files/imgs/icons/youtube.svg';
import llave from '../../../static_files/imgs/icons/llave.svg';
import ImageField from '../../common_components/FormFields/imageField';

class UserSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            msj: '',
            mail: '',
            redSoc1: '',
            redSoc2: '',
            redSoc3: '',
            pass0: '',
            pass1: '',
            pass2: '',
            avatar: '',
            showModal: false,

            imgModif: true,
            mailModif: true,
            redSoc1Modif: true,
            redSoc2Modif: true,
            redSoc3Modif: true,
            passModif: true,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleImg = this.handleImg.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkInputs = this.checkInputs.bind(this);
    }
    checkInputs(tipo) {
        switch (tipo) {
            case 'mailForm':
                if (this.state.mail === null || this.state.mail === '') {
                    this.setState({ msj: 'debes completar con una dirección de mail válida' })
                    this.setState({ showModal: true })
                    return false;
                }
                break;
            case 'passForm':
                if (this.state.pass2.length < 6 || this.state.pass2.length > 8 || this.state.pass1.length < 6 || this.state.pass1.length > 8 || this.state.pass0.length < 6 || this.state.pass0.length > 8) {
                    this.setState({ msj: 'la contraseña debe ser de 6 caracteres como mínimo y 8 como máximo' })
                    this.setState({ showModal: true })
                    return false;
                }
                if (this.state.pass2 === null || this.state.pass2 === '' || this.state.pass1 === null || this.state.pass1 === '' || this.state.pass0 === null || this.state.pass0 === '') {
                    this.setState({ msj: 'debes completar con una contraseña' })
                    this.setState({ showModal: true })
                    return false;
                }
                if (this.state.pass1 !== this.state.pass2) {
                    this.setState({ msj: 'ambas contraseñas deben coincidir' })
                    return false;
                }
                break;
            case 'buscarUserForm':
                if (this.state.usuarioComun === null || this.state.usuarioComun === '') {
                    this.setState({ msj: 'debes completar el apodo del usuario a buscar' })
                    this.setState({ showModal: true })
                    return false;
                }
                break;
            default:
                return true;
        }
        return true;
    }
    handleSubmit(e) {
        console.log('UserSettings->handleSubmit-e.target',e.target)
        var name = e.target.name
        console.log('UserSettings->handleSubmit-e.target.name: ',e.target.name)
        e.preventDefault();
        var data = new FormData(e.target);
        if (this.checkInputs(name)) {
            console.log('UserSettings->handleSubmit()->checksInputs-OK')
            if (!isTokenOk(this.props.user.token)) {
                console.log('handleSubmit-1')
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/usuarios/update', data, true, this.props.user.token)
                    .then(rta => {
                        console.log('volviendo del fetch')
                        this.setState({ msj: rta.msj })
                            switch (name) {
                                case 'mailForm':
                                    console.log('UserSettings->handleSubmit()->token-OK->mailForm')
                                    this.setState({ mailModif: true })
                                    this.props.dispatchUpdMail(this.state.mail)
                                    break;
                                case 'passForm':
                                    this.setState({ passModif: true, pass0: this.props.user.pass,pass1:'',pass2:'' });
                                    break;
                                case 'redSoc1Form':
                                    this.setState({ redSoc1Modif: true })
                                    this.props.dispatchUpdRedS1(this.state.redSoc1)
                                    break;
                                case 'redSoc2Form':
                                    this.setState({ redSoc2Modif: true })
                                    this.props.dispatchUpdRedS2(this.state.redSoc2)
                                    break;
                                case 'redSoc3Form':
                                    this.setState({ redSoc3Modif: true })
                                    this.props.dispatchUpdRedS3(this.state.redSoc3)
                                    break;
                                case 'imgForm':
                                    this.setState({ imgModif: true })
                                    let img = data.get('imgAvatar').name
                                    let extension = img.slice(img.lastIndexOf("."), img.length)
                                    this.props.dispatchUpdImg('user-' + this.props.user.apodo + extension)
                                    this.getUserAvatar(this.props.user.dirImg)
                                        .then(rta => { this.setState({ avatar: rta }) })
                                        .catch(err => {this.setState({ msj: err.message }); });
                                    break;
                                default:
                                    break;
                            }
                        this.setState({ showModal: true })
                    })
                    .catch(err => {
                        console.log('handleSubmit-fetch-error: ',err)
                        this.setState({ msj: err.message });
                        this.setState({ showModal: true })
                    });
            }
        }
    }
    handleChange(e) {
        console.log('UserSettings->handleChange()->e.target.name: ',e.target.value)
        this.setState({[e.target.name]:e.target.value});
    }
    cancelEdit(e) {
        e.preventDefault();
        console.log('UserSettings->cancelEdit()->CANCELAR')
        console.log('UserSettings->cancelEdit()->e.target.name: ',e.target.name)
        switch (e.target.name) {
            case 'cancelMail':
                this.setState({ mailModif: true, mail: this.props.user.mail });
                break;
            case 'cancelPass':
                this.setState({ passModif: true, pass0: this.props.user.pass,pass1:'',pass2:'' });
                break;
            case 'cancelRedSoc1':
                this.setState({ redSoc1Modif: true, redSoc1: this.props.user.redSoc1 });
                break;
            case 'cancelRedSoc2':
                this.setState({ redSoc2Modif: true, redSoc2: this.props.user.redSoc2 });
                break;
            case 'cancelRedSoc3':
                this.setState({ redSoc3Modif: true, redSoc3: this.props.user.redSoc3 });
                break;
            case 'cancelImg':
                this.setState({ imgModif: true, archivoImg: null });
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        if (!isTokenOk(this.props.user.token)||this.props.user.token==undefined) {
            this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
            this.setState({ showModal: true })
            this.props.dispatchLogout();
        } else {
            if (this.props.user.dirImg) {
                this.getUserAvatar(this.props.user.dirImg)
                    .then(rta => { this.setState({ avatar: rta })  })
                    .catch(err => {this.setState({ msj: err.message }); });
            }
        }
    }
    getUserAvatar (name) {
        return new Promise(async (res, rej) => {
            var resp = await  doSimpleCorsGetRequest('/usuarios/avatar/' + name)//this.getUserAvatar(rta.userpost.dirImg)
            let src = URL.createObjectURL(resp)
            res({ name, src })
        })
    }
    handleImg(e) { this.setState({ archivoImg: e.target.files[0] }) }
    render() {
        console.log('UserSettings->render()->this.state.mailModif: ',this.state.mailModif)
        return (
            this.state.showModal ?
                (<Modal show={this.state.showModal} manejaCierre={()=>this.setState({ showModal: false })} titulo='Editar Perfil' cuerpo={this.state.msj}/>)
                : this.props.user.logged ? (
                    <Template>
                        <h1 className='txt-claro titulo-1 centrade'>Seteos de la cuenta del usuario </h1>
                        <img src={imgSeparador} className='linea' />
                        <div className='etiqueta txt-claro titulo-1 mb-1'>
                                <img src={usuario} className='icono-1'/> {this.props.user.apodo}
                        </div>
                        <img src={imgSeparador} className='linea' />
                        <div className='etiqueta txt-claro titulo-3'>
                            <img src={camara} className='icono-1 mr-1'/>Imagen actual
                        </div>

                        <div className='titulo-2'>
                            {this.state.avatar.src==undefined? <img src={usuario} className='icono-3'/> :<img src={this.state.avatar.src} className='icono-3'/> }
                        </div>                                               
                        {
                            this.state.imgModif ?
                                <button onClick={() => { this.setState({ imgModif: false }) }} className="boton-oscuro ph-2 pv-0 mb-1">
                                    <img src={idavuelta} className='icono-1' />Cambiar imagen
                                </button>
                                :
                                <form onSubmit={this.handleSubmit} name="imgForm">
                                    <ImageField />   
                                    <input type="hidden" name="tipo" value="img" />
                                    <input type="hidden" name="apodo" value={this.props.user.apodo} />
                                    <CancelConfirm cancel={this.cancelEdit} name={"cancelImg"}/>
                                </form>                                
                        }
                        <img src={imgSeparador} alt="imagen" className='linea' />
                        <form onSubmit={this.handleSubmit} name="mailForm" >
                            <div className="txt-claro campo-formu mv-3 mt-0">
                                <div className='etiqueta'>
                                    <img className='icono-1' src={mail} />
                                    <label className='titulo-2 mr-1 ml-0'> E-Mail </label>
                                </div>    
                                <input className='inputo' disabled={this.state.mailModif} placeholder={this.props.user.mail} onChange={this.handleChange} value={this.state.mail} name="mail" size={40}/>
                                <input type="hidden" name="tipo" value="mail" />
                            </div>
                            <ConfirmActionField name="cancelMail" modif={this.state.mailModif} onclick={()=>{ this.setState({mailModif:false}) }} cancel={this.cancelEdit}/>
                        </form>
                        <img src={imgSeparador} alt="imagen" className='linea' />
                        <form onSubmit={this.handleSubmit} name="redSoc1Form">
                            <div className="txt-claro campo-formu mv-3  mt-0">
                                <div className='etiqueta'>
                                    <img className='icono-1' src={facebook}/>
                                    <label className='titulo-2 mr-1 ml-0'>Facebook</label>
                                </div>
                                <input className='inputo' disabled={this.state.redSoc1Modif} placeholder={decodeURI(this.props.user.redSoc1)} onChange={this.handleChange} value={this.state.redSoc1} name="redSoc1" size={40}/>
                                <input type="hidden" name="tipo" value="redSoc1" />
                            </div>
                            <ConfirmActionField name={"cancelRedSoc1"} modif={this.state.redSoc1Modif} onclick={()=>{this.setState({redSoc1Modif:false})}} cancel={this.cancelEdit}/>                            
                        </form>
                        <img src={imgSeparador} alt="imagen" className='linea' />
                        <form onSubmit={this.handleSubmit} name="redSoc2Form">
                            <div className="txt-claro campo-formu mv-3  mt-0">
                                <div className='etiqueta'>
                                    <img className='icono-1' src={instagram}/>
                                    <label className='titulo-2 mr-1 ml-0'>Instagram</label>
                                </div>
                                <input className='inputo' disabled={this.state.redSoc2Modif} placeholder={decodeURIComponent(this.props.user.redSoc2)} onChange={this.handleChange} value={this.state.redSoc2} name="redSoc2" size={40}/>
                                <input type="hidden" name="tipo" value="redSoc2" />
                            </div>
                            <ConfirmActionField name={"cancelRedSoc2"} modif={this.state.redSoc2Modif} onclick={()=>{this.setState({redSoc2Modif:false})}} cancel={this.cancelEdit}/> 
                        </form>
                        <img src={imgSeparador} alt="imagen" className='linea' />
                        <form onSubmit={this.handleSubmit} name="redSoc3Form">
                            <div className="txt-claro campo-formu mv-3 mt-0">
                                <div className='etiqueta'>
                                    <img className='icono-1' src={youtube}/>
                                    <label className='titulo-2 mr-1 ml-0'>Canal de Youtube</label>
                                </div>
                                <input className='inputo' disabled={this.state.redSoc3Modif} placeholder={decodeURIComponent(this.props.user.redSoc3)} onChange={this.handleChange} value={this.state.redSoc3} name="redSoc3" size={40}/>
                                <input type="hidden" name="tipo" value="redSoc3" />
                            </div>
                            <ConfirmActionField name={"cancelRedSoc3"} modif={this.state.redSoc3Modif} onclick={()=>{this.setState({redSoc3Modif:false})}} cancel={this.cancelEdit}/> 
                        </form>
                        <img src={imgSeparador} alt="imagen" className='linea' />
                        {this.props.user.rol === 'ADMI' ?<AdminSettings /> : null}
                        {this.state.passModif ?
                            <button onClick={() => { this.setState({ passModif: false }) }} className="boton-oscuro ph-2 pv-1" >
                                <img src={idavuelta} className='icono-1' />Cambiar contraseña
                            </button>
                                :
                            <form onSubmit={this.handleSubmit} name="passForm">
                                <div className="txt-claro campo-formu mv-3 mt-0">
                                    <div className='etiqueta'>
                                        <img className='icono-1' src={llave}/>
                                        <label className='titulo-2 mr-1 ml-0'>Ingresa tu contraseña </label>
                                    </div>
                                    <input className='inputo' placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass0} name="pass0" />
                                </div>
                                <div className="txt-claro campo-formu mv-3 mt-0">
                                    <div className='etiqueta'>
                                        <img className='icono-1' src={llave}/>
                                        <label className='titulo-2 mr-1 ml-0'>Ingresa tu nueva contraseña</label>
                                    </div>
                                    <input className='inputo' placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass1} name="pass1" />
                                </div>
                                <div className="txt-claro campo-formu mv-3 mt-0">
                                    <div className='etiqueta'>
                                        <img className='icono-1' src={llave}/>
                                        <label className='titulo-2 mr-1 ml-0'>Repite la nueva contraseña</label>
                                    </div>
                                    <input className='inputo' placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass2} name="pass2" />
                                </div>    
                                    <input type="hidden" name="tipo" value="pass" />
                                    
                                <CancelConfirm cancel={this.cancelEdit} name={"cancelPass"}/>
                            </form>

                        }
                        <img src={imgSeparador} alt="imagen" className='linea' />

                    </Template >
                ) : (<Redirect to="/" />)
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = {
    dispatchUpdMail: (mail) => update_mail(mail),
    dispatchUpdRedS1: (red) => update_redSoc1(red),
    dispatchUpdRedS2: (red) => update_redSoc2(red),
    dispatchUpdRedS3: (red) => update_redSoc3(red),
    dispatchUpdImg: (img) => update_img(img),
    dispatchLogout: () => logout()
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);