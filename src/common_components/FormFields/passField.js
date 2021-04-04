import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoMdKey } from 'react-icons/io'

export default class PassField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.pass === this.props.pass){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label className="mr-1 pt-1">
                    <h5><IoMdKey style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Contraseña</h5>
                </Form.Label>
                <Col sm={4}>
                    <Form.Control type="password" name={this.props.name} placeholder="6 caracteres mínimo y 8 como máximo" maxLength={8} 
                        onChange={this.props.manejarCambio} 
                        value={this.props.pass} 
                    />
                </Col>
            </Form.Group>
        )
    }
}