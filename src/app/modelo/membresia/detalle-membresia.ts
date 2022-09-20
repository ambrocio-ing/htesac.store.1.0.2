import { Cliente } from "../cliente/cliente";
import { DetallePago } from "../comprobante/detalle-pago";
import { Membresia } from "./membresia";

export class DetalleMembresia {

    iddetallemembresia!: number;
    idtransaccion!: string;
    fechaInicio!: string;
    fechaFin!: string;
    estado!:string;
    imagen!:string;
    cliente!: Cliente;
    membresia!: Membresia;
    detallePago!:DetallePago;
}
