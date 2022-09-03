import { Variedad } from "../producto/variedad";

export class MResumenVenta {

    nombreProducto!:string;       
    cantidadTotal!:number;
    precioVenta!:number;
    fechaEntrega!:string;
    fechaHoraEntrega!:string;
    variedades:Variedad[] = [];

    public get variedad() : string {
        let texto_va:string = "";       

        this.variedades.forEach(va => {
            let texto_co:string = "";
            va.colores.forEach(co => texto_co += co.nombreColor + ":" + co.cantidadColor + ", ");
            const texto = texto_co.slice(0, texto_co.length - 1);
            texto_va += va.nombreTalla + ":" + va.cantidadTalla + "->"+ texto +"; "
        })

        const va_texto = texto_va.slice(0, texto_va.length -1);
        return va_texto;
    }  
}
