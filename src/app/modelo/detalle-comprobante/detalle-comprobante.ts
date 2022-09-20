import { DetalleIngreso } from "../detalle-ingreso/detalleingreso";
import { Variedad } from "../producto/variedad";

export class DetalleComprobante {

    iddetallecomprobante!: number;
    variedades:Variedad[] = [];
    cantidad!: number;
    descuento!: number;
    precioUnitario!:number;
    subTotal!: number;
    detalleIngreso!: DetalleIngreso;
    comprobanteId!: number;

    public actualizarStock() : number {
        this.detalleIngreso.stockActual = this.detalleIngreso.stockActual - this.cantidad;
        return this.detalleIngreso.stockActual;
    }   
    
}
