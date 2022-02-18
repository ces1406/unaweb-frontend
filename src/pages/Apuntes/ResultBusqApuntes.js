import React from 'react';
import usuario from '../../../static_files/imgs/icons/usuario-black.svg';
import check from '../../../static_files/imgs/icons/check-simple.svg';
import close from '../../../static_files/imgs/icons/close.svg';
import link from '../../../static_files/imgs/icons/link-black.svg';
import materia from '../../../static_files/imgs/icons/profesor-black.svg';
import titulo from '../../../static_files/imgs/icons/portada-black.svg';
import cara from '../../../static_files/imgs/icons/cara-triste.svg';
import { connect } from 'react-redux';
import imgSeparador from '../../../static_files/imgs/separador.png';

class Resultados extends React.Component{
    render(){
        return(
            this.props.resultados.length===0?
                <div className='centrade'>
                    <img src={cara} className='icono-2 centrade'/> 
                    <div className="titulo-3 txt-claro centrade"> No se encontraron apuntes </div>  
                </div>
            :
            <>
            <h1 className='txt-claro titulo-2'>Resultados</h1>
                    {this.props.resultados.map(elem =>
                        <div key={elem.idApunte}>
                            <img src={imgSeparador} alt="imagen" style={{ width: '100%', height: '2ex', margin: '0', padding: '0' }} />
                            <div className="card-compuesta">
                                    <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={titulo} className='icono-0 mr-1'/> Título:&nbsp;{elem.titulo}</div>
                                    <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={materia} className='icono-0 mr-1'/> Materia:&nbsp;{elem.materia}</div>
                                    <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={usuario} className='icono-0 mr-1'/> Autor/es:&nbsp;{elem.autores}</div>
                                    <div className='titulo-3' style={{display:'flex',alignItems:'center'}}><img src={link} className='icono-0 mr-1'/> Link:&nbsp;{elem.dirurl}</div>
                                    <a  href={elem.dirurl} target='_blank'><button className="boton-oscuro ph-2 pv-1 mv-1">Abrir el apunte </button></a>
                                    {this.props.user.rol === 'ADMI' ?
                                        <form onSubmit={this.delApunte} >
                                            <input type="hidden" name="idApunte" value={elem.idApunte} />
                                            <div>
                                                <button disabled={elem.erasable} value={elem.idApunte} onClick={this.props.setErasable} className="boton-oscuro centrade ph-2">
                                                    <img src={close} className='icono-1 mr-1'/>Eliminar apunte
                                                </button>
                                            </div>
                                            {(elem.erasable) ?
                                                <>
                                                    <img src={imgSeparador} className='linea' />
                                                    <div style={{display:'flex',justifyContent:'center'}}>
                                                        <button className="boton-oscuro ph-2 mr-2 mb-1" onClick={this.props.eliminar} value={elem.idApunte}>
                                                            <img src={check} className='icono-1 mr-1' />Cofirmar
                                                        </button>
                                                        <button onClick={this.props.unsetErasable} className="boton-oscuro ph-2 mb-1" value={elem.idApunte}>
                                                            <img src={close} className='icono-1 mr-1' />Cancelar
                                                        </button>
                                                    </div>
                                                </>
                                            : null}
                                        </form>
                                    : null}
                            </div>
                        </div>
                    )}
            </>
        )
    }
}

const mapStateToProps = (state) => ({ user: state.userReducer });
export default connect(mapStateToProps, null)(Resultados);