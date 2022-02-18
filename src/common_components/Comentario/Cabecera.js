import React from 'react';
import yout from '../../../static_files/imgs/icons/youtube-black.svg';
import insta from '../../../static_files/imgs/icons/instagram-black.svg';
import face from '../../../static_files/imgs/icons/facebook-black.svg';
import user from '../../../static_files/imgs/icons/usuario-circulo-black.svg';

export default class Cabecera extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='card-cabecera'>
                <div style={{display:'flex'}}>
                    <img className={this.props.tamicono} src={this.props.avatarsrc?this.props.avatarsrc:user} alt='usuario'/>
                    <div>
                        <div className='text-oscuro titulo-2' style={{}}> {this.props.user.apodo}</div>
                        <div style={{ display: "flex" }}>
                            {this.props.user.redSocial1 ? (<a href={this.props.user.redSocial1} target='_blank'> <img src={face} className='icono-1'/> </a>) : null}
                            {this.props.user.redSocial2 ? (<a href={this.props.user.redSocial2} target='_blank'> <img src={insta}className='icono-1'/> </a>) : null}
                            {this.props.user.redSocial3 ? (<a href={this.props.user.redSocial3} target='_blank'> <img src={yout} className='icono-1'/> </a>) : null}
                        </div>                            
                    </div>
                </div>
                <div className='text-oscuro titulo-3'>{this.props.izq}</div>
            </div>
        )
    }
}