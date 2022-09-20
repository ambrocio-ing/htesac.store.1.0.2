import { DetalleIngreso } from "../detalle-ingreso/detalleingreso";
import { Personal } from "../personal/personal";

export class Ingreso {

    idingreso!: number;
    fecha!: string;
    tipoComprobante!: string;
    igv!: number;
    estado!: string;
    personal!: Personal;
    detalleIngresos: DetalleIngreso[] = [];
    ruc!: string;    
}
