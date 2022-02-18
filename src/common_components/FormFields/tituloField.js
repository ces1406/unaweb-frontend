import React from 'react';
import titulo from '../../../static_files/imgs/icons/portada.svg';

export default class TituloField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className= "campo-formu txt-claro mv-2">
                <div className='etiqueta'>
                    <img className='icono-1' src={titulo}/>
                    <label className="titulo-2 mr-1 ml-0">Titulo</label>
                </div>
                <input placeholder="indica el titulo" id="idTitulo" name="titulo" className='inputo'
                    onChange={this.props.manejarCambio} value={this.props.valor} size={40}/>
            </div>
        )
    }
}