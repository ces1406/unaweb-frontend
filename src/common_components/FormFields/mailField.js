import React from 'react';
import mail from '../../../static_files/imgs/icons/mail.svg';

export default class MailField extends React.Component{
    shouldComponentUpdate(nextProps,nextState ){
        if(nextProps.mail === this.props.mail ){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="txt-claro campo-formu mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={mail} />
                    <label className='titulo-2 mr-2 ml-0'> E-Mail </label>
                </div>
                <input className='inputo' placeholder={this.props.placeholder} name="mail" type="email" id="email" 
                        maxLength={62} onChange={this.props.manejarCambio} value={this.props.mail} size={40}/>
            </div>
        )
    }
}