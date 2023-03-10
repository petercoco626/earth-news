import { useResize } from "hooks/useResize";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import styles from "./index.module.css";

export default function Earth() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [renderer, setRenderer] = useState<any>();
  const [scene] = useState(new THREE.Scene());
  const [raycaster, setRaycaster] = useState<any>(null);
  const [mouse, setMouse] = useState(new THREE.Vector2());
  const [_camera, setCamera] = useState<any>(null);

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
      // 해당 태그가 랜더링이 되면 크기를 알 수 있다.
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      // 도화지
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(scW, scH);

      // 도화지를 dom에 추가한다.
      container.appendChild(renderer.domElement);

      // 사실 이건 resize용으로 느낌에는 포인터를 전달하는거 같음.
      setRenderer(renderer);

      // 카메라는 좀더 공부해봐야함.
      const camera = new THREE.PerspectiveCamera(50, scW / scH, 0.1, 1000);

      // 카메라 위치에 따라서도 안보일 수가 있다.
      camera.position.set(0, 1, 2);

      setCamera(camera);

      // cube 생성기.
      // const geometry = new THREE.BoxGeometry(1, 1, 1);
      // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new THREE.Mesh(geometry, material);
      // camera.position.z = 5;

      const loader = new GLTFLoader();
      loader.load(
        "models/earth.4.glb",
        function (gltf) {
          console.log(gltf);
          const model = gltf.scene;
          // model.position.set(1, 1, 0);
          model.scale.set(0.5, 0.5, 0.5);
          model.rotation.x += 0.01;
          scene.add(model);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );

      // light가 없으면 대상이 안보임...
      const light = new THREE.DirectionalLight(0xfffffff, 1);
      light.position.set(2, 2, 5);
      scene.add(light);

      // sence에 큐브 추가하기.
      // scene.add(cube);

      // Create the raycaster
      const raycaster = new THREE.Raycaster();
      setRaycaster(raycaster);

      const onMouseClick = (event: any) => {
        // Calculate the mouse position in normalized device coordinates (-1 to +1)
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;
        const mouseX = (x / w) * 2 - 1;
        const mouseY = -(y / h) * 2 + 1;
        setMouse(new THREE.Vector2(mouseX, mouseY));

        // Cast a ray from the camera through the mouse position
        raycaster.setFromCamera(mouse, camera);

        // Find all intersected objects
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Check if any objects were intersected
        if (intersects.length > 0) {
          // Handle the click event on the first intersected object
          const firstIntersect = intersects[0].object;
          console.log("Clicked on object:", firstIntersect);
        }
      };

      // Attach a click event to the canvas
      container.addEventListener("click", onMouseClick, false);

      // 현재 코드에서는 돔 자체를 이동시키는거 같음?
      const controls = new OrbitControls(camera, renderer.domElement);

      const animate = function () {
        // 정확히 어떤 기능인지 파악 필요.
        requestAnimationFrame(animate);
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
