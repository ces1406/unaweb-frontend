import React from 'react';
import Template from '../common_components/pageTemplate';
import { NavLink } from 'react-router-dom';
//import {Card, CardColumns, Row, Col, Button, Badge} from 'react-bootstrap';
import imgSeparador from '../../static_files/imgs/separador.png';
import {doSimpleCorsGetRequest,isTokenOk} from '../api_requests/requests';
import UltimosComents from './UltimosComents';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/useractions';
import a from '../../static_files/imgs/1.png';
import b from '../../static_files/imgs/2.png';
import c from '../../static_files/imgs/3.png';
import d from '../../static_files/imgs/4.png';
import e from '../../static_files/imgs/5.png';
import f from '../../static_files/imgs/6.png';
import g from '../../static_files/imgs/7.png';
import h from '../../static_files/imgs/8.png';
import i from '../../static_files/imgs/9.png';
import j from '../../static_files/imgs/10.png';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secciones: [],
            imagenes: new Map(),
        }
    }
    componentDidMount() {
        let mapa = new Map();
        mapa.set("1.png",a);
        mapa.set("2.png",b);
        mapa.set("3.png",c);
        mapa.set("4.png",d);
        mapa.set("5.png",e);
        mapa.set("6.png",f);
        mapa.set("7.png",g);
        mapa.set("8.png",h);
        mapa.set("9.png",i);
        mapa.set("10.png",j);
        this.setState({imagenes:mapa});
        if (!this.props.user.token || !isTokenOk(this.props.user.token)) {
            this.props.dispatchLogout();
        };
        this.getSections();
    }
    getSections() {
        doSimpleCorsGetRequest('/secciones')
        .then(rta=>{this.setState({secciones:rta.secciones})})
        .catch();
    }
    render() {
        return (
            <Template >
                <div className='cuerpo'>
                    <UltimosComents />
                    <section id="secciones">
                        <img alt="" src={imgSeparador} style={{ width: "100%", height:"2ex", margin: "0", padding: "0" }}/>
                        <h1 className='titulo-1 txt-claro'>Secciones</h1>
                        <img alt="" src={imgSeparador} style={{ width: "100%", height:"2ex", margin: "0", padding: "0" }}/>
                        {this.state.secciones.map(sec =>
                            <NavLink to={`/secciones/${sec.idSeccion}/${sec.nombreSeccion}`} className="card-gral card-seccion" key={sec.idSeccion}>
                                <img className='imagen-seccion' src={this.state.imagenes.get(sec.img)}/>
                                <div className='card-cuerpo ml-1'>
                                    <div className='titulo-1 txt-oscuro'>{sec.nombreSeccion}</div>
                                    <div className='titulo-3 txt-oscuro'>{sec.descripcion}</div>
                                    <span className='card-pie pastilla txt-oscuro pv-0 ph-2'>{sec.idSeccion===9?'apuntes subidos':'temas creados'}: {sec.cantTemas} </span>
                                </div>
                            </NavLink>
                        )}
                    </section>  
                </div>
            </Template>
        )
    }
}
const mapStateToProps = (state) => ({ user: state.userReducer });
const mapDispatchToProps = { dispatchLogout: () => logout() }

export default connect(mapStateToProps, mapDispatchToProps)(Home);