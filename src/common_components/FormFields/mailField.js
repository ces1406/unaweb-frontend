import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosMail } from 'react-icons/io'

export default class MailField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.mail === this.props.mail){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5" >
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosMail style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />E-Mail</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control placeholder={this.props.placeholder} name="mail" type="email" id="email" 
                        maxLength={62} onChange={this.props.manejarCambio} value={this.props.mail} 
                        disabled={(this.props.deshabilitado===undefined)?this.props.deshabilitado:false}/>
                </Col>
            </Form.Group>
        )
    }
}