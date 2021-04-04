import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosCamera } from 'react-icons/io'

export default class ImageField extends React.Component{
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosCamera style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Sube opcionalmente una imagen que te identifique como miembro</h5> 
                </Form.Label >
                <Col sm={6} style={{ color: 'rgba(230,240,255)' }}>
                    <Form.Control id="avatar" name="imgAvatar" 
                        onChange={this.props.manejarCambio} as='input' type='file' />
                    <div id="h7">Escoge una imgen no mayor a 10 KB</div>
                </Col>
            </Form.Group>
        )
    }
}