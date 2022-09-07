import { Usuario } from "../seguridad/usuario/usuario";

export class Proveedor {

    idproveedor!: number;
    ruc!: string;
    razonSocial!: string;
    telefono!: string;
    direccion!: string;
    estado!: string;
    fotoPerfil!: string;
    fecha!:string;
    usuario!: Usuario;
}
