import React from 'react';
import Cabecera from './Cabecera';

export default class Comentario extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='card-compuesta'>
                <Cabecera tamicono='icono-2' user={this.props.user} avatarsrc={this.props.avatarsrc} izq={this.props.izq} />
                <div className='card-cuerpo'>
                    <div className="txt-oscuro texto-comentario-md" dangerouslySetInnerHTML={{ __html: this.props.cuerpo}} />
                </div>
                <div className='card-pie'>{this.props.pie}</div>
            </div>
        )
    }
}