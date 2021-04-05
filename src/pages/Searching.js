import React from 'react';
import {  NavLink  } from 'react-router-dom';
import { connect } from 'react-redux';
import Template from '../common_components/pageTemplate';
import { Button,Card} from 'react-bootstrap';
import Paginacion from '../common_components/paginacion'
import {addSearchResults} from '../redux/actions/searchactions';
import { ITEMS_POR_PAG } from '../globals';
import { IoMdShareAlt, IoMdCalendar} from 'react-icons/io';
import imgSeparador from '../../static_files/imgs/separador.png';


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
                <img src={imgSeparador}  alt="imagen" style={{ width: '100%', height: '4.2ex', margin: '0', padding: '0' }} />
                <h1 style={{ color: '#EFECEA', textAlign: 'center', fontSize: '3.7ex', fontWeight: 300, margin: '0', padding: '0' }}>
                    Busqueda para: {this.props.palabra}                   
                </h1>
                {this.state.resultados.map(elem =>
                    <Card className="mb-1" style={{ backgroundColor:  "rgba(40,42,52,0.85)", borderRadius: "0.4em",borderColor:"rgb(10,10,12)"}} key={elem.idApunte}>                                    
                    <Card.Header className="text-center pb-0">
                        <Card.Title as="h5" style={{color: "rgb(233, 212, 134)"}}><>Sección:&nbsp;{elem.Seccion.nombreSeccion} </>  </Card.Title>       
                        <Card.Title as="h5" style={{color: "rgb(233, 212, 134)"}}>Tema:&nbsp;{elem.titulo}</Card.Title>                                     
                    </Card.Header>
                    <Card.Body className="mb-0 pb-0 mt-0">
                        <Card.Text id="comentarioInicial" dangerouslySetInnerHTML={{ __html: elem.comentarioInicial }} className="mb-0 pb-0 mt-0" ></Card.Text>
                        <small className="text-muted text-right mb-0 pb-0 mt-0" style={{color: "rgb(233, 212, 134)"}}>                                                                                      
                            Creado el <IoMdCalendar className="mr-1 " size={18}/>
                            {elem.dia}-{elem.mes + 1}-{elem.anio}&nbsp;a las&nbsp;{elem.hora}:{elem.min}&nbsp;hs 
                        </small>
                    </Card.Body>
                    <Card.Footer className="text-center mb-1 pb-0 mt-0">
                        <NavLink to={`/secciones/${elem.Seccion.idSeccion}/${elem.Seccion.nombreSeccion}/${elem.idTema}`} >
                            <Button variant="outline-info" size="sm"><IoMdShareAlt className="mr-1 pb-1" size={20}/>Ir</Button>
                        </NavLink>
                    </Card.Footer>
                </Card>
                )}
                <div className='mt-3'>
                    <Paginacion cant={this.props.busqueda.resultados.length} activa={this.state.pagActiva} next={this.nextPage} go={this.goToPage} prev={this.prevPage} />
                </div>
            </Template>
        )
    }
}

const mapStateToProps = (state) => ({ busqueda:state.searchReducer });
const mapDispatchToProps = {dispatchResults : (vec)=>addSearchResults(vec)}
export default connect(mapStateToProps, mapDispatchToProps)(BusqResults);