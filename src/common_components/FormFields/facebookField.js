import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoLogoFacebook } from 'react-icons/io'

export default class FacebookField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc1 === this.props.redSoc1){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoLogoFacebook style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Facebook</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control placeholder="si quieres dar a conocer tu facebook" id="face" name="facebook" 
                        onChange={this.props.manejarCambio} maxLength={118} 
                        value={this.props.redSoc1} />
                </Col>
            </Form.Group>
        )
    }
}