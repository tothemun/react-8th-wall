import React, { Component } from 'react';

class GlTextureRenderer extends Component {
  componentDidMount() {
    const { XR } = this.props;

    XR.addCameraPipelineModule(XR.GlTextureRenderer.pipelineModule());
  }

  render() {
    return null;
  }
}

export default GlTextureRenderer;