import React from 'react';
import usuario from '../../../static_files/imgs/icons/usuario.svg';

export default class ApodoField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.apodo === this.props.apodo && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="txt-claro campo-formu mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={usuario} />
                    <label className='titulo-2 mr-2 ml-0'>Apodo</label>
                </div>                
                <input className="inputo" placeholder="escoge un apodo" name="apodo" id="apodo" 
                        onClick={this.props.sobreClick}  
                        onBlur={this.props.sobreBlur} 
                        onChange={this.props.manejarCambio} 
                        maxLength={30} 
                        value={this.props.apodo} 
                        size={20}
                />
            </div>
        )
    }
}