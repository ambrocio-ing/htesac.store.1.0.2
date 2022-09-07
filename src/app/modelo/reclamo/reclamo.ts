import { Cliente } from "../cliente/cliente";
import { Proveedor } from "../proveedor/proveedor";

export class Reclamo {

    idreclamo!: number;
    asunto!: string;
    fecha!: string;
    descripcion!: string;
    cliente!: Cliente;
    proveedor!: Proveedor;
}
