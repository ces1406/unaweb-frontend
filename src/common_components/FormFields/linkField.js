import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import {IoIosLink} from 'react-icons/io'

export default class LinkField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosLink style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Link al apunte</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control placeholder="link a la pagina en donde se encuentra el apunte" name="link" 
                        onChange={this.props.manejarCambio} value={this.props.valor} />
                </Col>
            </Form.Group>
        )
    }
}