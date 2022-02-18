import React from 'react';
import users from '../../../static_files/imgs/icons/personas.svg';

export default class ProfesoresField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="campo-formu txt-claro mv-1">                
                <div className='etiqueta'>
                    <img className='icono-1' src={users}/>
                    <label className="titulo-2 mr-1 ml-0">Profesores</label>
                </div>
                <input className='inputo' placeholder="indica el/los profesor/es" name="profesor" 
                        onChange={this.props.manejarCambio} value={this.props.valor} size={45}/>
                
            </div>
        )
    }
}