import { Tipo } from "./tipo";

export class Categoria {

    idcategoria!:number;
    nombre!:string;
    descripcion!:string;    
    tipos:Tipo[] = [];
}
