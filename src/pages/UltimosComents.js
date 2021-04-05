import React from 'react';
import {IoIosPerson} from 'react-icons/io';
import { Col, ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { doSimpleCorsGetRequest } from '../api_requests/requests';

export default class UltimosComents extends React.Component {
    constructor(props){
        super(props);
        this.state={
            ultimosCom:[],
            idTimer:0
        }
        this.getUltimosComs = this.getUltimosComs.bind(this);
    }
    componentDidMount(){
        this.getUltimosComs();
        this.setState({idTimer:setInterval(this.getUltimosComs,60000)});
    }
    getUltimosComs(){
        doSimpleCorsGetRequest('/temas/ultimoscomentarios')
        .then(rta=>{
            let rtaAux = rta.map(elem => {
                let fecha = new Date(elem.fechaHora)
                elem.dia = fecha.getDate();
                elem.mes = fecha.getMonth();
                elem.anio = fecha.getFullYear();
                elem.milisecs = fecha.getTime();
                elem.hora = fecha.getHours();
                elem.min = fecha.getMinutes();
                return elem
              });
              return (rtaAux);
        })
        .then(rta=>{
            this.setState({ultimosCom:rta})
        })
        .catch();
    }
    componentWillUnmount() {
        clearInterval(this.state.idTimer)
    }
    render(){
        return(
            <Col >
            <img className="responsive-img" alt="" src="./static_files/imgs/separador.png" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }}></img>
            <div >
              <h1 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>Ultimos comentarios</h1>
            </div>
            <img className="responsive-img" alt="" src="./static_files/imgs/separador.png" style={{ width: '100%', height: '4.2ex' }}></img>
            <ListGroup>
            {
              this.state.ultimosCom.map((coment, index) =>
              <ListGroup.Item action bsPrefix='navBox' key={coment.idComentario}>
                <NavLink to=  {coment.idTema?
                                `/secciones/${coment.origen.idSeccion}/${coment.origen.Seccion.nombreSeccion}/${coment.idTema}`
                                :`/secciones/${coment.origen.idSeccion}/Opiniones de cátedras y profesores/foro/${coment.origen.idCatedra}`
                }>
                <div id="infoUser">
                  <IoIosPerson style={{ fontSize: 26 }} /> {coment.Usuario.apodo}&nbsp;:
                </div>
                <div id='rtaComentario' dangerouslySetInnerHTML={{ __html: coment.contenido }} className="mt-2"/>             

                {coment.idTema?
                  <>
                    <div id='infoFech'>Sección: {coment.origen.Seccion.nombreSeccion}</div>
                    <div id='infoFech'>Tema: {coment.origen.titulo}</div>
                  </>
                  :
                  <>
                    <div id='infoFech'>Sección: Opiniones de cátedras y profesores</div>
                    <div id='infoFech'>Opinion de la cátedra: {coment.origen.catedra}</div>
                    <div id='infoFech'>Materia: {coment.origen.materia}</div>
                  </>
                }
                <div id="infoFech" className="mt-1">
                  (el {coment.dia}-{coment.mes + 1}-{coment.anio}&nbsp;a las&nbsp;{coment.hora}:{coment.min}&nbsp;hs)
                </div>
                </NavLink>
              </ListGroup.Item>
              )
            }
            </ListGroup>
          </Col>
        )
    }
}