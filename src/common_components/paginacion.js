import React from 'react';
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
                vecAux.push(<td key={i} className={(i===activa)?'btn-pag-act':'btn-pag-inac'} onClick={i === activa ? null : () => this.props.go(i)}> {i} </td>)
            }
        } else {
            if (activa === 1 || activa === 2 || activa === 3 || activa === 4) {
                vecAux.push(<td className='btn-pag-inac'  key={0} onClick={activa === 1 ? null : this.props.prev}>&lt;</td>)
                for (let i = 1; i < 6; i++) {
                    vecAux.push(<td key={i} className={(i===activa)?'btn-pag-act':'btn-pag-inac'} onClick={i === activa ? null : () => this.props.go(i)} >{i} </td>)
                }
                vecAux.push(<td className='btn-pag-inac'  key={cant+1}>...</td>);
                vecAux.push(<td className='btn-pag-inac'  key={cant} onClick={()=>this.props.go(cant)}>{cant}</td>);
                vecAux.push(<td className='btn-pag-inac'  key={cant+2}onClick={this.props.next}>&gt;</td>)
            } else if (activa === cant - 1 || activa === cant - 2 || activa === cant - 3 || activa === cant) {
                vecAux.push(<td className='btn-pag-inac'  key={cant+1}onClick={this.props.prev}>&lt;</td>)
                vecAux.push(<td className='btn-pag-inac'  key={1}  onClick={()=>this.props.go(1)}>{1} </td>)
                vecAux.push(<td className='btn-pag-inac'  key={cant+2}>...</td>);
                for (let i = 4; i > -1; i--) {
                    vecAux.push(<td key={cant - i} className={((cant-i)===activa)?'btn-pag-act':'btn-pag-inac'} onClick={(cant-i) === activa ? null : () => this.props.go(cant-i)}>{cant - i} </td>)
                }
                vecAux.push(<td className='btn-pag-inac' key={cant+3} onClick={activa === cant ? null : this.props.next}>&gt;</td>)
            } else {
                vecAux.push(<td className='btn-pag-inac' key={cant+1}onClick={this.props.prev}>&lt;</td>)
                vecAux.push(<td className='btn-pag-inac' key={1} onClick={()=>this.props.go(1)}>{1} </td>)
                vecAux.push(<td className='btn-pag-inac' key={cant+2}>...</td>);
                vecAux.push(<td className='btn-pag-inac' key={activa - 1}  onClick={() => this.props.go(activa-1)}>{activa - 1}</td>)
                vecAux.push(<td className='btn-pag-act'  key={activa} >{activa}</td>)
                vecAux.push(<td className='btn-pag-inac' key={activa + 1}  onClick={() => this.props.go(activa+1)}>{activa + 1}</td>)
                vecAux.push(<td className='btn-pag-inac' key={cant+3}>...</td>);
                vecAux.push(<td className='btn-pag-inac' key={cant}  onClick={()=>this.props.go(cant)}> {cant} </td>);
                vecAux.push(<td className='btn-pag-inac' key={cant+4} onClick={activa === cant ? null : this.props.next}>&gt;</td>)
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
            <table>
                <tbody>
                    <tr style={{borderRadius: '0.2em'}}>{this.state.vecPag}</tr>
                </tbody>
            </table>
        )
    }
}
export default Paginacion