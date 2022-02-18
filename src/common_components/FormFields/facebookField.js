import React from 'react';
import face from '../../../static_files/imgs/icons/facebook.svg';

export default class FacebookField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc1 === this.props.redSoc1 && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="txt-claro campo-formu mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={face}/>
                    <label className='titulo-2 mr-2 ml-0'> Facebook </label>
                </div>
                <input className="inputo" placeholder="si quieres dar a conocer tu facebook" id="face" name="facebook" 
                        onChange={this.props.manejarCambio} maxLength={118} 
                        value={this.props.redSoc1} 
                        size={40}/>
            </div>
        )
    }
}