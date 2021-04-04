import React from 'react';
import { Pagination } from 'react-bootstrap';
import {ITEMS_POR_PAG} from '../globals';

class Paginacion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cant: this.props.cant,
            activa: this.props.activa,
            vecPag: this.fillPages(this.props.cant, this.props.activa)
        }
        this.fillPages = this.fillPages.bind(this)
    }
    fillPages(cantidad, activa) {
        let vecAux = []
        let cant = (cantidad % ITEMS_POR_PAG === 0) ? (cantidad / ITEMS_POR_PAG) : (Math.trunc(cantidad / ITEMS_POR_PAG)+1);
        if (cant < 8) {
            for (let i = 1; i < cant + 1; i++) {
                vecAux.push(<Pagination.Item key={i} active={i === activa} onClick={i === activa ? null : () => this.props.go(i)}> {i} </Pagination.Item>)
            }
        } else {
            if (activa === 1 || activa === 2 || activa === 3 || activa === 4) {
                vecAux.push(<Pagination.Prev key={0} onClick={activa === 1 ? null : this.props.prev}/>)
                for (let i = 1; i < 6; i++) {
                    vecAux.push(<Pagination.Item key={i} active={i === activa} onClick={i === activa ? null : () => this.props.go(i)} >{i} </Pagination.Item>)
                }
                vecAux.push(<Pagination.Ellipsis />);
                vecAux.push(<Pagination.Item key={cant} active={false} onClick={()=>this.props.go(cant)}>{cant}</Pagination.Item>);
                vecAux.push(<Pagination.Next onClick={this.props.next}/>)
            } else if (activa === cant - 1 || activa === cant - 2 || activa === cant - 3 || activa === cant) {
                vecAux.push(<Pagination.Prev onClick={this.props.prev}/>)
                vecAux.push(<Pagination.Item key={1} active={false} onClick={()=>this.props.go(1)}>{1} </Pagination.Item>)
                vecAux.push(<Pagination.Ellipsis />);
                for (let i = 4; i > -1; i--) {
                    vecAux.push(<Pagination.Item key={cant - i} active={cant-i === activa} onClick={(cant-i) === activa ? null : () => this.props.go(cant-i)}>{cant - i} </Pagination.Item>)
                }
                vecAux.push(<Pagination.Next onClick={activa === cant ? null : this.props.next} />)
            } else {
                vecAux.push(<Pagination.Prev onClick={this.props.prev} />)
                vecAux.push(<Pagination.Item key={1} active={false} onClick={()=>this.props.go(1)}>{1} </Pagination.Item>)
                vecAux.push(<Pagination.Ellipsis />);
                vecAux.push(<Pagination.Item key={activa - 1} active={false} onClick={() => this.props.go(activa-1)}>{activa - 1}</Pagination.Item>)
                vecAux.push(<Pagination.Item key={activa} active={true}>{activa}</Pagination.Item>)
                vecAux.push(<Pagination.Item key={activa + 1} active={false} onClick={() => this.props.go(activa+1)}>{activa + 1}</Pagination.Item>)
                vecAux.push(<Pagination.Ellipsis />);
                vecAux.push(<Pagination.Item key={cant} active={false} onClick={()=>this.props.go(cant)}> {cant} </Pagination.Item>);
                vecAux.push(<Pagination.Next onClick={activa === cant ? null : this.props.next} />)
            }
        }
        return vecAux
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.activa !== this.state.activa || prevState.cant !== this.state.cant) {
            this.setState({ vecPag: this.fillPages(this.state.cant, this.state.activa) })
        }
    }
    static getDerivedStateFromProps(nextProp, prevState) {
        if (prevState.cant !== nextProp.cant) {
            if (prevState.activa !== nextProp.activa) {
                return { cant: nextProp.cant, activa: nextProp.activa }
            }
            return { cant: nextProp.cant }
        }
        if (prevState.activa !== nextProp.activa) {
            if (prevState.cant !== nextProp.cant) {
                return { cant: nextProp.cant, activa: nextProp.activa }
            }
            return { activa: nextProp.activa }
        }
        return null;
    }
    render() {
        return (
            <Pagination size='sm'>
                {this.state.vecPag}
            </Pagination>
        )
    }
}
export default Paginacion