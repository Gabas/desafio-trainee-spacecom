// import { haversine } from "./haversine.js";
// import { parsearLinha } from "./leitor.js";
import { lerDataset } from "./leitor.js";

// const distancia = haversine(-10.07996, -37.08384, -10.07987, -37.08389);
// console.log(distancia);



// console.log(parsearLinha('9;;"2024-01-01 00:00:00";1.64046;-69.53947;true;"10"'));
// console.log(parsearLinha('1;;"2024-01-01 00:00:00";-25.59386;-73.96319;false;'));



const registros = lerDataset("data/dataset1.txt");
console.log(registros.length);
console.log(registros[0]);