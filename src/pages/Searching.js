import React from 'react';
import {  NavLink  } from 'react-router-dom';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import Paginacion from '../common_components/paginacion'
import {addSearchResults} from '../redux/actions/searchactions';
import { ITEMS_POR_PAG } from '../globals';
import imgSeparador from '../../static_files/imgs/separador.png';
import calendario from '../../static_files/imgs/icons/calendario-black.svg';


class BusqResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultados:this.props.busqueda.resultados.slice(0,ITEMS_POR_PAG),
            palabra: this.props.palabra,
            pagActiva:1,
        }
        this.nextPage = this.nextPage.bind(this)
        this.goToPage = this.goToPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
    }
    goToPage(nro) { this.setState({ pagActiva: nro }) }
    nextPage() {
        let activa = this.state.pagActiva + 1
        this.setState({ pagActiva: activa });
    }
    prevPage() {  this.setState({ pagActiva: this.state.pagActiva - 1 })   }
    componentWillUnmount(){
        this.props.dispatchResults([])
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.pagActiva !== prevState.pagActiva) {
            let vecAux = this.props.busqueda.resultados.slice((this.state.pagActiva - 1) * ITEMS_POR_PAG, (this.state.pagActiva * ITEMS_POR_PAG))
            this.setState({resultados:vecAux})
        }
        if (this.props.busqueda.resultados.length!==prevProps.busqueda.resultados.length){
            this.setState({resultados:this.props.busqueda.resultados.slice(0,ITEMS_POR_PAG)})
        }
    }
    render() {
        return (
            <Template funcActua={this.actualizarBusq}>
                <img src={imgSeparador}  alt="imagen" className='linea'/>
                <h1 className='titulo-1 txt-claro mb-2'> Busqueda para: {this.props.palabra} </h1>
                {this.state.resultados.map(elem =>
                    <NavLink key={elem.idApunte} className='card-compuesta' to={`/secciones/${elem.Seccion.idSeccion}/${elem.Seccion.nombreSeccion}/${elem.idTema}`} >                                   
                        <div className='card-cabecera'>
                            <h5 className='titulo-3' >Sección:&nbsp;{elem.Seccion.nombreSeccion} </h5>       
                            <h5 className='titulo-3'>Tema:&nbsp;{elem.titulo}</h5>                                     
                        </div>
                        <div className='texto-comentario-sm'>
                            <p dangerouslySetInnerHTML={{ __html: elem.comentarioInicial }} className="mb-0 pb-0 mt-0" ></p>
                        </div>
                        <small className="titulo-card-1" >                                                                                      
                            Creado el <img src={calendario} className='icono-0 mr-1'/>
                            {elem.fecha.toLocaleString(undefined,{day:'numeric',month:'long',year:'numeric', hour:'2-digit',minute:'2-digit'})}hs
                        </small>
                    </NavLink> )}
                <div className='mv-3'>
                    <Paginacion cant={this.props.busqueda.resultados.length} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                </div>
            </Template>
        )
    }
}
// {elem.dia}-{elem.mes + 1}-{elem.anio}&nbsp;a las&nbsp;{elem.hora}:{elem.min}&nbsp;hs 
const mapStateToProps = (state) => ({ busqueda:state.searchReducer });
const mapDispatchToProps = {dispatchResults : (vec)=>addSearchResults(vec)}
export default connect(mapStateToProps, mapDispatchToProps)(BusqResults);