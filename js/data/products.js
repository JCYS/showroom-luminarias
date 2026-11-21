/**
 * Datos simulados del catálogo.
 * En producción podrían recuperarse de una API / CMS sin modificar componentes.
 * `modelUrl` es null si NO disponemos de modelo 3D propio del producto.
 * Los precios y existencias son demostrativos; los datos de algunas fichas proceden
 * de las capturas del catálogo facilitadas como referencia por el cliente.
 */
export const products = [
  {id:'harley',name:'HARLEY',code:'LC143D',watts:152,price:205,image:'harley.webp',materials:'Aluminio + silicona',dimensions:'Ø20 / Ø40 / Ø60 cm',lumens:15200,temperature:'3CCT',style:'Moderno',finish:'Dorado',category:'Colgantes',stock:true,modelUrl:null,description:'Tres anillos LED escultóricos de suspensión regulable. Ideal para salas y comedores de doble altura.'},
  {id:'luren',name:'LUREN',code:'LC245D',watts:140,price:341,image:'luren.webp',materials:'Aluminio + silicona',dimensions:'Ø60 cm',lumens:null,temperature:'3CCT',style:'Contemporáneo',finish:'Dorado',category:'Colgantes',stock:true,modelUrl:null,description:'Luminaria decorativa con curvas luminosas y acabado cálido.'},
  {id:'luxen',name:'LUXEN',code:'LC244D',watts:150,price:386,image:'luxen.webp',materials:'Aluminio + silicona',dimensions:'Ø80 cm · Barra Ø30 cm',lumens:null,temperature:'3CCT',style:'Contemporáneo',finish:'Dorado',category:'Colgantes',stock:true,modelUrl:null,description:'Diseño lineal entrelazado para ambientes contemporáneos.'},
  {id:'noctis',name:'NOCTIS',code:'LC263N',watts:110,price:424,image:'noctis.webp',materials:'Aluminio + acrílico',dimensions:'100 cm · Barra Ø30 cm',lumens:null,temperature:'3CCT',style:'Minimalista',finish:'Negro',category:'Colgantes',stock:true,modelUrl:null,description:'Luminaria lineal de doble trazo para mesas y barras.'},
  {id:'akela',name:'AKELA',code:'LDH04',watts:172,price:442,image:'akela.webp',materials:'Aluminio + acrílico',dimensions:'Ø30 / Ø40 / Ø50 cm',lumens:null,temperature:'3CCT',style:'Moderno',finish:'Negro',category:'Colgantes',stock:true,modelUrl:'./assets/models/luminaria_tres_aros.glb',description:'Tres aros luminosos suspendidos a distintas alturas. Modelo conceptual 3D disponible para visualizar proporciones.'},
  {id:'mirabel',name:'MIRABEL',code:'LC204C',watts:78,price:258,image:'mirabel.webp',materials:'Aluminio + cristal',dimensions:'Ø40 cm',lumens:7020,temperature:'3CCT',style:'Clásico moderno',finish:'Cromo',category:'Colgantes',stock:true,modelUrl:null,description:'Luminaria decorativa de cristal con reflejos suaves y brillantes.'},
  {id:'orbis',name:'ORBIS',code:'LC330R',watts:168,price:489,image:'orbis.webp',materials:'Aluminio + acrílico',dimensions:'Ø60 / Ø40 / Ø20 cm',lumens:16800,temperature:'3CCT',style:'Moderno',finish:'Cromo',category:'Colgantes',stock:true,modelUrl:null,description:'Conjunto de tres aros de altura escalonada.'},
  {id:'velar',name:'VÉLAR',code:'LC318V',watts:126,price:379,image:'velar.webp',materials:'Aluminio + silicona',dimensions:'Ø60 cm',lumens:12600,temperature:'3CCT',style:'Contemporáneo',finish:'Dorado',category:'Colgantes',stock:true,modelUrl:null,description:'Aros inclinados en una composición dinámica.'}
];
