import { useResize } from "hooks/useResize";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import styles from "./index.module.css";

export default function Earth() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [renderer, setRenderer] = useState<any>();
  const [_camera, setCamera] = useState<any>();
  const [scene] = useState(new THREE.Scene());

  const handleWindowResize = useCallback(() => {
    const { current: container } = containerRef;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      renderer.setSize(scW, scH);
    }
  }, [renderer]);

  useEffect(() => {
    const { current: container } = containerRef;
    if (container && !renderer) {
      console.log("Hi");
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      console.log(scW, scH);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(scW, scH);
      container.appendChild(renderer.domElement);
      setRenderer(renderer);

      const camera = new THREE.PerspectiveCamera(50, scW / scH, 0.1, 1000);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      camera.position.z = 5;
      scene.add(cube);

      const animate = function () {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        renderer.dispose();
        // scene.dispose();
      };
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [renderer, handleWindowResize]);

  return <div className={styles.earth} ref={containerRef} />;
}
