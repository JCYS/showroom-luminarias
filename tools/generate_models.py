"""Generador reproducible de 8 luminarias conceptuales para LÚMINA.

La fuente visual son fotografías de catálogo, NO dibujos CAD. Escala métrica aproximada.
Requiere: pip install trimesh numpy. Uso: python tools/generate_models.py
Las mallas usan Z vertical para ser consistentes con Three.js del proyecto.
"""
from pathlib import Path
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals

OUT = Path(__file__).resolve().parents[1] / 'assets' / 'models'
OUT.mkdir(parents=True,exist_ok=True)

PALETTE={
    'gold': PBRMaterial(name='Metal dorado',baseColorFactor=[201,154,75,255],metallicFactor=.83,roughnessFactor=.26),
    'black':PBRMaterial(name='Metal negro',baseColorFactor=[35,32,31,255],metallicFactor=.72,roughnessFactor=.3),
    'chrome':PBRMaterial(name='Cromo',baseColorFactor=[188,194,198,255],metallicFactor=.93,roughnessFactor=.16),
    'warm':PBRMaterial(name='LED difusor cálido',baseColorFactor=[255,239,199,255],metallicFactor=0,roughnessFactor=.42,emissiveFactor=[1,.67,.31],doubleSided=True),
    'glass':PBRMaterial(name='Crystal reflector',baseColorFactor=[240,245,250,210],metallicFactor=.1,roughnessFactor=.12,emissiveFactor=[.08,.07,.06],doubleSided=True),
    'cable':PBRMaterial(name='Cable de suspension',baseColorFactor=[140,139,132,255],metallicFactor=.75,roughnessFactor=.35)
}

def mesh_with_mat(m, key):
    m.visual=TextureVisuals(material=PALETTE[key]);return m

def add(scene, mesh, label, key):
    scene.add_geometry(mesh_with_mat(mesh,key),node_name=label,geom_name=label)

def path_tube(path, radius=.017, sides=9):
    """Convierte una polilínea paramétrica en un sólido tubular exportable a GLB."""
    pts=np.asarray(path,dtype=float);n=len(pts); sides=max(5,sides)
    vertices=[];faces=[]
    for i,p in enumerate(pts):
        tangent=pts[min(i+1,n-1)]-pts[max(0,i-1)]
        tangent/=max(np.linalg.norm(tangent),1e-8)
        helper=np.array([0,0,1]) if abs(tangent[2])<.9 else np.array([0,1,0])
        u=np.cross(tangent,helper);u/=max(np.linalg.norm(u),1e-8)
        v=np.cross(tangent,u)
        for j in range(sides):
            a=2*np.pi*j/sides
            vertices.append(p+radius*(u*np.cos(a)+v*np.sin(a)))
        if i:
            for j in range(sides):
                k=(j+1)%sides;a=(i-1)*sides+j;b=(i-1)*sides+k;c=i*sides+j;d=i*sides+k
                faces.append((a,b,c));faces.append((b,d,c))
    for j in range(1,sides-1):
        faces.extend([(0,j+1,j),((n-1)*sides,(n-1)*sides+j,(n-1)*sides+j+1)])
    return trimesh.Trimesh(vertices=np.array(vertices),faces=np.array(faces),process=False)

def wire(scene,start,end,tag='Suspension',rad=.0035):
    add(scene,path_tube([start,end],rad,6),tag,'cable')

def disc(scene,radius,z,metal):
    c=trimesh.creation.cylinder(radius=radius,height=.068,sections=48)
    c.apply_translation([0,0,z]);add(scene,c,'Ceiling_Canopy',metal)
    add(scene,path_tube([[0,0,z-.04],[0,0,z-.12]],.011,8),'Canopy_Center','cable')

def circular(scene,ring_index,radius,z,metal,tilt=0):
    """Anillo doble: borde metálico y difusor luminoso sobre la cara inferior.
    Ring_N_* permite animación opcional por elemento desde el visor JS."""
    t=np.linspace(0,2*np.pi,112)
    def p(offz):return np.stack([radius*np.cos(t),radius*np.sin(t),np.full(len(t),z+offz)],axis=1)
    add(scene,path_tube(p(.025),.033,9),f'Ring_{ring_index}_Metal',metal)
    add(scene,path_tube(p(-.015),.029,9),f'Ring_{ring_index}_LED','warm')
    add(scene,path_tube(p(.055),.009,7),f'Ring_{ring_index}_Trim',metal)
    for i in range(6):
        a=2*np.pi*i/6
        wire(scene,[.10*np.cos(a),.10*np.sin(a),2.91],[radius*np.cos(a),radius*np.sin(a),z+.04],f'suspension_{ring_index}_{i}',.0023)

