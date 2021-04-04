import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoIosGlobe } from 'react-icons/io'

export default class SocialField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc2 === this.props.redSoc2){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1">
                    <h5><IoIosGlobe style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Otra red social</h5>
                </Form.Label>
                <Col sm={6}>
                    <Form.Control placeholder="si quieres dar a conocer un blog/página/Instagram u otro" id="blg" name="blog" 
                    onChange={this.manejarCambio} maxLength={118} 
                    value={this.props.redSoc2} />
                </Col>
            </Form.Group>
        )
    }
}