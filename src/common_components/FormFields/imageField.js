import React from 'react';
import camara from '../../../static_files/imgs/icons/camara.svg';

export default class ImageField extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imagenSrc:'',
            imagenName:'sin imagen'
        }
        this.mostrar = this.mostrar.bind(this)
    }
    mostrar(e){
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = ()=>{
            this.setState({imagenSrc:reader.result,imagenName:e.target.files[0].name});
        }
    }
    render(){
        return(
            <div className="campo-formu txt-claro mv-3">
                <div className='etiqueta'>
                    <img className='icono-1' src={camara} />
                    <label className='titulo-2 mr-2 ml-0'>Imagen que te identifique o avatar 
                        <div className='titulo-4'> (escoge una imgen no mayor a 10 KB)</div>
                    </label >
                </div>
                     
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{display:'flex',alignItems:'center'}}>
                        {this.state.imagenSrc?                        
                                <img className='icono-3' src={this.state.imagenSrc} alt="imagen avatar" style={{width:'5em', height:'5em',borderRadius:'0.3em'}}/>
                            :
                                <div style={{display:'block',width:'5em', height:'5em',border:'solid white 1px',borderRadius:'0.3em'}}/>
                        }
                        <label htmlFor="avatar" className='boton-oscuro ph-2 pv-1 ml-1'>
                            <input id="avatar" onChange={this.mostrar} type='file' style={{display:'none'}} name='imgAvatar'/>
                            Elige un archivo  
                        </label > 
                    </div>
                    <span className='titulo-4'>{this.state.imagenName}</span>                                      
                </div>

            </div>
        )
    }
}