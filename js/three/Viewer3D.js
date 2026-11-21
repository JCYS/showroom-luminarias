import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomFactory} from './RoomFactory.js';
import {LightingController} from './LightingController.js';
/**
 * Punto de entrada del motor 3D.
 * Cada vez que la pantalla se abre, crea un visor y al cerrarla libera GPU y eventos.
 * La maqueta mantiene un único modelo GLB; el catálogo diferencia productos sin GLB.
 */
export class Viewer3D {
  constructor(canvas,{modelUrl,onStatus=()=>{}}){
    this.canvas=canvas;this.onStatus=onStatus;this.disposed=false;
    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.48;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(36,1,.05,100);
    this.camera.up.set(0,0,1);
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;this.controls.dampingFactor=.07;
    this.controls.minDistance=2;this.controls.maxDistance=12;
    this.controls.maxPolarAngle=Math.PI*.86;
    this.room=new RoomFactory();this.room.root.visible=false;this.scene.add(this.room.root);
    this.lighting=new LightingController(this.scene);
    this.mode='viewer';this.model=null;this.rings=[];this.cables=[];
    this.layout='horizontal';this.targetAngles=[];
    this.cableMaterial=new THREE.MeshStandardMaterial({color:'#9d9287',metalness:.77,roughness:.35});
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
    this.resize();this.loadModel(modelUrl);
    this.animate=this.animate.bind(this);this.animId=requestAnimationFrame(this.animate);
  }
  async loadModel(url){
    try{
      const gltf=await new GLTFLoader().loadAsync(url);
      if(this.disposed){gltf.scene.traverse(o=>{if(o.isMesh)o.geometry?.dispose();});return;}
      this.model=gltf.scene;this.scene.add(this.model);
      this.lighting.registerModel(this.model);
      this.prepareRingAnimation();this.setLayout('horizontal');
      this.onStatus('Modelo 3D cargado');
    }catch(error){console.error('Error cargando GLB:',error);this.onStatus('No se pudo cargar el GLB; comprueba la ruta y abre desde un servidor.');}
  }
  prepareRingAnimation(){
    // Los nombres Ring_1_* provienen del script que construyó el GLB original.
    const specs=[{radius:.72,z:1.67,count:8,top:.135},{radius:.55,z:1.13,count:6,top:.09},{radius:.38,z:.62,count:4,top:.053}];
    const pieces=[];
    this.model.traverse(o=>{if(!o.isMesh)return;const name=o.name.toLowerCase();if(name.includes('suspension_')||name.includes('center_electrical_wire'))o.visible=false;const match=name.match(/ring_(\d)_/);if(match)pieces.push({obj:o,index:Number(match[1])-1});});
    this.model.updateMatrixWorld(true);
    specs.forEach((spec,index)=>{
      const group=new THREE.Group();group.position.set(0,0,spec.z);this.model.add(group);this.model.updateMatrixWorld(true);
      pieces.filter(item=>item.index===index).forEach(({obj})=>group.attach(obj));this.rings.push(group);
      for(let i=0;i<spec.count;i++){
        const phi=(Math.PI*2*i/spec.count)+index*.18;
        const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(.0018,.0018,1,5),this.cableMaterial);
        this.model.add(cylinder);this.cables.push({spec,index,phi,mesh:cylinder});
      }
    });
    this.updateCables();
  }
  setLayout(type){this.layout=type;this.targetAngles=type==='diagonal'?[[-.23,.21],[-.36,-.25],[.32,.28]]:[[0,0],[0,0],[0,0]];}
  updateCables(){
    const vertical=new THREE.Vector3(0,1,0);
    for(const {spec,index,phi,mesh} of this.cables){const ring=this.rings[index];if(!ring)continue;
      const start=new THREE.Vector3(spec.top*Math.cos(phi),spec.top*Math.sin(phi),2.947);
      const end=new THREE.Vector3((spec.radius-.018)*Math.cos(phi),(spec.radius-.018)*Math.sin(phi),.016).applyQuaternion(ring.quaternion).add(ring.position);
      const delta=end.clone().sub(start);mesh.position.copy(start).add(end).multiplyScalar(.5);
      mesh.quaternion.setFromUnitVectors(vertical,delta.clone().normalize());mesh.scale.set(1,delta.length(),1);
    }
  }
  setMode(mode){
    // viewer: movimiento libre. sala/comedor/cocina/try: posición fija.
    this.mode=mode;
    const free=mode==='viewer';this.room.root.visible=!free;
    if(!free)this.room.build(mode==='try'?'comedor':mode);
    this.controls.enabled=free;
    this.camera.position.set(free?4.1:5.3,free?-6.1:-7.9,free?3.5:3.0);
    this.controls.target.set(0,0,free?1.6:1.12);
    this.controls.update();
    this.renderer.setClearColor(free?'#ddbea4':'#d3b99f',1);
  }
  setWallColor(hex){this.room.setWallColor(hex);}
  setNight(night){this.lighting.setNight(night);this.renderer.setClearColor(night?'#333a49':'#d3b99f',1);}
  resize(){if(this.disposed)return;const rect=this.canvas.parentElement.getBoundingClientRect();const width=Math.max(1,rect.width),height=Math.max(1,rect.height);this.renderer.setSize(width,height,false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
  resetCamera(){this.setMode(this.mode);}
  animate(){if(this.disposed)return;this.animId=requestAnimationFrame(this.animate);
    this.rings.forEach((ring,index)=>{const [rx,ry]=this.targetAngles[index]??[0,0];ring.rotation.x+=(rx-ring.rotation.x)*.095;ring.rotation.y+=(ry-ring.rotation.y)*.095;});
    if(this.cables.length)this.updateCables();this.controls.update();this.renderer.render(this.scene,this.camera);
  }
  dispose(){
    this.disposed=true;cancelAnimationFrame(this.animId);this.resizeObserver.disconnect();this.controls.dispose();
    this.scene.traverse(obj=>{if(obj.isMesh){obj.geometry?.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m?.dispose());}});
    this.renderer.dispose();this.renderer.forceContextLoss();
  }
}
