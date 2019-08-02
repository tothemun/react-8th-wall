import * as THREE from 'three';
import React, { useEffect, useState, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import { Three } from 'containers';

const XRThree = ({ children, XR }) => {
  const { canvas, scene, gl, camera } = useThree();
  const [tapTarget, setTapTarget] = useState(null);
  const $surface = useRef();

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  useEffect(() => {
    XR.addCameraPipelineModule({
      name: 'xrthree',
      onStart,
      onUpdate,
      onRender,
      onCanvasSizeChange,
      xrScene: xrScene
    });

    window.addEventListener('touchstart', handleTouchEvent);
  });

  const onCanvasSizeChange = ({ canvasWidth, canvasHeight }) => {
    gl.setSize(canvasWidth, canvasHeight);
  }

  const handleTouchEvent = (e) => {
    // Call XrController.recenter() when the canvas is tapped with two fingers. This resets the
    // AR camera to the position specified by XrController.updateCameraProjectionMatrix() above.
    if (e.touches.length == 2) {
      XR.XrController.recenter()
    };

    if (e.touches.length > 2 || tapTarget !== null) {
      return;
    }

    // calculate tap position in normalized device coordinates (-1 to +1) for both components.
    const tapPosition = new THREE.Vector2();
    tapPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    tapPosition.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1

    // Update the picking ray with the camera and tap position.
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(tapPosition, camera);

    // Raycast against the "surface" object.
    const intersects = raycaster.intersectObject($surface.current);

    if (intersects.length == 1 && intersects[0].object == $surface.current) {
      setTapTarget(new THREE.Vector3(intersects[0].point.x, 1.0, intersects[0].point.z));
    }
  };

  const onStart = ({ canvasWidth, canvasHeight }) => {
    camera.aspect = (canvasWidth / canvasHeight);

    gl.autoClear = false;
    gl.setSize(canvasWidth, canvasHeight);
    gl.antialias = true;

    onCanvasSizeChange(canvasWidth, canvasHeight);
  }

  const onUpdate = (props) => {
    if (!props.processCpuResult.reality) {
      return;
    }

    const { rotation, position, intrinsics } = props.processCpuResult.reality;

    for (let i = 0; i < 16; i++) {
      camera.projectionMatrix.elements[i] = intrinsics[i];
    }

    if (rotation) {
      camera.setRotationFromQuaternion(rotation);
    }

    if (position) {
      camera.position.set(position.x, position.y, position.z);
    }
  }

  const onRender = () => {
    gl.clearDepth();
    gl.render(scene, camera);
  }

  const xrScene = () => {
    return { scene, camera, renderer: gl };
  }

  return (
    <>
      <mesh position={[0, -1, 0]} ref={$surface} rotation-x={-Math.PI / 2}>
        <planeGeometry 
          attach='geometry'
          args={[100, 100, 1, 1]}
        />
        <meshBasicMaterial 
          attach='material' 
          color='0xffff00' 
          side={THREE.DoubleSide}
          opacity={0.0}
          transparent
        />
      </mesh>
      <Three position={tapTarget} visible={!!tapTarget}/>
    </>
  );
}

export default XRThree;
