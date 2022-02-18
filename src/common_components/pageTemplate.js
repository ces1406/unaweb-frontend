import React from "react";
import Header from "./header";
import Footer from "./footer";

class Template extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div className="container">{this.props.children}</div>
        <div style={{height:'2em'}}></div>
        <Footer />
      </>
    );
  }
}

export default Template;
