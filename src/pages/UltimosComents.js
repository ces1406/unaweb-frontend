import React from "react";
import { NavLink } from "react-router-dom";
import { doSimpleCorsGetRequest } from "../api_requests/requests";
import imgSeparador from "../../static_files/imgs/separador.png";
import usuario from "../../static_files/imgs/icons/usuario-circulo-black.svg";

export default class UltimosComents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ultimosCom: [],
      idTimer: 0,
    };
    this.getUltimosComs = this.getUltimosComs.bind(this);
  }
  componentDidMount() {
    this.getUltimosComs();
    this.setState({ idTimer: setInterval(this.getUltimosComs, 60000) });
  }
  getUltimosComs() {
    doSimpleCorsGetRequest("/temas/ultimoscomentarios")
      .then((rta) => {
        let rtaAux = rta.map((elem) => {
          elem.fecha = new Date(elem.fechaHora);
          return elem;
        });
        return rtaAux;
      })
      .then((rta) => {
        this.setState({ ultimosCom: rta });
      })
      .catch();
  }
  componentWillUnmount() {
    clearInterval(this.state.idTimer);
  }
  render() {
    return (
      <aside id="panel-derecho">
        <img alt="" src={imgSeparador} style={{ width: "100%", height:"2ex", margin: "0", padding: "0" }}></img>
        <div className="titulo-2 txt-claro" style={{marginBottom:'0.6em', textAlign:'center'}}> Ultimos comentarios </div>
        <img alt="" src={imgSeparador} style={{ width: "100%", height:"2ex", margin: "0", padding: "0" }}></img>
        <ul id="lista-comentarios">
          {this.state.ultimosCom.map((coment, index) => (
            <li  key={index}>
              <NavLink className="card-compuesta" style={{height:'100%',width: '18em'}} to={coment.idTema ? `/secciones/${coment.origen.idSeccion}/${coment.origen.Seccion.nombreSeccion}/${coment.idTema}` : `/secciones/${coment.origen.idSeccion}/Opiniones de cátedras y profesores/foro/${coment.origen.idCatedra}`}>
                
                <div className="card-cabecera" style={{backgroundColor:'rgb(210,210,210)',borderRadius:'0.6em',padding:'0.1em'}}>
                  <div className="titulo-card-1 txt-oscuro">
                    <img src={usuario} className="icono-1"/>
                    <span>{coment.Usuario.apodo}&nbsp;:</span>
                  </div>
                  <p className="titulo-card-1 txt-oscuro">{coment.fecha.toLocaleString(undefined,{day:'numeric',month:'2-digit',year:'numeric', hour:'2-digit',minute:'2-digit'})}hs</p>
                </div>

                <div className="texto-comentario-sm" dangerouslySetInnerHTML={{ __html: coment.contenido }} />
                
                <p className="card-pie titulo-card-1 txt-oscuro" style={{backgroundColor:'rgb(210,210,210)',borderRadius:'0.6em',padding:'0.1em'}}>
                  {coment.idTema ? 
                    <> Sección: {coment.origen.Seccion.nombreSeccion}<br/>Tema: {coment.origen.titulo}</>
                  : <>  Sección: Opiniones de cátedras y profesores (cátedra: {coment.origen.catedra} materia: {coment.origen.materia})</>
                  }
                </p>
                
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    );
  }
}