import React from 'react';
import { IoIosCloseCircle, IoMdCheckmarkCircle} from 'react-icons/io';
import { Form, Row, Button, Container} from 'react-bootstrap';

export default class AdminTemas extends React.Component{
    render(){
        return(
            <Form onSubmit={this.props.onsubmit} >
                <input type="hidden" name="idTema" value={this.props.tema.idTema} />
                <Container>
                    <Row className="justify-content-md-center">
                        <Button disabled={this.props.tema.erasable} value={this.props.tema.idTema} variant="dark" size="sm" 
                            onClick={this.props.marcar} className="smallButton mt-1" style={{ marginBottom: "0.2em" }}>
                            <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Eliminar Tema
                        </Button>
                    </Row>
                </Container>
                {
                    (this.props.tema.erasable)?
                        <>
                            <img src="./static_files/imgs/separador.png" alt="imagen" style={{ width: '100%', height: '4.2ex' }} />
                                <h6 style={{ textAlign: "center" }}>Si eliminas este tema se borrará todo su contenido y comentarios</h6>
                                    <Row className="justify-content-md-center">
                                        <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                                            <IoMdCheckmarkCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Cofirmar
                                        </Button> &nbsp;&nbsp;
                                        <Button value={this.props.tema.idTema} onClick={this.props.desmarcar} name="cancelRedSoc3" variant="dark" size="sm" className="smallButton mb-2 mt-1" >
                                             <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} /> Cancelar
                                        </Button>
                                    </Row>
                        </>
                        : null
                }
            </Form>
        )
    }
}