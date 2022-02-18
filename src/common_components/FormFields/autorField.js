import React from 'react';
import usuario from '../../../static_files/imgs/icons/usuario.svg';

export default class AutorField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className= "campo-formu txt-claro">
                <div className='etiqueta'>
                    <img className='icono-1' src={usuario}/>
                    <label className='titulo-2 mr-1 ml-0'>Autor</label>
                </div>
                <input className='inputo' placeholder="indica el/les autor/es" name="autor" onChange={this.props.manejarCambio} value={this.props.valor} size={40}/>
            </div>
        )
    }
}