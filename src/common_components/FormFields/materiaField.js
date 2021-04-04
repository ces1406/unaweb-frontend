import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosApps } from 'react-icons/io';
import Materias from '../Materias';

export default class MateriaField extends React.Component{
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
                        <h5><IoIosApps style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Materia</h5>
                    </Form.Label>
                    <Col sm={6}>
                        <Form.Control as="select" name="materia" onChange={this.props.manejarCambio} value={this.props.valor} custom="true">
                            {Materias.map((elem, index) => <option key={index}>{elem}</option>)}
                        </Form.Control>
                    </Col>
                </Form.Group>
        )
    }
}