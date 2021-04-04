import React from 'react';
import { IoIosCloseCircle,IoMdCheckmarkCircle,  IoIosPerson, IoIosBook, IoIosPaper,IoIosLink, IoIosApps } from 'react-icons/io';
import { connect } from 'react-redux';
import { Row,  Button, Form, Media ,Container} from 'react-bootstrap';

class Resultados extends React.Component{
    /*shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor){
            return false;
        }
        return true;
    }*/
    render(){
        return(
            <>
            <h1 style={{ textAlign: "center" }}>Resultados</h1>
                    {this.props.resultados.map(elem =>
                        <div key={elem.idApunte}>
                            <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                            <Media className="mr-2 mt-2 mb-2" style={{ display: "inline-flex !important", backgroundColor: "rgba(40,42,52,0.5)", borderRadius: "1em" }}>
                                <Media.Body>
                                    <div id="infoUser"><IoIosBook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Título:&nbsp;{elem.titulo}
                                    </div>
                                    <div id='rtaComentario'><IoIosApps style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Materia: {elem.materia}
                                    </div>
                                    <div id='rtaComentario'><IoIosPerson style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Autor/es: {elem.autores}
                                    </div>
                                    <div id='rtaComentario'><IoIosLink style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />
                                    Link: {elem.dirurl}
                                    </div>
                                    <Button variant="dark" size="sm" className="smallButton mt-1" href={elem.dirurl} target="_blank" >
                                        <IoIosPaper style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Abrir el apunte
                                    </Button>
                                    {this.props.user.rol === 'ADMI' ?
                                        <Form onSubmit={this.delApunte} >
                                            <input type="hidden" name="idApunte" value={elem.idApunte} />
                                            <Container>
                                                <Row className="justify-content-md-center">
                                                    <Button disabled={elem.erasable} value={elem.idApunte} variant="dark" size="sm" onClick={this.props.setErasable} className="smallButton mt-1" style={{ marginBottom: "0.2em" }}>
                                                        <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Eliminar apunte
                                                    </Button>
                                                </Row>
                                            </Container>
                                            {(elem.erasable) ?
                                                <>
                                                    <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                                                    <Row className="justify-content-md-center">
                                                        <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                                                            <IoMdCheckmarkCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cofirmar
                                                        </Button>&nbsp;&nbsp;
                                                        <Button onClick={this.props.unsetErasable} value={elem.idApunte} name="cancelRedSoc3" variant="dark" size="sm" className="smallButton mb-2 mt-1" >
                                                            <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cancelar
                                                        </Button>
                                                    </Row>
                                                </>
                                            : null}
                                        </Form>
                                    : null}
                                </Media.Body>
                            </Media>
                        </div>
                    )}
            </>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, null)(Resultados);