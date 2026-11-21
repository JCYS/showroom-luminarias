import * as THREE from 'three';
/** Administrador de los materiales emisivos de las luminarias. */
export class LightingController {
  constructor(scene){
    this.brightness=.75;this.powered=true;this.night=false;this.ledMeshes=[];
    this.ambient=new THREE.HemisphereLight('#fff3df','#9b8677',2.15);
    this.key=new THREE.DirectionalLight('#fff3db',2.4);this.key.position.set(-4,-5,7);
    this.fill=new THREE.PointLight('#ffd6a0',1.5,14);this.fill.position.set(0,-2,3);
    scene.add(this.ambient,this.key,this.fill);
  }
  registerModel(model){
    // Solo clona materiales emisivos para no alterar los originales compartidos.
    this.ledMeshes=[];
    model.traverse(obj=>{
      if(!obj.isMesh||!obj.material)return;
      const mats=Array.isArray(obj.material)?obj.material:[obj.material];
      const updated=mats.map(mat=>{const cloned=mat.clone();if(/led|crystal|glow|light|diffus/i.test(mat.name)||mat.emissiveIntensity>0 && mat.emissive.getHex()!==0){
        this.ledMeshes.push({material:cloned,original:cloned.emissive.clone(),intensity:cloned.emissiveIntensity||1});
      }return cloned;});
      obj.material=Array.isArray(obj.material)?updated:updated[0];
    });this.apply();
  }
  setBrightness(value){this.brightness=Math.max(0,Math.min(1,Number(value)));this.apply();}
  togglePower(){this.powered=!this.powered;this.apply();return this.powered;}
  setNight(night){this.night=Boolean(night);this.ambient.intensity=this.night?.55:2.15;this.key.intensity=this.night?.28:2.4;this.fill.intensity=this.night?2.7:1.5;this.apply();}
  apply(){const intensity=this.powered?this.brightness:0;for(const led of this.ledMeshes){led.material.emissive.copy(led.original).multiplyScalar(intensity*2.2);led.material.emissiveIntensity=led.intensity*(intensity>0?1.4:0);led.material.needsUpdate=true;}this.fill.intensity=(this.night?2.7:1.5)*intensity;}
}
