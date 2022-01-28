import React from "react";
import { IoIosListBox, IoIosLogIn, IoMdSearch, IoIosPerson, IoIosLogOut, IoIosSettings } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { doSimpleCorsGetRequest } from "../api_requests/requests";
import logo from "../../static_files/imgs/logouna80px.webp";
import lupa from "../../static_files/imgs/search80px.webp";
import menu from "../../static_files/imgs/menu80px.webp";
import { connect } from "react-redux";
import { logout } from "../redux/actions/useractions";
import { addSearchResults } from "../redux/actions/searchactions";
import { SCREEN_SMALL } from "../globals";

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
            let fecha = new Date(elem.fechaCreacion);
            elem.dia = fecha.getDate();
            elem.mes = fecha.getMonth();
            elem.anio = fecha.getFullYear();
            elem.milisecs = fecha.getTime();
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
    const media = window.matchMedia("max-width:728").matches;
    console.log("media->", media);
    console.log("tam->", this.state.tam);
    console.log("tam->", this.state.palBusq);
    // <div style={{display:'flex',flexDirection: 'column', alignItems:'center'}}>
    return (
      <>
        <header style={estiloHeader}>
          <NavLink to="/" style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <img src={logo} alt="imagen" width="60" style={{ margin: "0.5em" }} />
            {this.state.tam < SCREEN_SMALL ? null : <h6 style={{ color: "#ecc538", textAlign: "center" }}>Sitio web de la comunidad UNA</h6>}
          </NavLink>

          <div style={{ display: "flex", alignItems: "center" }}>
            {this.state.tam < SCREEN_SMALL ? 
              <img src={lupa} width="60" style={{ margin: "0.5em" }} onClick={() => this.setState({ displaySearch: !this.state.displaySearch, displayMenu: false })} />
             : <CompoBusq checkInputs={this.checkInputs} palBusq={this.state.palBusq} cambiar={this.handleChange}/>}
          </div>

          <div>
            {this.state.tam < SCREEN_SMALL ? (
              <img src={menu} width="60" style={{ margin: "0.5em" }} onClick={() => this.setState({ displayMenu: !this.state.displayMenu, displaySearch: false })} />
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
        <button className="boton-oscuro">
          <IoMdSearch className="mr-2" /> Buscar </button>
      </NavLink>
    </>
  );
};
const CompoMenu = () => {
  return(
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <NavLink to="/register">
        <button className="boton-oscuro">{" "}
          <IoIosListBox className="mr-2" /> Registrarse{" "} </button>
      </NavLink>
      <NavLink to="/loggin">
        <button className="boton-oscuro">{" "}<IoIosLogIn /> Iniciar Sesión{" "} </button>
      </NavLink>
    </div>
  )
};
const CompoUser = (props) => {
  <>
    <button variant="boton-oscuro" className="pt-0 pb-0" disabled style={{ backgroundColor: "#15223c" }}>
      <h5 className="mt-1">
        <IoIosPerson className="mr-2" /> {props.apodo} </h5>
    </button>
    <button variant="outline-info" onClick={props.cerrarSesion} className="pt-0 pb-0">
      <h6 className="mt-0 mb-0 pt-0 pb-0">
        <IoIosLogOut className="mr-1" /> Cerrar Sesión
      </h6>
    </button>
    <button variant="outline-info" className="pt-0 pb-0">
      <NavLink to="/settings">
        <h6 className="mt-0 mb-0 pt-0 pb-0">
          <IoIosSettings className="mr-2" /> Cuenta
        </h6>
      </NavLink>
    </button>
  </>  
}

const estiloHeader = {
  position: "sticky",
  top: 0,
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  background: "rgb(40,45,60)",
  alignItems: "center",
};
const estiloSubHeader = {
  position: "sticky",
  top: 0,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  background: "rgb(45,50,65)",
  alignItems: "center",
};