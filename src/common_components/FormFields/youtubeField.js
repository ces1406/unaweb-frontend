import React from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import { IoLogoYoutube } from 'react-icons/io'

export default class YoutubeField extends React.Component{
    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.redSoc3 === this.props.redSoc3){
            return false;
        }
        return true;
    }
    render(){
        return(
            <Form.Group as={Row} className="mt-5">
                <Form.Label sm={4} className="mr-1 pt-1 text-center">
                    <h5><IoLogoYoutube style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Youtube</h5>
                </Form.Label >
                <Col sm={6}>
                    <Form.Control placeholder="si quieres dar a conocer tu canal de youtube" id="yout" name="youtube" 
                    onChange={this.props.manejarCambio} maxLength={118} 
                    value={this.props.redSoc3} />
                </Col>
            </Form.Group>
        )
    }
}