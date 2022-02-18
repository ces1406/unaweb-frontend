import React from 'react';
import insta from '../../../static_files/imgs/icons/instagram.svg';

export default class SocialField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc2 === this.props.redSoc2 && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="txt-claro campo-formu mv-3">
                <div className='etiqueta'>
                    <img className='icono-1 ' src={insta} />
                    <label className='titulo-2 mr-2 ml-0'>Otra red social </label>
                </div>
                <input className='inputo' placeholder="si quieres dar a conocer un blog/página/Instagram" id="blg" name="blog" 
                    onChange={this.manejarCambio} maxLength={118} 
                    value={this.props.redSoc2}
                    size={45} />
            </div>
        )
    }
}