import React from 'react';
import materia from '../../../static_files/imgs/icons/listado.svg';
import Materias from '../Materias';

export default class MateriaField extends React.Component{
    shouldComponentUpdate(nextProps,nextState ){
        if(nextProps.valor === this.props.valor && this.props.tam === nextProps.tam){
            return false;
        }
        return true;
    }
    render(){
        return(
                <div className="campo-formu mv-1">
                    <div className='etiqueta txt-claro '>
                        <img className='icono-1' src={materia}/>
                        <label className="titulo-2 mr-1 ml-0">Materia</label>
                    </div>
                    <select className='inputo' name="materia" onChange={this.props.manejarCambio} value={this.props.valor} custom="true" style={{width:'80%'}}>
                            {Materias.map((elem, index) => <option key={index}>{elem}</option>)}
                    </select>
                    
                </div>
        )
    }
}