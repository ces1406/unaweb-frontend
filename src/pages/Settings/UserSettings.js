import React from 'react';
import { Redirect } from 'react-router-dom';
import Template from '../../common_components/pageTemplate';
import { Row, Col, Button, Modal,Form,Badge} from 'react-bootstrap';
import { connect } from 'react-redux';
import { update_mail, update_redSoc1, update_redSoc2, update_redSoc3, update_img, logout } from '../../redux/actions/useractions';
import {doJwtPreflightCorsPostRequest, isTokenOk, doSimpleCorsGetRequest } from '../../api_requests/requests';
import { IoMdCloseCircleOutline,IoIosMail,IoIosCloudUpload,IoIosOptions,IoLogoFacebook,IoLogoYoutube,IoIosGlobe,IoIosImage,IoIosContact,IoIosCamera, IoMdKey } from 'react-icons/io';
import {ConfirmActionField,CancelConfirm} from '../../common_components/FormFields/confirmActionField';
import AdminSettings from './AdminSettings';
import imgSeparador from '../../static_files/imgs/separador.png';

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
            archivoImg: null,
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
    handleSubmit(event) {
        var name = event.target.name
        event.preventDefault();
        var data = new FormData(event.target);
        if (this.checkInputs(name)) {
            if (!isTokenOk(this.props.user.token)) {
                this.setState({ msj: 'Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta ' });
                this.setState({ showModal: true })
                this.props.dispatchLogout();
            } else {
                doJwtPreflightCorsPostRequest('/usuarios/update', data, true, this.props.user.token)
                    .then(rta => {
                        this.setState({ msj: rta.msj })
                            switch (name) {
                                case 'mailForm':
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
                        this.setState({ msj: err.message });
                        this.setState({ showModal: true })
                    });
            }
        }
    }
    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
    }
    cancelEdit(event) {
        switch (event.target.name) {
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
        return (
            this.state.showModal ?
                (<Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Perfil</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{ color: 'rgb(5,6,28)' }}>{this.state.msj}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.setState({ showModal: false })}>Ok</Button>
                    </Modal.Footer>
                </Modal>)
                : this.props.user.logged ? (
                    <Template>
                        <h2 style={{ textAlign: "center", marginTop: "3%" }}>
                            <IoIosOptions style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Seteos de la cuenta del usuario 
                        </h2>
                        <img src={imgSeparador} lt="imagen" style={{ width: '100%', height: '4ex', margin: '0', padding: '0' }} />
                        <h2 style={{ textAlign: "center", marginTop: "3%" }} >
                            <Badge pill variant="light" style={{ paddingRight: "1.2em" }}>
                                <IoIosContact style={{ height: "2em", width: "2em", marginBottom: "0.1em", marginRight: "0.4em" }} />
                                {this.props.user.apodo}
                            </Badge>
                        </h2>                        
                        <h4>
                            <IoIosImage style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Imagen de portada
                        </h4>
                        <Badge variant="dark">
                            {this.state.avatar.src==undefined?
                            <IoMdCloseCircleOutline/>
                            :<img src={this.state.avatar.src} alt="imagen" width={164} height={164} className="mt-1 ml-1 mb-1 mr-1" style={{ borderRadius: "0.8em" }} />
                            }
                        </Badge>
                        {
                            this.state.imgModif ?
                                <Button variant="dark" onClick={() => { this.setState({ imgModif: false }) }} size="sm" className="ml-3">
                                    <IoIosCamera style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cambiar imagen
                                </Button>
                                :
                                <Form onSubmit={this.handleSubmit} name="imgForm">
                                    <Form.Group as={Row} className="mt-5">
                                        <Form.Label sm={4} className="mr-1 pt-1"><h4><IoIosCloudUpload style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Elige una imagen </h4> </Form.Label >
                                        <Col sm={6} style={{ color: 'rgba(230,240,255)' }}>
                                            <Form.Control id="avatar" name="imgAvatar" onChange={this.handleImg} as='input' type='file' />
                                            <div id="h7">Escoge una imagen no mayor a 10 KB</div>
                                            <input type="hidden" name="tipo" value="img" />
                                            <input type="hidden" name="apodo" value={this.props.user.apodo} />
                                        </Col>
                                        <CancelConfirm cancel={this.cancelEdit} name={"cancelImg"}/>
                                    </Form.Group>
                                </Form>
                        }
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        <Form onSubmit={this.handleSubmit} name="mailForm" >
                            <Form.Group as={Row} className="mt-2 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoIosMail style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Mail</h5>
                                </Form.Label>
                                <Col sm={5}>
                                    <Form.Control disabled={this.state.mailModif} placeholder={this.props.user.mail} onChange={this.handleChange} value={this.state.mail} name="mail" />
                                    <input type="hidden" name="tipo" value="mail" />
                                </Col>
                                <ConfirmActionField name={"cancelMail"} modif={this.state.mailModif} onclick={()=>{this.setState({mailModif:false})}} cancel={this.cancelEdit}/>
                            </Form.Group>
                        </Form>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        <Form onSubmit={this.handleSubmit} name="redSoc1Form">
                            <Form.Group as={Row} className="mt-2 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoLogoFacebook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Facebook</h5>
                                </Form.Label>
                                <Col sm={6}>
                                    <Form.Control disabled={this.state.redSoc1Modif} placeholder={this.props.user.redSoc1} onChange={this.handleChange} value={this.state.redSoc1} name="redSoc1" />
                                    <input type="hidden" name="tipo" value="redSoc1" />
                                </Col>
                                <ConfirmActionField name={"cancelRedSoc1"} modif={this.state.redSoc1Modif} onclick={()=>{this.setState({redSoc1Modif:false})}} cancel={this.cancelEdit}/>                                                            
                            </Form.Group>
                        </Form>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        <Form onSubmit={this.handleSubmit} name="redSoc2Form">
                            <Form.Group as={Row} className="mt-2 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoIosGlobe style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Blog</h5>
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Control disabled={this.state.redSoc2Modif} placeholder={decodeURIComponent(this.props.user.redSoc2)} onChange={this.handleChange} value={this.state.redSoc2} name="redSoc2" />
                                    <input type="hidden" name="tipo" value="redSoc2" />
                                </Col>
                                <ConfirmActionField name={"cancelRedSoc2"} modif={this.state.redSoc2Modif} onclick={()=>{this.setState({redSoc2Modif:false})}} cancel={this.cancelEdit}/> 
                            </Form.Group>
                        </Form>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        <Form onSubmit={this.handleSubmit} name="redSoc3Form">
                            <Form.Group as={Row} className="mt-2 ">
                                <Form.Label sm={4} className="mr-1 pt-1">
                                    <h5><IoLogoYoutube style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Canal de Youtube</h5>
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Control disabled={this.state.redSoc3Modif} placeholder={decodeURIComponent(this.props.user.redSoc3)} onChange={this.handleChange} value={this.state.redSoc3} name="redSoc3"  />
                                    <input type="hidden" name="tipo" value="redSoc3" />
                                </Col>
                                <ConfirmActionField name={"cancelRedSoc3"} modif={this.state.redSoc3Modif} onclick={()=>{this.setState({redSoc3Modif:false})}} cancel={this.cancelEdit}/> 
                            </Form.Group>
                        </Form>
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        {this.props.user.rol === 'ADMI' ?<AdminSettings /> : null}
                        {this.state.passModif ?
                            <Button onClick={() => { this.setState({ passModif: false }) }} variant="dark" size="sm" className="smallButton mt-1" >
                                <h6>Cambiar contraseña</h6>
                            </Button>
                                :
                            <Form onSubmit={this.handleSubmit} name="passForm">
                                <Form.Group as={Row} className="mt-4 ">
                                    <Form.Label sm={4} className="mr-1 pt-1">
                                        <h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Ingresa tu contraseña</h5>
                                    </Form.Label>
                                    <Col sm={3}>
                                        <Form.Control placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass0} name="pass0" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mt-4 ">
                                    <Form.Label sm={4} className="mr-1 pt-1">
                                        <h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Ingresa tu nueva contraseña</h5>
                                    </Form.Label>
                                    <Col sm={3}>
                                        <Form.Control placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass1} name="pass1" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mt-4 ">
                                    <Form.Label sm={4} className="mr-1 pt-1">
                                        <h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Repetir tu nueva contraseña</h5>
                                    </Form.Label>
                                    <Col sm={3}>
                                        <Form.Control placeholder="6 caracteres mínimo" onChange={this.handleChange} value={this.state.pass2} name="pass2" />
                                        <input type="hidden" name="tipo" value="pass" />
                                    </Col>
                                </Form.Group>
                                <CancelConfirm cancel={this.cancelEdit} name={"cancelPass"}/>
                            </Form>

                        }
                        <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

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