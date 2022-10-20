import React, { Component } from 'react';
import baseStyles from '../../main.module.scss';

class RuntimeError extends Component {
  started = false;
  state = {
    error: null
  };
  pipelineModule = {
    name: 'error',
    onStart: () => { this.started = true },
    onException: this.handleError
  };

  componentDidMount() {
    const { XR } = this.props;
    window.XR.addCameraPipelineModule(this.pipelineModule);
  }

  handleError = (error) => {
    const { XR } = window;

    // Only handle errors while running, not at startup.
    if (!this.started) return;

    this.setState({ error });

    XR.pause();
    XR.stop();
  }

  render() {
    const { error } = this.state;
    
    return !!error ? (
      <div className={baseStyles.absoluteFill}>
        <img 
          alt='error'
          style={{ height: 75 }} 
          src='//cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png'
        />
        <div>{error}</div>
      </div>
    ) : null;
  }
}

export default RuntimeError;