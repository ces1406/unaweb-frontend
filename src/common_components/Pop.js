import React from 'react';
import { Modal, Button} from 'react-bootstrap';

export default class Pop extends React.Component{
    render(){
        return(
            <Modal show={this.props.showModal} onHide={this.props.handleClose}>
                <Modal.Header closeButton> <Modal.Title>Iniciando sesión</Modal.Title> </Modal.Header>
                <Modal.Body> <p style={{ color: 'rgb(5,6,28' }}>{this.props.msj}</p> </Modal.Body>
                <Modal.Footer> <Button variant="primary" onClick={this.props.handleClose}>Ok</Button> </Modal.Footer>
            </Modal>
        )
    }
}