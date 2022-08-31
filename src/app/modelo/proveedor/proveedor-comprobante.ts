import { Proveedor } from "./proveedor";
import { ProveedorOferta } from "./proveedor-oferta";

export class ProveedorComprobante {

    idproveedorcomprobante!: number;
    fecha!: string;
    estado!: string;
    igv!: number;
    subTotal!: number;
    total!: number;
    proveedor!: Proveedor;
    proveedorOfertas: ProveedorOferta[] = [];
    
    calculateTotal() : number {
        this.total = 0;
        this.proveedorOfertas.forEach((po:ProveedorOferta) => {
            this.total += po.operar();
        });

        this.total = this.redondeo(this.total); 

        this.igv = 0;
        this.igv = 0.18 * this.total;        
        this.igv = this.redondeo(this.igv); 

        this.subTotal = 0;
        this.subTotal = this.total - this.igv;        
        this.subTotal = this.redondeo(this.subTotal);
        
        return this.total;
    }

    redondeo(numero:number) : number {
        const re = Math.round(numero * 100) / 100;
        return re;
    }    

}
