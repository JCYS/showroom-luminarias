import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomFactory} from './RoomFactory.js';
import {LightingController} from './LightingController.js';

/**
 * Metadatos del rig de anillos; se mantienen separados de las mallas GLB.
 * z es la altura del centro del aro dentro del espacio local del producto.
 * radius es el radio aproximado donde sujetamos los cables de suspensión.
 * Otras lámparas NO tienen rig y no muestran el control de inclinación.
 */
const RING_RIGS = {
  harley: [{radius:.68,z:1.80},{radius:.49,z:1.29},{radius:.32,z:.83}],
  akela:  [{radius:.58,z:1.79},{radius:.45,z:1.28},{radius:.31,z:.80}],
  orbis:  [{radius:.68,z:1.83},{radius:.48,z:1.28},{radius:.27,z:.75}],
  velar:  [{radius:.65,z:1.82},{radius:.51,z:1.29},{radius:.37,z:.82}]
};

/**
 * Motor del visor. El catálogo pasa un producto, nunca una URL arbitraria.
 * Crea y destruye el contexto WebGL al entrar y salir de la pantalla.
 */
export class Viewer3D {
  constructor(canvas, {product,onStatus=()=>{}}) {
    this.canvas=canvas;
    this.product=product;
    this.onStatus=onStatus;
    this.disposed=false;
    this.ringSpecs=RING_RIGS[product.id] ?? null;
    this.supportsRingLayout=Boolean(this.ringSpecs);
    this.mode='viewer';
    this.layout='horizontal';
    this.rings=[];
    this.cables=[];
    this.targetAngles=[];
    this.model=null;

    this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.48;
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(36,1,.05,100);
    // Los modelos usan la convención Z vertical (no Y).
    this.camera.up.set(0,0,1);
    this.controls=new OrbitControls(this.camera,canvas);
    this.controls.enableDamping=true;
    this.controls.dampingFactor=.07;
    this.controls.minDistance=1.9;
    this.controls.maxDistance=13;
    this.controls.maxPolarAngle=Math.PI*.86;
    this.room=new RoomFactory();
    this.room.root.visible=false;
    this.scene.add(this.room.root);
    this.lighting=new LightingController(this.scene);

    // Reutilizamos el mismo material para todos los cables dinámicos.
    this.cableMaterial=new THREE.MeshStandardMaterial({color:'#a3a19b',metalness:.75,roughness:.35});
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(canvas.parentElement);
    this.resize();
    this.setMode('viewer');
    this.loadModel(product.modelUrl);
    this.animate=this.animate.bind(this);
    this.animId=requestAnimationFrame(this.animate);
  }

  async loadModel(url) {
    try {
      const gltf=await new GLTFLoader().loadAsync(url);
      if(this.disposed) return;
      this.model=gltf.scene;
      this.scene.add(this.model);
      this.lighting.registerModel(this.model);
      if(this.supportsRingLayout) this.prepareRingRig();
      // Harley y VÉLAR se diseñaron para mostrar una composición diagonal.
      const initialLayout=['harley','velar'].includes(this.product.id)?'diagonal':'horizontal';
      this.setLayout(initialLayout);
      this.onStatus(`${this.product.name}: modelo 3D cargado`);
    } catch(error) {
      console.error('Error al cargar el GLB',url,error);
      this.onStatus('No se pudo cargar el modelo. Comprueba la ruta GLB y el servidor local.');
    }
  }

