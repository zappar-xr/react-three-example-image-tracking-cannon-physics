

import * as THREE from 'three';
import React, { useState, useMemo, Suspense } from 'react';
import { useFrame } from 'react-three-fiber';
import {
 Physics, usePlane, useBox, useSphere,
} from 'use-cannon';
import { ZapparCamera, ImageTracker, ZapparCanvas } from '@zappar/zappar-react-three-fiber';

import { HTML } from 'drei';
import targetFile from './assets/example-tracking-image.zpt';

const niceColors = require('nice-color-palettes');

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -1, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <planeBufferGeometry args={[3, 3]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

function Cubes() {
  const n = 50;
  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [0.1, 0.1, 0.1],
    position: [Math.random() - 0.5, Math.random() * 1, Math.random() - 0.5],
  }));

  const colors = useMemo(() => {
    const array = new Float32Array(n * 3);
    const color = new THREE.Color();
    for (let i = 0; i < n; i += 1) {
 color
        .set(niceColors[8][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(array, i * 3);
}
    return array;
  }, [n]);

  useFrame(() => api.at(Math.floor(Math.random() * n)).position.set(0, Math.random() * 2, 0));

  return (
    // https://github.com/pmndrs/react-three-fiber/issues/720 null, null BUG
    <instancedMesh receiveShadow castShadow ref={ref} args={[null as any, null as any, n]}>
      <boxBufferGeometry args={[0.1, 0.1, 0.1]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
      </boxBufferGeometry>
      <meshLambertMaterial attach="material" vertexColors />
    </instancedMesh>
  );
}

function Spheres() {
  const n = 50;
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: 0.1,
    position: [Math.random() - 0.5, Math.random() * 1, Math.random() - 0.5],
  }));

  const colors = useMemo(() => {
    const array = new Float32Array(n * 3);
    const color = new THREE.Color();
    for (let i = 0; i < n; i += 1) {
 color
        .set(niceColors[8][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(array, i * 3);
}
    return array;
  }, [n]);

  useFrame(() => api.at(Math.floor(Math.random() * n)).position.set(0, Math.random() * 2, 0));

  return (
    // https://github.com/pmndrs/react-three-fiber/issues/720 null, null BUG
    <instancedMesh receiveShadow castShadow ref={ref} args={[null as any, null as any, n]}>
      <sphereBufferGeometry args={[0.1, 0.1, 0.1]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
      </sphereBufferGeometry>
      <meshLambertMaterial attach="material" vertexColors />
    </instancedMesh>
  );
}

function App() {
    // Set up states
    const [visibleState, setVisibleState] = useState<boolean>(false);

    return (
      <Suspense fallback={<HTML>Loading...</HTML>}>
        <ZapparCanvas shadowMap>

          <ZapparCamera />
          <ImageTracker
            onNotVisible={() => setVisibleState(false)}
            onNewAnchor={(anchor:any) => console.log(`New anchor ${anchor.id}`)}
            onVisible={() => setVisibleState(true)}
            targetImage={targetFile}
            visible={visibleState}
          >

            <Physics>
              <Plane />
              <Cubes />
              <Spheres />
            </Physics>

          </ImageTracker>
          <ambientLight intensity={0.6} />
          <directionalLight position={[0, 8, 5]} intensity={0.5} castShadow />
        </ZapparCanvas>
        </Suspense>
    );
}

export default App;

