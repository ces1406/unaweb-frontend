import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Template from "../common_components/pageTemplate";
import { doSimpleCorsGetRequest, doJwtPreflightCorsPostRequest, doJwtPreflightCorsDeleteRequest, isTokenOk } from "../api_requests/requests";
import Paginacion from "../common_components/paginacion";
import { ITEMS_POR_PAG } from "../globals";
import { logout } from "../redux/actions/useractions";
import Editor from "../common_components/Editor";
import imgSeparador from "../../static_files/imgs/separador.png";
import check from '../../static_files/imgs/icons/check-simple.svg';
import close from '../../static_files/imgs/icons/close.svg';
import Cabecera from "../common_components/Comentario/Cabecera";
import Comentario from "../common_components/Comentario/Comentario";
import Modal from "../common_components/Modal";

class TemaSimple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      tema: {},
      userpost: {},
      cantComents: 0,
      pagActiva: 1,
      comments: [],
      comentario: "",
      comentadoOk: false,
      avatar: "", //es la imagen en sí (el src del blob que se trajo del server)
      showModal: false,
      msj: "",
      imgs: [],
      srcs: [],
      wrongtem: false,
      delComent: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkInput = this.checkInput.bind(this);
    this.ckeditChg = this.ckeditChg.bind(this);
    this.getUserAvatar = this.getUserAvatar.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.setErasable = this.setErasable.bind(this);
    this.unsetErasable = this.unsetErasable.bind(this);
    this.delComent = this.delComent.bind(this);
  }
  componentDidMount() {
    if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
      this.props.dispatchLogout();
    }
    doSimpleCorsGetRequest("/temas/" + this.state.id)
      .then((resp) => {
        this.setState({
          tema: {
            idTema: resp.rta.idTema,
            titulo: resp.rta.titulo,
            comentarioInicial: resp.rta.comentarioInicial,
            palabraClave1: resp.rta.palabraClave1,
            palabraClave2: resp.rta.palabraClave2,
            palabraClave3: resp.rta.palabraClave3,
            fechaCreacion: resp.rta.fechaCreacion,
            idSeccion: resp.rta.idSeccion,
          },
          userpost: resp.rta.Usuario,
          cantComents: resp.rta.cantComents,
        });
        return resp;
      })
      .then(async (rta) => {
        return rta.rta.Usuario.dirImg ? this.getUserAvatar(rta.rta.Usuario.dirImg) : null;
      })
      .then(async (rta0) => {
        this.setState({ avatar: rta0 });
        return await this.getComments(this.props.id);
      })
      .catch((err) => {
        return "Error en ComponentDidMount() (" + err + ")";
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.pagActiva !== prevState.pagActiva){ 
      this.getComments(this.state.id);
      this.setState({ delComent: false });
    }
  }
  goToPage(nro) {
    this.setState({ pagActiva: nro });
  }
  nextPage() {
    let activa = this.state.pagActiva + 1;
    this.setState({ pagActiva: activa });
  }
  prevPage() {
    this.setState({ pagActiva: this.state.pagActiva - 1 });
  }
  ckeditChg(event) {
    this.setState({ comentario: event.editor.getData() });
  }
  checkInput() {
    if (this.state.comentario.trim() === null || this.state.comentario === "" || this.state.comentario.length === 0) {
      return false;
    }
    if (this.state.comentario.length > 20000) {
      return false;
    }
    return true;
  }
  getUserAvatar(name) {
    return new Promise(async (res, rej) => {
      var resp = await doSimpleCorsGetRequest("/usuarios/avatar/" + name); //this.getUserAvatar(rta.userpost.dirImg)
      let src = URL.createObjectURL(resp);
      res({ name, src });
    });
  }
  getComments(id) {
    return new Promise((res, rej) => {
      doSimpleCorsGetRequest("/temas/comentarios/" + id + "/" + this.state.pagActiva + "/" + ITEMS_POR_PAG)
        .then((rta) => {
          let rtaAux = rta.map((elem) => {
            let fecha = new Date(elem.fechaHora);
            elem.dia = fecha.getDate();
            elem.mes = fecha.getMonth();
            elem.anio = fecha.getFullYear();
            elem.hora = fecha.getHours();
            elem.min = fecha.getMinutes();
            elem.milisecs = fecha.getTime();
            elem.erasable = false;
            return elem;
          });
          rtaAux.sort((a, b) => a.milisecs - b.milisecs);
          return rtaAux;
        })
        .then((rta) => {
          this.setState({ comments: rta });
          return this.state.comments;
        })
        .then((rta) => {
          // Devuelvo un array con las dirImg de cada comentario:
          return Promise.resolve(this.state.comments.map((e) => e.Usuario.dirImg));
        })
        .then((rta) => {
          let imgs = new Map();
          rta.forEach((e, indice, vec) => {
            let item = imgs.get(e);
            if (e !== null) {
              if (item == undefined) {
                imgs.set(e, [indice]);
              } else {
                item.push(indice);
              }
            }
          });
          return imgs;
        })
        .then(async (rta) => {
          let comentarios = this.state.comments;
          if(rta.size>0){
            for await (const e of rta.keys()) {
              let avatar = await this.getUserAvatar(e);
              let item = rta.get(e);
              for (const poss of item) {
                comentarios[poss].src = avatar.src;
              }
            }
          }          
          return comentarios;
        })
        .then(async (rta) => {
          this.setState({ comments: rta });
          return Promise.resolve(true);
        })
        .catch((err) => {
          rej("Error -getComments- en GET->/comments/idtema (" + err + ")");
        });
    });
  }
  handleSubmit() {
    if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
      this.setState({ msj: "Tu sesión de usuario ha expirado" });
      this.setState({ showModal: true });
      this.props.dispatchLogout();
    } else if (this.checkInput()) {
      doJwtPreflightCorsPostRequest("/temas/comentar",JSON.stringify({idTema: this.props.id, comentario: this.state.comentario}),
        false,
        this.props.user.token
      )
        .then((rta) => {
          this.setState({ submitOk: true, comentadoOk: true, msj: rta.msj });
        })
        .catch((err) => {
          this.setState({ msj: "No se pudo comentar el tema, intenta nuevamente" });
        });
    }
  }
  setErasable(e) {
    let indice = this.state.comments.findIndex((elem) => {
      return elem.idComentario === parseInt(e.target.value);
    });
    let coment = this.state.comments[indice];
    coment.erasable = true;
    let aux1 = this.state.comments.slice(0, indice);
    let aux2 = this.state.comments.slice(indice + 1);
    let aux3 = aux1.concat(coment).concat(aux2);
    this.setState({ comments: aux3 });
  }
  delComent(event) {
    event.preventDefault();
    var valor = event.target[0].defaultValue;
    if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
      this.setState({ msj: "Tu sesión de usuario ha expirado. Accede nuevamente a tu cuenta " });
      this.setState({ showModal: true });
      this.props.dispatchLogout();
    } else {
      doJwtPreflightCorsDeleteRequest('/temas/comentarios/'+valor,this.props.user.token)
        .then((rta) => {
          let index = this.state.comments.findIndex((elem) => {
            return elem.idComentario === +valor;
          });
          let vecAux = this.state.comments;
          vecAux.splice(index, 1);
          this.setState({ comments: vecAux, delComent: true });
        })
        .catch((err) => {
          this.setState({ msj: err.message });
        });
    }
  }
  unsetErasable(e) {
    let indice = this.state.comments.findIndex((elem) => {
      return elem.idComentario === parseInt(e.target.value);
    });
    let coment = this.state.comments[indice];
    coment.erasable = false;
    let aux1 = this.state.comments.slice(0, indice);
    let aux2 = this.state.comments.slice(indice + 1);
    let aux3 = aux1.concat(coment).concat(aux2);
    this.setState({ comments: aux3 });
  }

  render() {
    let f1 = (this.state.tema.fechaCreacion??'0-0-0T0:0:0.0Z').split(':');
    let hora = f1[1];
    let min = f1[2].split('.')[0];
    let dia = f1[0].split('-')[1];
    let mes = f1[0].split('-')[2].substring(0,2);
    let anio = f1[0].split('-')[0];
    return this.state.comentadoOk ? (
      <Redirect to={this.props.herencia.location.pathname} />
    ) : (
      <Template>
        <img src={imgSeparador} className='linea' />
        <div className="titulo-2 txt-claro centrade"> Sección {this.props.name} </div>
        <img src={imgSeparador} className='linea' />
        <div className="titulo-1 txt-claro mv-1">Tema: {this.state.tema.titulo}</div>
        
        <div className="card-contenedora" style={{backgroundColor:'rgb(210,210,210)',border:'0.2em solid rgb(120,120,100)',borderRadius:'0.6em',padding:'0.6em'}}>
          <Cabecera tamicono='icono-3' user={this.state.userpost} avatarsrc={this.state.avatar?this.state.avatar.src:null} izq={'el '+dia+'/'+mes+'/'+anio+' ('+hora+':'+min+'hs.)'}/>        
          <div className="texto-comentario-lg txt-oscuro" dangerouslySetInnerHTML={{ __html: this.state.tema.comentarioInicial }} />

          {this.state.comments.map((coment) => (
            <div key={coment.idComentario}>
            <Comentario user={coment.Usuario} avatarsrc={coment.src?coment.src:null} izq={coment.dia+'/'+(0+coment.mes+1)+'/'+coment.anio+' ('+coment.hora+':'+coment.min+'hs)'} cuerpo={coment.contenido}/>
              {this.props.user.rol === "ADMI" ? (
                  <form onSubmit={this.delComent}>
                    <input type="hidden" name="idCatedra" value={coment.idComentario} />
                    <button disabled={coment.erasable} value={coment.idComentario} onClick={this.setErasable} className="boton-oscuro mv-1 ph-1">
                      <img src={close} className='icono-1 mr-0'/> Eliminar comentario
                    </button>
                    {coment.erasable ? (
                      < div style={{display:'flex',justifyContent:'center'}} >
                        <button type="submit" className="boton-oscuro ph-1 mr-2">
                          <img src={check} className='icono-1 mr-0'/>Cofirmar
                        </button>
                        <button onClick={this.unsetErasable} value={coment.idComentario} className="boton-oscuro ph-1">
                          <img src={close} className='icono-1 mr-0'/>Cancelar
                        </button>
                      </div>
                    ) : null}
                    <img src={imgSeparador} className='linea' />
                  </form>
              ) : null}
            </div>
          ))}
          {this.state.pagActiva === Math.ceil(this.state.cantComents / ITEMS_POR_PAG) || this.state.cantComents === 0 ? (
            <>
              {this.props.user.logged ? (
                <div className="card-compuesta card-comentario">
                    <Editor funcUpdate={this.ckeditChg} contenido={this.state.comentario} />
                    <button onClick={this.handleSubmit} className="boton-oscuro pv-1 ph-2 mv-1 centrade"> Comentar </button>
                </div>
              ) : null}
            </>
          ) : null}
          <div className='mv-3'>
            <Paginacion cant={this.state.cantComents} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
          </div>
        </div>

        <Modal  show={this.state.showModal} manejaCierre={() => this.setState({ showModal: false })} titulo='Comentando tema' cuerpo={this.state.msj}/>
      </Template>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() };

export default connect(mapStateToProps, mapDispatchToProps)(TemaSimple);