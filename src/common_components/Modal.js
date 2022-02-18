import React from 'react';

export default class Modal extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div style={{display:this.props.show?'block':'none', textAlign:'center',borderRadius:'.4em',border:'solid 1px rgb(210,220,230)', backgroundColor:'white',
                position:'fixed', width:'40%', top:'20%',left:'50%', marginLeft:'-20%'}} >
                <div className='titulo-3 txt-oscuro' style={{backgroundColor:'rgb(210,220,230)'}}>{this.props.titulo}</div>
                <div className='titulo-3'>{this.props.cuerpo}</div>
                <div>
                    <button className='boton-oscuro ph-3 pv-2 centrade mv-2'  onClick={this.props.manejaCierre}>OK</button>
                </div>
            </div>
        )
    }
}