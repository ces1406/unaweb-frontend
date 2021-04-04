import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosPerson } from 'react-icons/io'

export default class AutorField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor){
            return false;
        }
        return true;
    }
    render(){
        console.log('autorField->render->props.valor: '+this.props.valor)
        return(
            <Form.Group as={Row} className="mt-5" >
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosPerson style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Autor</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control placeholder="indica el/les autor/es" name="autor" 
                    onChange={this.props.manejarCambio} value={this.props.valor} />
                </Col>
            </Form.Group>
        )
    }
}