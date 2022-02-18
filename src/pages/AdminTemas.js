import React from 'react';
import cancel from '../../static_files/imgs/icons/close.svg';
import confirm from '../../static_files/imgs/icons/check.svg';
import imgSeparador from '../../static_files/imgs/separador.png';

export default class AdminTemas extends React.Component{
    render(){
        return(
            <form onSubmit={this.props.onsubmit} >
                <input type="hidden" name="idTema" value={this.props.tema.idTema} />
                <button disabled={this.props.tema.erasable} value={this.props.tema.idTema} onClick={this.props.marcar} className="boton-oscuro pv-0 ph-2 centrade mt-1" >
                    <img className='icono-1 mr-0' src={cancel} /> Eliminar Tema
                </button>
                {
                    (this.props.tema.erasable)?
                        <>                            
                            <div className='titulo-3 txt-claro centrade mt-1'>Si eliminas este tema se borrará todo su contenido y comentarios</div>
                            <div style={{display:'flex', justifyContent:'center'}}>
                                <button type="submit" className="boton-oscuro ph-2 mr-2" >
                                    <img className='icono-1 mr-0' src={confirm}/> Cofirmar
                                </button> 
                                <button value={this.props.tema.idTema} onClick={this.props.desmarcar} name="cancelRedSoc3" className="boton-oscuro ph-2" >
                                    <img className='icono-1 mr-0' src={cancel} /> Cancelar
                                </button>
                            </div>
                            <img src={imgSeparador}  alt="imagen" className='linea' />
                        </>
                        : null
                }
            </form>
        )
    }
}