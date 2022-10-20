import React, { Component } from 'react';

class FullWindowCanvas extends Component {
  canvas_ = null;

  componentDidMount() {
    const { XR } = this.props;
    XR.addCameraPipelineModule(this.pipelineModule);
  }

  // Update the size of the camera feed canvas to fill the screen.
  fillScreenWithCanvas = ({ orientation }) => {
    const { canvas_ } = this;
    
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    // Wait for orientation change to take effect before handline resize.
    if (
      ((orientation === 0 || orientation === 180) && ww > wh) ||
      ((orientation === 90 || orientation === -90) && wh > ww)
    ) {
      window.requestAnimationFrame(() => this.fillScreenWithCanvas({ orientation }));
      return;
    }

    // Set the canvas geometry to the new window size.
    canvas_.width = ww;
    canvas_.height = wh;
  }

  onStart = ({ canvas, orientation }) => {
    this.canvas_ = canvas;
    this.fillScreenWithCanvas({ orientation })
  }

  onDeviceOrientationChange = ({ orientation }) => {
    this.fillScreenWithCanvas({orientation})
  }

  render() {
    return null;
  }

  pipelineModule = {
    name: 'fullwindowcanvas',
    onStart: this.onStart,
    onDeviceOrientationChange: this.onDeviceOrientationChange,
  };
}

export default FullWindowCanvas;