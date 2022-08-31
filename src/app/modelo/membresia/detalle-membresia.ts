import { Cliente } from "../cliente/cliente";
import { Membresia } from "./membresia";

export class DetalleMembresia {

    iddetallemembresia!: number;
    idtransaccion!: string;
    fechaInicio!: string;
    fechaFin!: string;
    estado!:string;
    cliente!: Cliente;
    membresia!: Membresia;
}
