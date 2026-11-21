import numpy as np, trimesh, math
from trimesh.visual.material import PBRMaterial
from PIL import Image, ImageDraw, ImageFilter

OUT='/mnt/data/luminaria_demo'
scene=trimesh.Scene()
metal=PBRMaterial(name='satin_champagne_silver',baseColorFactor=[192,185,175,255],metallicFactor=.83,roughnessFactor=.26,doubleSided=True)
bright=PBRMaterial(name='warm_led_diffuser',baseColorFactor=[255,243,215,255],emissiveFactor=[1.0,.78,.47],metallicFactor=0.0,roughnessFactor=.36,doubleSided=True)
crystal=PBRMaterial(name='crystal_texture',baseColorFactor=[245,239,221,255],emissiveFactor=[.6,.46,.26],metallicFactor=.13,roughnessFactor=.24,doubleSided=True)
cablemat=PBRMaterial(name='thin_steel_suspension',baseColorFactor=[155,150,145,255],metallicFactor=.75,roughnessFactor=.35,doubleSided=True)

def annular_strip(ro,ri,z_bottom,z_top,n=128):
    # 4 round surfaces outer inner top bottom
    theta=np.linspace(0,2*np.pi,n,endpoint=False)
    vertices=[]
    for r,z in [(ro,z_bottom),(ro,z_top),(ri,z_bottom),(ri,z_top)]:
        vertices += [[float(r*np.cos(t)),float(r*np.sin(t)),z] for t in theta]
    faces=[]
    for i in range(n):
        j=(i+1)%n
        for a,b in [(0,1),(2,3),(0,2),(1,3)]:
            faces.extend([[a*n+i,b*n+i,b*n+j],[a*n+i,b*n+j,a*n+j]])
    return trimesh.Trimesh(vertices=np.array(vertices),faces=np.array(faces),process=False)

def cyl_between(a,b,r=.0025,sections=8):
    a=np.array(a,dtype=float);b=np.array(b,dtype=float)
    m=trimesh.creation.cylinder(radius=r,height=np.linalg.norm(b-a),sections=sections)
    m.apply_transform(trimesh.geometry.align_vectors([0,0,1],b-a))
    m.apply_translation((a+b)/2)
    return m

rings=[(0.72,1.67),(0.55,1.13),(0.38,.62)]
for idx,(rad,z) in enumerate(rings):
    # thin body metal across center and reflective outer band
    m=annular_strip(rad,rad-.033,z-.019,z+.019);m.visual=trimesh.visual.TextureVisuals(material=metal);scene.add_geometry(m,geom_name=f'ring_{idx+1}_metal')
    # main bright LED diffuser below ring
    m=annular_strip(rad-.003,rad-.037,z-.031,z-.016);m.visual=trimesh.visual.TextureVisuals(material=bright);scene.add_geometry(m,geom_name=f'ring_{idx+1}_led_bottom')
    # narrow decorative acrylic glowing side rim
    m=annular_strip(rad+.002,rad-.002,z-.015,z-.005);m.visual=trimesh.visual.TextureVisuals(material=crystal);scene.add_geometry(m,geom_name=f'ring_{idx+1}_glowing_rim')

# Round ceiling canopy (3D coordinates in meters)
canopy=trimesh.creation.cylinder(radius=.185,height=.038,sections=64)
canopy.apply_translation([0,0,2.97]); canopy.visual=trimesh.visual.TextureVisuals(material=metal)
scene.add_geometry(canopy,geom_name='ceiling_canopy')
# central power stem / cables
for index,(rad,z) in enumerate(rings):
    count=[8,6,4][index]
    offset=np.pi/12+index*.17
    for i in range(count):
        theta=2*np.pi*i/count+offset
        # Different locations on ceiling canopy, so thin lines fan outward
        top_rad=.135 if index==0 else (.09 if index==1 else .053)
        a=[top_rad*math.cos(theta),top_rad*math.sin(theta),2.947]
        b=[(rad-.018)*math.cos(theta),(rad-.018)*math.sin(theta),z+.016]
        cable=cyl_between(a,b,.0019,8);cable.visual=trimesh.visual.TextureVisuals(material=cablemat)
        scene.add_geometry(cable,geom_name=f'suspension_{index+1}_{i+1}')
# central electrical wire, subtler
power=cyl_between([0,0,2.945],[0,0,.65],.0016,8)
power.visual=trimesh.visual.TextureVisuals(material=cablemat)
scene.add_geometry(power,geom_name='center_electrical_wire')

path=f'{OUT}/luminaria_tres_aros.glb'
scene.export(path,file_type='glb')
print('CREATED',path)
print('meters width',2*rings[0][0], 'height',2.99-.59,'geometry count',len(scene.geometry))
# Preview composed via matplotlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
fig=plt.figure(figsize=(8,9),facecolor='#e9e2d8')
ax=fig.add_subplot(111,projection='3d',computed_zorder=False)
ax.set_facecolor('#e9e2d8')
for rad,z in rings:
    t=np.linspace(0,2*np.pi,500)
    for dz,c,lw in [(.019,'#8b8173',5),(-.026,'#fff3ca',7),(-.026,'#fffef3',2)]:
        ax.plot(rad*np.cos(t),rad*np.sin(t),np.full_like(t,z+dz),color=c,lw=lw,zorder=5)
for idx,(rad,z) in enumerate(rings):
    count=[8,6,4][idx];offset=np.pi/12+idx*.17
    for i in range(count):
        theta=2*np.pi*i/count+offset
        top_rad=[.135,.09,.053][idx]
        ax.plot([top_rad*np.cos(theta),(rad-.018)*np.cos(theta)],[top_rad*np.sin(theta),(rad-.018)*np.sin(theta)],[2.947,z+.016],color='#aa9e90',lw=.65,zorder=1)
t=np.linspace(0,2*np.pi,120)
ax.plot(.185*np.cos(t),.185*np.sin(t),np.full_like(t,2.97),color='#9e9588',lw=5)
ax.view_init(elev=13,azim=-65)
ax.set(xlim=(-.95,.95),ylim=(-.95,.95),zlim=(.35,3.1))
ax.set_box_aspect((1.8,1.8,2.5),zoom=.85)
ax.set_axis_off()
fig.text(.5,.94,'LUMINARIA DE TRES AROS',ha='center',fontsize=17,color='#40362f',weight='bold')
fig.text(.5,.905,'Modelo 3D conceptual • Aros LED suspendidos',ha='center',fontsize=10,color='#786d63')
fig.savefig(f'{OUT}/vista_previa.png',dpi=160,bbox_inches='tight',facecolor=fig.get_facecolor())
print('preview created')
