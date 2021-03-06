import React from 'react';
import link from '../../../static_files/imgs/icons/link.svg';

export default class LinkField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="campo-formu txt-claro mv-2">
                <div className='etiqueta'>
                    <img className='icono-1' src={link}/>
                    <label className="titulo-2 mr-1 ml-0">Link</label>
                </div>
                <input className="inputo" placeholder="link a la pagina en donde se encuentra el apunte" name="link" 
                        onChange={this.props.manejarCambio} value={this.props.valor} size={45}/>
            </div>
        )
    }
}