import { Variedad } from "../producto/variedad";

export class MDetalleResumenVenta {

    dniCliente!:string;
    nombreCliente!:string;
    numeroComprobante!:string;
    comprobanteId!:number;
    fechaPedido!:string;
    fechaEntrega!:string;
    cantidadProducto!:number;
    variedades:Variedad[] = [];

    public get variedad() : string {
        let texto_va:string = "";       

        this.variedades.forEach(va => {
            let texto_co:string = "";
            va.colores.forEach(co => texto_co += co.nombreColor + ":" + co.cantidadColor + ", ");

            texto_va += va.nombreTalla + ":" + va.cantidadTalla + "->"+ texto_co +"; "
        })

        return texto_va
    }

}
