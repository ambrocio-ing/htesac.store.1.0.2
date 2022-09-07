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

    public get variedad() : string {
        let texto_va:string = "";       

        this.variedades.forEach(va => {
            let texto_co:string = "";
            va.colores.forEach(co => texto_co += co.nombreColor + ":" + co.cantidadColor + ", ");

            texto_va += va.nombreTalla + ":" + va.cantidadTalla + "->"+ texto_co +"; "
        })

        return texto_va
    }

    public get variedadColor() : string {
        
        let texto_va:string = JSON.stringify(this.variedades);
        return texto_va
    }
    
}
