import React, { Component, Fragment } from 'react';

class Eighth extends Component {
  $canvas = React.createRef();

  componentDidMount = () => {
    const { children, XR } = this.props;
    XR.run({ canvas: this.$canvas.current });
  }
  
  render() {
    const { children, XR } = this.props;
    
    return (
      <Fragment>
        <canvas ref={this.$canvas} />
        {React.Children.map(children, (child) => React.cloneElement(child, { XR }))}
      </Fragment>
    );
  }
}

export default Eighth;