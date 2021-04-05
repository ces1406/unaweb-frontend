import React from 'react';
import { Form, Col, Button,Row} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import { IoIosCloudUpload, IoMdSearch } from 'react-icons/io';
import { connect } from 'react-redux';
import TituloField from '../../common_components/FormFields/tituloField';
import AutorField from '../../common_components/FormFields/autorField';
import MateriaField from '../../common_components/FormFields/materiaField';
import CatedraField from '../../common_components/FormFields/catedraField';
import imgSeparador from '../../../static_files/imgs/separador.png';

class FormBusq extends React.Component{
    render(){
        return(
            <>
            <h1 style={{ textAlign: "center" }}>Búsqueda de Apuntes</h1>
                    <Form onSubmit={this.props.handleSubmit}>
                        <TituloField valor={this.props.titulo} manejarCambio={this.props.handleChange}/>
                        <AutorField valor={this.props.autor} manejarCambio={this.props.handleChange}/>
                        <MateriaField valor={this.props.materia} manejarCambio={this.props.handleChange}/>
                        <CatedraField valor={this.props.catedra} manejarCambio={this.props.handleChange}/>
                        <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" >
                            <IoMdSearch style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Buscar
                        </Button>
                    </Form>
                    <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />

                    {this.props.user.logged ?
                        <>
                            <Col md={{ span: 4, offset: 4 }} >
                                <NavLink to={`/secciones/10/Apuntes/subida`}>
                                    <Button variant="dark" size="sm" className="smallButton mt-1" type="submit" block>
                                        <IoIosCloudUpload style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Publicar un apunte
                                    </Button>
                                </NavLink>
                            </Col>
                            <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                        </>
                        : null
                    }

            </>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, null)(FormBusq);