import React, { Component } from 'react';

class XRController extends Component {
  componentDidMount() {
    const { XR } = this.props;

    XR.addCameraPipelineModule(XR.XrController.pipelineModule());
  }

  render() {
    return null;
  }
}

export default XRController;