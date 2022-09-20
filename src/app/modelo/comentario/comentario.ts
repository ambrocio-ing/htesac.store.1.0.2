import { Cliente } from "../cliente/cliente";
import { DetalleIngreso } from "../detalle-ingreso/detalleingreso";

export class Comentario {

    idcomentario!: number;
    fecha!: string;
    nombre!: string;
    descripcion!: string;
    estrellas!:number;
    cliente!: Cliente;
    detalleIngreso!: DetalleIngreso;    
}