  prepareRingRig() {
    // Nombres Ring_1_*, Ring_2_*, Ring_3_* asignados en generate_models.py.
    // Agrupamos las piezas con attach(), conservando sus transformaciones mundiales.
    const pieces=[];
    this.model.traverse(obj=>{
      if(!obj.isMesh) return;
      if(obj.name.toLowerCase().startsWith('suspension_')) obj.visible=false;
      const match=obj.name.match(/^Ring_(\d+)_/i);
      if(match) pieces.push({obj,index:Number(match[1])-1});
    });
    this.model.updateMatrixWorld(true);
    this.ringSpecs.forEach((spec,index)=>{
      const group=new THREE.Group();
      group.name=`Animated_Ring_${index+1}`;
      group.position.z=spec.z;
      this.model.add(group);
      this.model.updateMatrixWorld(true);
      pieces.filter(piece=>piece.index===index).forEach(({obj})=>group.attach(obj));
      this.rings.push(group);
      // Generamos cables y actualizamos su longitud cada frame mientras se inclina el aro.
      for(let i=0;i<6;i++) {
        const phi=2*Math.PI*i/6;
        const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.002,.002,1,6),this.cableMaterial);
        this.model.add(mesh);
        this.cables.push({mesh,group,spec,phi,index});
      }
    });
    this.updateCables();
  }

  setLayout(layout) {
    if(!this.supportsRingLayout) return;
    this.layout=layout;
    const angleSets={
      harley: [[-.16,.22],[.32,-.19],[-.28,.25]],
      velar: [[-.36,.14],[.24,-.29],[-.35,.23]],
      akela: [[-.23,.21],[-.36,-.25],[.32,.28]],
      orbis: [[-.16,.18],[.27,-.17],[-.20,.14]]
    };
    this.targetAngles=layout==='diagonal'?angleSets[this.product.id]:[[0,0],[0,0],[0,0]];
  }

  updateCables() {
    const up=new THREE.Vector3(0,1,0);
    for(const {mesh,group,spec,phi} of this.cables) {
      const start=new THREE.Vector3(.105*Math.cos(phi),.105*Math.sin(phi),2.91);
      const end=new THREE.Vector3((spec.radius-.02)*Math.cos(phi),(spec.radius-.02)*Math.sin(phi),.04)
        .applyQuaternion(group.quaternion).add(group.position);
      const delta=end.clone().sub(start);
      mesh.position.copy(start).add(end).multiplyScalar(.5);
      mesh.quaternion.setFromUnitVectors(up,delta.clone().normalize());
      mesh.scale.y=delta.length();
    }
  }

  setMode(mode) {
    // Modo 'viewer': cámara libre. Los demás modos: cámara bloqueada.
    this.mode=mode;
    const free=mode==='viewer';
    this.room.root.visible=!free;
    if(!free) this.room.build(mode==='try'?'comedor':mode);
    this.controls.enabled=free;
    this.camera.position.set(free?4.1:5.3,free?-6.1:-7.9,free?3.5:3.0);
    this.controls.target.set(0,0,free?1.60:1.12);
    this.controls.update();
    this.renderer.setClearColor(free?'#ddbea4':'#d3b99f',1);
  }
  setWallColor(hex){this.room.setWallColor(hex);}
  setNight(night){this.lighting.setNight(night);this.renderer.setClearColor(night?'#333a49':'#d3b99f',1);}
  resetCamera(){this.setMode(this.mode);}
  resize(){
    if(this.disposed)return;
    const bounds=this.canvas.parentElement.getBoundingClientRect();
    this.renderer.setSize(Math.max(1,bounds.width),Math.max(1,bounds.height),false);
    this.camera.aspect=Math.max(1,bounds.width)/Math.max(1,bounds.height);
    this.camera.updateProjectionMatrix();
  }
  animate(){
    if(this.disposed)return;
    this.animId=requestAnimationFrame(this.animate);
    this.rings.forEach((ring,i)=>{
      const [x,y]=this.targetAngles[i]??[0,0];
      ring.rotation.x+=(x-ring.rotation.x)*.095;
      ring.rotation.y+=(y-ring.rotation.y)*.095;
    });
    if(this.cables.length)this.updateCables();
    this.controls.update();
    this.renderer.render(this.scene,this.camera);
  }
  dispose(){
    this.disposed=true;
    cancelAnimationFrame(this.animId);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.scene.traverse(obj=>{
      if(!obj.isMesh)return;
      obj.geometry?.dispose();
      const materials=Array.isArray(obj.material)?obj.material:[obj.material];
      materials.forEach(mat=>mat?.dispose());
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
