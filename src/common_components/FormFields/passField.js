import React from 'react';
import llave from '../../../static_files/imgs/icons/llave.svg';

export default class PassField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.pass === this.props.pass && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="txt-claro campo-formu mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={llave} />
                    <label className='titulo-2 mr-2 ml-0'>Contraseña</label>
                </div>  
                <input className='inputo' type="password" name={this.props.name} placeholder="entre 6 y 8 caracteres" maxLength={8} 
                        onChange={this.props.manejarCambio} 
                        value={this.props.pass} 
                        size={20}
                />
            </div>
        )
    }
}