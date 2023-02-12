import { useResize } from "hooks/useResize";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Earth() {
  const windowSize = useResize();

  const containerRef = useRef<HTMLDivElement>(null);
  let renderer: THREE.WebGLRenderer;
  let camera: THREE.PerspectiveCamera;

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      windowSize.width / windowSize.height,
      0.1,
      1000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowSize.width, windowSize.height);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    // const loader = new THREE.Loader();
    // loader.(
    //   "path/to/your/file.obj",
    //   function (object : any) {
    //     scene.add(object);
    //   },
    //   function (xhr : any) {
    //     console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    //   },
    //   function (error : any) {
    //     console.log("An error happened");
    //   }
    // );

    const animate = function () {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  //   useEffect(() => {
  //     if (!containerRef.current) return;
  //     renderer.setSize(windowSize.width, windowSize.height);
  //   }, [windowSize]);

  return <div className="earth" ref={containerRef} />;
}
