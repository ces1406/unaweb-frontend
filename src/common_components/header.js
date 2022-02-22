import React from "react";
import entrar from '../../static_files/imgs/icons/in.svg';
import salir from '../../static_files/imgs/icons/out.svg';
import listado from '../../static_files/imgs/icons/listado.svg';
import usuario2 from '../../static_files/imgs/icons/usuario2.svg';
import settings from '../../static_files/imgs/icons/settings.svg';
import lupa2 from '../../static_files/imgs/icons/lupa3.svg';
import { NavLink } from "react-router-dom";
import { doSimpleCorsGetRequest } from "../api_requests/requests";
import logo from "../../static_files/imgs/icons/logoUNA.svg";
import lupa from "../../static_files/imgs/icons/busqueda.svg";
import menu from "../../static_files/imgs/icons/menu.svg";
import { connect } from "react-redux";
import { logout } from "../redux/actions/useractions";
import { addSearchResults } from "../redux/actions/searchactions";
import { SCREEN_SM } from "../globals";

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      palBusq: "",
      tam: window.innerWidth,
      displaySearch: false,
      displayMenu: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkInputs = this.checkInputs.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", () => this.setState({ tam: window.innerWidth }));
  }
  buscarTema(palabra) {
    return new Promise((res, rej) => {
      doSimpleCorsGetRequest("/temas/busqueda/" + palabra)
        .then((rta) => {
          let rtaAux = rta.map((elem) => {
            elem.fecha = new Date(elem.fechaCreacion);
            return elem;
          });
          res(rtaAux);
        })
        .catch();
    });
  }
  checkInputs(event) {
    let palBusq = this.state.palBusq.trim();
    if (palBusq === null || palBusq === "" || palBusq.length > 40) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    this.buscarTema(palBusq)
      .then(async (rta) => {
        await this.props.dispatchResults(rta);
      })
      .catch((err) => {
        return "Error en ComponentDidMount() (" + err + ")";
      });
  }
  handleChange(event) {
    this.setState({ palBusq: event.target.value });
  }
  render() {
    // efecto: el header se desplaza y el subheader queda fijo como barra superior:
    // <header style={(this.state.displayMenu||this.state.displaySearch)?estiloHeaderCompartido:estiloHeader}>
    return (
      <>
        <header style={estiloHeader}>
          <NavLink to="/" style={{ display: "flex", flexDirection: "row", alignItems: "center",marginLeft:'0.2em' }}>
            <img src={logo} className='icono-2 mh-1 mv-1' />
            {this.state.tam < SCREEN_SM ? null : <h6 className="titulo-3 txt-claro ml-0">Sitio web de la comunidad UNA</h6>}
          </NavLink>

          <div style={{ display: "flex", alignItems: "center" }}>
            {this.state.tam < SCREEN_SM ? 
              <img src={lupa} className='icono-2 mh-1 mv-1' onClick={() => this.setState({ displaySearch: !this.state.displaySearch, displayMenu: false })} />
             : <CompoBusq checkInputs={this.checkInputs} palBusq={this.state.palBusq} cambiar={this.handleChange}/>}
          </div>

          <div>
            {this.state.tam < SCREEN_SM ? (
              <img src={menu} className='icono-2 mh-1 mv-1' onClick={() => this.setState({ displayMenu: !this.state.displayMenu, displaySearch: false })} />
            ) : (
              <>
                {this.props.user.logged ? <CompoUser apodo={this.props.user.apodo} cerrarSesion={() => this.props.dispatchLogout()}/> : <CompoMenu/>}
              </>
            )}
          </div>
        </header>
        <div style={estiloSubHeader}>
          {this.state.displaySearch ? <CompoBusq checkInputs={this.checkInputs} palBusq={this.state.palBusq} cambiar={this.handleChange}/> : null}
          {this.state.displayMenu ? (
            <>
              {this.props.user.logged ? <CompoUser apodo={this.props.user.apodo} cerrarSesion={() => this.props.dispatchLogout()}/> :<CompoMenu/>}
            </>
          ) : null}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ user: state.userReducer, results: state.searchReducer });
const mapDispatchToProps = {
  dispatchLogout: () => logout(),
  dispatchResults: (vec) => addSearchResults(vec),
};
export default connect(mapStateToProps, mapDispatchToProps)(Head);

const CompoBusq = (props) => {
  return (
    <>
      <input className="inputo" type="text" placeholder="buscar en el sitio" value={props.palBusq} onChange={props.cambiar} />
      <NavLink onClick={props.checkInputs} to={`/searching/${props.palBusq}`}>
        <button className="boton-oscuro ph-2 pv-1 ml-0"> <img className="icono-1 mr-0" src={lupa2} /> Buscar </button>
      </NavLink>
    </>
  );
};
const CompoMenu = () => {
  return(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",marginRight:'0.2em' }}>
      <NavLink to="/register">
        <button className="boton-oscuro ph-2 mt-0"> <img className="icono-1" src={listado} /> Registrarse </button>
      </NavLink>
      <NavLink to="/loggin">
        <button className="boton-oscuro ph-2 mt-0 mb-1"> <img className="icono-1" src={entrar} /> Iniciar Sesión </button>
      </NavLink>
    </div>
  )
};
const CompoUser = (props) => {
  return(
  <div style={{display:'flex',flexDirection:'column',alignItems:'stretch'}}>
    <button  className="boton-oscuro ph-2 mt-0 expandido" disabled style={{ backgroundColor: "#15223c",padding:'0' }}>
        <img className="icono-1" src={usuario2} /> {props.apodo} 
    </button>
    <button  className="boton-oscuro expandido ph-2" onClick={props.cerrarSesion}>
        <img className="icono-1" src={salir} /> Cerrar Sesión
    </button>
    <NavLink to="/settings">
      <button className="boton-oscuro expandido mb-1">
          <img className="icono-1" src={settings} /> Cuenta      
      </button>
    </NavLink>
  </div>  )
}

const estiloHeader = {
  position: "sticky",
  top: 0,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  background: "rgb(50,60,70)",
  alignItems: "center",
};
const estiloHeaderCompartido = { // -->para efecto: el header se desplaza y el subheader queda fijo como barra superior
  top: 0,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  background: "rgb(50,60,70)",
  alignItems: "center",
};
const estiloSubHeader = {
  position:"fixed",
  //position: "sticky", -->para efecto: el header se desplaza y el subheader queda fijo como barra superior
  //top: 0, -->para efecto: el header se desplaza y el subheader queda fijo como barra superior
  display: "flex",
  justifyContent: "center",
  width: "100%",
  background: "rgb(50,60,70)",
  alignItems: "center",
};