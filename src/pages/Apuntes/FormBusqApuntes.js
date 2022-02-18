import React from 'react';
import {NavLink} from 'react-router-dom';
import { connect } from 'react-redux';
import TituloField from '../../common_components/FormFields/tituloField';
import AutorField from '../../common_components/FormFields/autorField';
import MateriaField from '../../common_components/FormFields/materiaField';
import CatedraField from '../../common_components/FormFields/catedraField';
import imgSeparador from '../../../static_files/imgs/separador.png';
import lupa from '../../../static_files/imgs/icons/lupa3.svg';
import nube from '../../../static_files/imgs/icons/nube.svg';

class FormBusq extends React.Component{
    render(){
        return(
            <>
                <img src={imgSeparador} className='linea' />
                <h1 className='txt-claro titulo-1'>Búsqueda de Apuntes</h1>
                <img src={imgSeparador} className='linea' />
                    <form onSubmit={this.props.handleSubmit}>
                        <TituloField valor={this.props.titulo} manejarCambio={this.props.handleChange} />
                        <AutorField valor={this.props.autor} manejarCambio={this.props.handleChange} />
                        <MateriaField valor={this.props.materia} manejarCambio={this.props.handleChange} />
                        <CatedraField valor={this.props.catedra} manejarCambio={this.props.handleChange} />
                        <button className="boton-oscuro ph-2 mv-2 centrade" type="submit">
                            <img src={lupa} className='icono-1 mr-1'/>Buscar
                        </button>
                    </form>
                    <img src={imgSeparador} className='linea'/>

                    {this.props.user.logged ?
                        <>
                            <NavLink to={`/secciones/10/Apuntes/subida`}>
                                <button className="boton-oscuro ph-2 centrade">
                                    <img src={nube} className='icono-1 mr-1'/>Publicar un apunte
                                </button>
                            </NavLink>
                            <img src={imgSeparador} className='linea'/>
                        </>
                        : null
                    }

            </>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, null)(FormBusq);