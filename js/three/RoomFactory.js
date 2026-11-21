import * as THREE from 'three';
/**
 * Habitaciones ligeras creadas con geometría procedural.
 * Convención del proyecto: Z = vertical, X = horizontal, Y = profundidad.
 * Reemplazables más adelante por habitaciones GLB de alta calidad.
 */
const material=(color,roughness=.87)=>new THREE.MeshStandardMaterial({color,roughness});
function cube(parent,sizes,position,mat){const obj=new THREE.Mesh(new THREE.BoxGeometry(...sizes),mat);obj.position.set(...position);parent.add(obj);return obj;}
function cylinder(parent,rad,height,pos,mat){const m=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,height,24),mat);m.rotation.x=Math.PI/2; // cilindro por defecto sobre eje Y; girar para que apunte a Z
m.position.set(...pos);parent.add(m);return m;}
function plant(root,x,y){const pot=material('#b69b83'),leaf=material('#627960');cylinder(root,.19,.4,[x,y,-.30],pot);for(let i=0;i<7;i++){const phi=i*Math.PI*2/7;const ball=new THREE.Mesh(new THREE.SphereGeometry(.24,9,7),leaf);ball.position.set(x+Math.cos(phi)*.24,y+Math.sin(phi)*.19,.2+(i%3)*.16);root.add(ball);}}
function stool(root,x,y){const cloth=material('#d7c6b6'),dark=material('#725f54');cube(root,[.58,.56,.13],[x,y,-.28],cloth);cube(root,[.57,.11,.65],[x,y+.23,.10],cloth);for(const dx of [-.22,.22])for(const dy of [-.19,.19])cube(root,[.06,.06,.38],[x+dx,y+dy,-.5],dark);}
function dining(root){const wood=material('#947258'),warm=material('#c7aa89');cube(root,[3.2,1.45,.15],[.1,-.1,-.05],wood);for(const x of [-1.2,1.4])for(const y of [-.6,.4])cube(root,[.12,.12,.65],[x,y,-.44],wood);for(const x of [-1,0.1,1.25]){stool(root,x,-1.25);stool(root,x,1.05);}cylinder(root,.12,.27,[.1,-.1,.16],warm);plant(root,3.25,1.8);}
function living(root){const beige=material('#d0bbaa'),wood=material('#8c6d55'),cream=material('#e5d6c5');cube(root,[3.4,1.05,.5],[-1.3,.88,-.18],beige);cube(root,[3.4,.24,.85],[-1.3,1.30,.34],beige);cube(root,[.28,1.06,.63],[-2.85,.9,.07],beige);cube(root,[.28,1.06,.63],[.2,.9,.07],beige);cube(root,[2.8,1.7,.045],[-1.15,-1.25,-.54],cream);cylinder(root,.66,.17,[-1.1,-1.1,-.32],wood);cylinder(root,.15,.19,[-1.1,-1.1,-.13],cream);plant(root,3.3,1.65);}
function kitchen(root){const wood=material('#98785d'),stone=material('#e4d9c9'),dark=material('#665a4d');cube(root,[6.3,.85,.83],[.2,2.65,-.09],wood);cube(root,[6.3,.92,.09],[.2,2.65,.36],stone);cube(root,[5.8,.65,.83],[.2,2.94,2.0],wood);cube(root,[4.2,1.23,.19],[0,-.55,.0],stone);cube(root,[3.9,1.03,.66],[0,-.55,-.39],wood);for(const x of [-1.1,0,1.1]){stool(root,x,-1.9);}cube(root,[.75,.10,.02],[-1.4,2.15,.4],dark);}
export class RoomFactory {
  constructor(){this.root=new THREE.Group();this.wallMat=material('#d8c0a7');this.type='sala';this.build('sala');}
  build(type='sala'){
    this.type=type;this.root.clear();
    const floor=material('#d7c0a8'),trim=material('#f0e2d3'),frame=material('#a58872');
    cube(this.root,[11,10,.18],[0,.1,-.68],floor);
    cube(this.root,[11,.16,5],[0,3.4,1.8],this.wallMat);
    cube(this.root,[.16,9.5,5],[-5.25,.1,1.8],this.wallMat);
    cube(this.root,[11,.11,.14],[0,3.24,-.34],trim);
    // Ventanal: aporta lectura espacial y tonalidad distinta entre día y noche.
    cube(this.root,[.08,2.9,2.7],[-5.10,-1.8,1.42],material('#b0c9d1'));
    for(const y of [-3.2,-.4])cube(this.root,[.11,.07,2.85],[-5.02,y,1.42],frame);
    cube(this.root,[.12,2.91,.085],[-5.0,-1.8,1.4],frame);
    cube(this.root,[1.75,.12,1.18],[2.2,3.24,1.67],frame);
    cube(this.root,[1.54,.13,.96],[2.2,3.15,1.67],material('#c1ad98'));
    if(type==='sala')living(this.root);
    else if(type==='cocina')kitchen(this.root);
    else dining(this.root);
  }
  setWallColor(hex){this.wallMat.color.set(hex);}
}
