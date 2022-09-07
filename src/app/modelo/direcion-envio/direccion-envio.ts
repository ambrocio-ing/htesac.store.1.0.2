import { Cliente } from "../cliente/cliente";
import { Destinatario } from "../destinatario/destinatario";

export class DireccionEnvio {

    iddireccion!: number;
    direccion!: string;
    telefono!: string;
    referencia!: string;
    codigoPostal!: string;
    pais!: string;
    region!: string;
    provincia!: string;
    distrito!: string;
    principal!: string;    
    cliente!: Cliente;
    destinatario!: Destinatario;   
}
