import React from 'react';
import { Nav } from 'react-bootstrap';
import {IoIosPerson, IoLogoFacebook, IoLogoYoutube,IoIosGlobe} from 'react-icons/io';

export default class InitialComent extends React.Component {
    render(){
        console.log('InitialComent')
        return(
            <div className="text-center">
                {this.props.userpost.dirImg==null?
                    <IoIosPerson style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={34}/>
                    :<img src={this.props.avatarsrc} alt="imagen" width={64} height={64} className="mt-2 ml-2 mr-3 mb-1 pb-0" style={{ borderRadius: "0.6em" }} />
                }
                <div id="infoUser" className="mb-0 mt-0 pb-0 pt-0" >{this.props.userpost.apodo}&nbsp;</div>
                {this.props.userpost.redSocial1?
                    <Nav.Link href={this.props.userpost.redSocial1} className="mb-0 mt-0 pb-0 pt-0">
                        <IoLogoFacebook style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={20} />
                    </Nav.Link>
                    :null
                }
                {this.props.userpost.redSocial2?
                    <Nav.Link href={this.props.userpost.redSocial2} className="mb-0 mt-0 pb-0 pt-0">
                        <IoIosGlobe style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={20} />
                    </Nav.Link>
                    :null
                }
                {this.props.userpost.redSocial3?
                    <Nav.Link href={this.props.userpost.redSocial3} className="mb-0 mt-0 pb-0 pt-0">
                        <IoLogoYoutube style={{color:"rgba(23,162,184)"}} className="mb-0 mt-0 pb-0 pt-0" size={20} />
                    </Nav.Link>
                    :null
                }
            </div>
        )
    }
}