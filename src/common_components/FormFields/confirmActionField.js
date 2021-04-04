import React from 'react';
import { IoMdConstruct,IoIosCloseCircle ,IoMdCheckmarkCircle  } from 'react-icons/io';
import { Button } from 'react-bootstrap';

export class CancelConfirm extends React.Component{
    render(){
        return(
            <>
                <Button type="submit" variant="dark" size="sm" className="smallButton mt-1" >
                    <IoMdCheckmarkCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cofirmar
                </Button>&nbsp;&nbsp;
                <Button onClick={this.props.cancel} name={this.props.name} variant="dark" size="sm" className="smallButton mt-1" >
                    <IoIosCloseCircle style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Cancelar
                </Button>
            </>
        )
    }
}

export class ConfirmActionField extends React.Component{
    render(){
        return(
            <>
                {this.props.modif?
                    <Button onClick={this.props.onclick} variant="dark" size="sm" className="smallButton mt-1" >
                        <IoMdConstruct style={{ marginBottom: "0.2em", marginRight: "0.4em" }} />Modificar
                    </Button>
                    :
                    <CancelConfirm cancel={this.props.cancel} name={this.props.name}/>
                }
            </>
        )
    }
}