import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosPerson } from 'react-icons/io'

export default class ApodoField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.apodo === this.props.apodo){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-4 ">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosPerson style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Apodo</h5>
                </Form.Label>
                <Col sm={4}>
                    <Form.Control placeholder="escoge un apodo" name="apodo" id="apodo" 
                        onClick={this.props.sobreClick}  
                        onBlur={this.props.sobreBlur} 
                        onChange={this.props.manejarCambio} 
                        maxLength={30} 
                        value={this.props.apodo} 
                    />
                </Col>
            </Form.Group>
        )
    }
}