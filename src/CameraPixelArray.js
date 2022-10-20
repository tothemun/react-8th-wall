import React, { Component } from 'react';

class CameraPixelArray extends Component {
  componentDidMount() {
    const { XR } = this.props;

    XR.addCameraPipelineModule(XR.CameraPixelArray.pipelineModule({ 
      luminance: true
    }));
  }

  render() {
    return null;
  }
}

export default CameraPixelArray;