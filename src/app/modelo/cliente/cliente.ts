import { ClienteCaracteristica } from "../cliente-caracteristica/cliente-caracteristica";
import { ClienteProveedor } from "../cliente-proveedor/cliente-proveedor";
import { Persona } from "../persona/persona";
import { Usuario } from "../seguridad/usuario/usuario";

export class Cliente {

    idcliente!: number;
    estado!: string;
    fecha!: string;
    puntos!:number;
    persona!: Persona;
    usuario!: Usuario;
    clienteProveedor!: ClienteProveedor;
    clienteCaracteristica!: ClienteCaracteristica;
}
