import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosBook } from 'react-icons/io'

export default class TituloField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.valor === this.props.valor){
            return false;
        }
        return true;
    }
    render(){
        console.log('TituloField->render()->props: '+JSON.stringify(this.props))
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosBook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Titulo</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control   placeholder="indica el titulo" id="idTitulo" name="titulo" 
                    onChange={this.props.manejarCambio} value={this.props.valor} />
                </Col>
            </Form.Group>
        )
    }
}