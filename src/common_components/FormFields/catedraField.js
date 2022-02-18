import React from 'react';
import catedra from '../../../static_files/imgs/icons/profesor.svg';

export default class CatedraField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
            <div className="campo-formu txt-claro">                
                <div className='etiqueta'>
                    <img className='icono-1' src={catedra}/>
                    <label className="titulo-2 mr-1 ml-0">C&aacute;tedra</label>
                </div>
                <input className='inputo' placeholder="indica la c&aacute;tedra" name="catedra" 
                        onChange={this.props.manejarCambio} value={this.props.valor} size={40}/>
                
            </div>
        )
    }
}