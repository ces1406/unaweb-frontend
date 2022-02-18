import React from 'react';
import check from '../../../static_files/imgs/icons/check-simple.svg';
import cerrar from '../../../static_files/imgs/icons/close.svg';

export class CancelConfirm extends React.Component{
    render(){
        return(
            < div style={{display:'flex',justifyContent:'center'}}>
                <button type="submit" className="boton-oscuro ph-2 pv-0 mr-2 mb-1">
                    <img src={check} className='icono-1 mr-1'/>Cofirmar
                </button>
                <button name={this.props.name} className="boton-oscuro  ph-2 pv-0 mb-1" onClick={this.props.cancel} >
                    <img src={cerrar} name={this.props.name} className='icono-1 mr-1 ph-1 pv-1'/>Cancelar 
                </button>
            </div>
        )
    }
}

export class ConfirmActionField extends React.Component{
    render(){
        return(
            <>
                {this.props.modif?
                    <button onClick={this.props.onclick} className="boton-oscuro centrade mb-1" >
                        <img src={check} className='icono-1 mr-1'/>Modificar
                    </button>
                    :
                    <CancelConfirm cancel={this.props.cancel} name={this.props.name}/>
                }
            </>
        )
    }
}