def make_ring_product(name,radii,heights,metal):
    s=trimesh.Scene();disc(s,.19,2.96,metal)
    for i,(r,z) in enumerate(zip(radii,heights),1): circular(s,i,r,z,metal)
    return s

def organic(name,style):
    s=trimesh.Scene();metal='gold' if name!='noctis' else 'black'
    if name in ('luren','luxen','noctis'):
        if name=='luren':
            disc(s,.15,2.96,'gold')
            # Tres pétalos ondulantes entrelazados que forman una corona escultórica.
            for j in range(3):
                t=np.linspace(0,2*np.pi,190)
                theta=t + j*2*np.pi/3
                r=.56+.17*np.sin(3*theta+j*.5)
                path=np.stack([r*np.cos(theta),r*np.sin(theta),1.32+.19*np.sin(2*theta+j*2.1)],axis=1)
                add(s,path_tube(path,.034,10),f'Luren_LED_wave_{j}','warm')
                add(s,path_tube(path+np.array([0,0,.038]),.014,7),f'Luren_gold_rim_{j}','gold')
            for a in np.linspace(0,2*np.pi,7,endpoint=False):
                wire(s,[.08*np.cos(a),.08*np.sin(a),2.9],[.55*np.cos(a),.55*np.sin(a),1.38],f'Suspension_{int(a*100)}')
        else:
            disc(s,.28,2.96,metal)
            for j in range(2 if name=='luxen' else 3):
                t=np.linspace(-1,1,160)
                if name=='luxen':
                    path=np.stack([t*.95,np.full(len(t),(.20 if j==0 else -.20)),1.27+.15*np.sin(3*np.pi*t+(j*np.pi))],axis=1)
                else:
                    path=np.stack([t*1.05,(j-1)*.10+.05*np.cos(t*3*np.pi),1.36+.07*np.sin(2*np.pi*t+j*1.5)],axis=1)
                add(s,path_tube(path,.031 if name=='luxen' else .023,10),f'{name}_LED_wave_{j}','warm')
                add(s,path_tube(path+np.array([0,0,.033]),.012,7),f'{name}_metal_{j}',metal)
            for x in [-.78,.78]:
                for y in ([-.2,.2] if name=='luxen' else [0]):wire(s,[x*.18,y*.3,2.90],[x,y,1.4],f'Suspension_{x}_{y}')
    return s

def mirabel():
    s=trimesh.Scene();disc(s,.16,2.96,'chrome')
    wire(s,[0,0,2.91],[0,0,2.3],'Center_Cable',.008)
    # Silueta de araña escalonada: coronas y gotas facetadas de cristal.
    for level,(rad,z,count) in enumerate([(.46,1.83,24),(.36,1.63,19),(.25,1.43,14),(.16,1.25,9)]):
        th=np.linspace(0,2*np.pi,101)
        ring=np.stack([rad*np.cos(th),rad*np.sin(th),np.full(len(th),z)],axis=1)
        add(s,path_tube(ring,.016,8),f'Crystal_support_ring_{level}','chrome')
        for i in range(count):
            a=i*2*np.pi/count; x=rad*np.cos(a);y=rad*np.sin(a)
            # Cristales facetados de baja poligonización y baja carga de GPU.
            drop=trimesh.creation.cone(radius=.028,height=.14,sections=6)
            drop.apply_translation([x,y,z-.10-(i%3)*.035])
            add(s,drop,f'Crystal_{level}_{i}','glass')
            if i%3==0: add(s,path_tube([[x,y,z-.12],[x,y,z-.185]],.008,6),f'Crystal_glow_{level}_{i}','warm')
    return s

BUILD={
 'harley':lambda:make_ring_product('harley',[.68,.49,.32],[1.80,1.29,.83],'gold'),
 'luren':lambda:organic('luren',0),
 'luxen':lambda:organic('luxen',0),
 'noctis':lambda:organic('noctis',0),
 'akela':lambda:make_ring_product('akela',[.58,.45,.31],[1.79,1.28,.80],'black'),
 'mirabel':mirabel,
 'orbis':lambda:make_ring_product('orbis',[.68,.48,.27],[1.83,1.28,.75],'chrome'),
 'velar':lambda:make_ring_product('velar',[.65,.51,.37],[1.82,1.29,.82],'gold')
}

if __name__=='__main__':
    for name,fn in BUILD.items():
        scene=fn()
        data=scene.export(file_type='glb')
        (OUT/f'{name}.glb').write_bytes(data)
        print(f'{name}: {len(data):,} bytes / {len(scene.geometry)} meshes')
