import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
  } from "./node_modules/three/build/three.module";
  import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls";
  import { IFCLoader } from "./node_modules/web-ifc-three/IFCLoader";
  // 创建Three.js场景
  
  // 创建Three.js场景
  const scene = new Scene();
    
  //Object to store the size of the viewport
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  // 创建摄像机（用户的视角）。
  const aspect = size.width / size.height;
  const camera = new PerspectiveCamera(75, aspect);
  camera.position.z = 15;
  camera.position.y = 13;
  camera.position.x = 8;
  
  // 创建场景的灯光
  const lightColor = 0xffffff;
  
  const ambientLight = new AmbientLight(lightColor, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  
  // 设置渲染器，获取HTML的画布。
  const threeCanvas = document.getElementById("parameter_canvas");
  const renderer = new WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
  });
  
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // 在场景中创建网格和坐标轴
  const grid = new GridHelper(50, 30);
  scene.add(grid);
  
  const axes = new AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 1;
  scene.add(axes);
  
  // 创建轨道控制（用于导航场景）。
  const controls = new OrbitControls(camera, threeCanvas);
  controls.enableDamping = true;
  controls.target.set(-2, 0, 0);
  
  // 动画循环
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  
  animate();
  
  // 根据浏览器的大小调整视口
  window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  });

  //Sets up the IFC loading
const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("./wasm/");

  const input = document.getElementById("inputGroupFile01");
  input.addEventListener(
    "change",
    (changed) => {
      const ifcURL = URL.createObjectURL(changed.target.files[0]);
      ifcLoader.load(ifcURL, (ifcModel) => scene.add(ifcModel));
    },
    false
  );