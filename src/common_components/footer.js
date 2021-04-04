import React from 'react';
import { IoLogoYoutube, IoLogoTwitter, IoLogoGoogle} from 'react-icons/io';
import { Navbar, Nav } from 'react-bootstrap';
import { LINK_YOUTUBE,LINK_FACEBOOK,LINK_TWITTER } from '../globals';

export default class Footer extends React.Component {
    render(){
        return(
            <Navbar  expand="sm" bg="dark" className="pb-0 pt-0 mt-0" fixed="bottom" >
                <Nav className="mr-auto">
                    <Nav.Link href={LINK_TWITTER} className="ml-3 pb-0 pt-0">
                        <IoLogoTwitter style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mb-0 mr-0 pt-0 pb-0" />
                    </Nav.Link>
                    <Nav.Link href={LINK_YOUTUBE} className="ml-3 pb-0 pt-0">
                        <IoLogoYoutube style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mb-0 mr-0 pt-0 pb-0" />
                    </Nav.Link>
                    <Nav.Link href={LINK_FACEBOOK} className="ml-3 pb-0 pt-0">
                        <IoLogoGoogle style={{ color: "rgb(23,162,184)" }} size={20} className="mt-0 mb-0 mr-0 pt-0 pb-0" />
                    </Nav.Link>
                </Nav>                
            </Navbar>            
        )
    }
}