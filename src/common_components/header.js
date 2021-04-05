import React from 'react';
import {IoIosListBox, IoIosLogIn, IoMdSearch, IoIosPerson, IoIosLogOut, IoIosSettings,IoIosHome } from 'react-icons/io';
import { Form, Navbar, FormControl, Button, ButtonGroup, Nav, Col, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { doSimpleCorsGetRequest } from '../api_requests/requests';
import logo from '../../static_files/imgs/logouna.png';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/useractions';
import {addSearchResults} from '../redux/actions/searchactions';

class Head extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      palBusq: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.checkInputs = this.checkInputs.bind(this)
  }
  buscarTema (palabra) {
    return new Promise((res, rej) => {
      doSimpleCorsGetRequest('/temas/busqueda/' + palabra)
        .then(rta => {
          let rtaAux = rta.map(elem => {
            let fecha = new Date(elem.fechaCreacion)
            elem.dia = fecha.getDate();
            elem.mes = fecha.getMonth();
            elem.anio = fecha.getFullYear();
            elem.milisecs = fecha.getTime();
            return elem
          });
          res(rtaAux);
        })
        .catch();
    })
  }
  checkInputs(event) {
    let palBusq = this.state.palBusq.trim();
    if (palBusq === null || palBusq === '' || palBusq.length > 40) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
     this.buscarTema(palBusq)    
        .then(async (rta) => {
          await this.props.dispatchResults(rta);
        })
        .catch((err) => {
          return ('Error en ComponentDidMount() (' + err + ')')
        });
  }
  handleChange(event) {
    this.setState({ palBusq: event.target.value });
  }
  render() {
    return (
      <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className="pt-1 pb-1" >
        
        <NavLink to="/" className="valign-wrapper brand-Logo mr-0 pr-0" >  
          <Badge pill variant="light" style={{backgroundColor:'rgb(10,32,53)'}}>
          <div className="pr-1 pl-1 pb-1 pt-1" style={{display:'flex',flexDirection: 'row !important' }}>
            <div><img src={logo} alt="imagen" width="60" className="d-inline-block align-top pr-0 mr-0" /> </div>
            <div style={{display:'flex',flexDirection: 'column', alignItems:'center'}}>
              <IoIosHome style={{ color: '#ecc538' }} size = '26px'/>     
              <h6 style={{ color: '#ecc538',textAlign:'center' }} className="ml-2 pl-0 mt-1">UNAweb</h6>  
            </div>
          </div>
          </Badge>
        </NavLink>    
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-4"/>
        <Col>
          <Navbar.Collapse id="basic-navbar-nav">

            <Form inline className="mr-auto ml-auto mb-3" >
              <FormControl type="text" placeholder="buscar en el sitio" className="mr-sm-2 mt-1" value={this.state.palBusq} onChange={this.handleChange} />
              <NavLink onClick={this.checkInputs} to={`/searching/${this.state.palBusq}`}>
                <Button variant="outline-info" className="mt-1" >
                  <IoMdSearch className="mr-2" />Buscar
                </Button>
              </NavLink>
            </Form>
            <Nav className="ml-auto" >
              <ButtonGroup vertical>
                {this.props.user.logged?
                  <>
                    <Button variant="outline-info" className="pt-0 pb-0" disabled
                      style={{backgroundColor:'#15223c'}}>
                      <h5 className="mt-1"><IoIosPerson className="mr-2" />{this.props.user.apodo}</h5>
                    </Button>
                    <Button variant="outline-info" onClick={() => this.props.dispatchLogout()} className="pt-0 pb-0">
                      <h6 className="mt-0 mb-0 pt-0 pb-0"><IoIosLogOut className="mr-1" />Cerrar Sesión</h6>
                    </Button>                    
                    <Button variant="outline-info" className="pt-0 pb-0">
                      <NavLink to="/settings">
                        <h6 className="mt-0 mb-0 pt-0 pb-0"><IoIosSettings className="mr-2" />Cuenta</h6>
                      </NavLink>
                    </Button>                    
                  </>:
                  <>
                    <NavLink to="/register">
                      <Button variant="outline-info" className="pt-1 pb-1 pr-4">
                        <IoIosListBox className="mr-2" />Registrarse
                      </Button>
                    </NavLink>
                    <NavLink to="/loggin">
                      <Button variant="outline-info" className="pt-1 pb-1 mt-1">
                        <IoIosLogIn /> Iniciar Sesión
                      </Button>
                    </NavLink>
                  </>
                }                
              </ButtonGroup>
              
            </Nav>

          </Navbar.Collapse>
        </Col>

      </Navbar>
    )
  }
}
const mapStateToProps = (state) => ({ user: state.userReducer, results:state.searchReducer });
const mapDispatchToProps = {
  dispatchLogout: () => logout(),
  dispatchResults : (vec)=>addSearchResults(vec)
}
export default connect(mapStateToProps, mapDispatchToProps)(Head);