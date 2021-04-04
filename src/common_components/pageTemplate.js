import React from 'react';
import Header from './header';
import Footer from './footer';

class Template extends React.Component{
    render(){
        return (
            < >
                <Header />
                <div className="container" style={{marginBottom: '4ex'}}>
                    {this.props.children}
                </div>
                <Footer />
            </>
        )
    }
}

export default Template