import React from 'react';
import yout from '../../../static_files/imgs/icons/youtube.svg';

export default class YoutubeField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc3 === this.props.redSoc3 && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="campo-formu txt-claro mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={yout} />
                    <label className='titulo-2 mr-2 ml-0'>Youtube </label >
                </div>
                <input className='inputo' placeholder="si quieres dar a conocer tu canal de youtube" id="yout" name="youtube" 
                    onChange={this.props.manejarCambio} maxLength={118} 
                    value={this.props.redSoc3} 
                    size={45}/>
            </div>
        )
    }
}