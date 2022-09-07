import { Ingreso } from "../ingreso/ingreso";
import { Persona } from "../persona/persona";
import { Usuario } from "../seguridad/usuario/usuario";

export class Personal {
    idpersonal!:number;
    estado!:string;
    fecha!:string;
    usuario!:Usuario;
    persona!:Persona;
    ingresos:Ingreso[] = [];   
}
