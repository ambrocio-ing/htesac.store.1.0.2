import { ClienteProveedor } from "../cliente-proveedor/cliente-proveedor";
import { ClienteOferta } from "./cliente-oferta";

export class ClienteComprobante {

    idclientecomprobante!: number;
    fecha!: string;
    estado!: string;
    igv!: number;
    subTotal!: number;
    total!: number;
    clienteProveedor!: ClienteProveedor;
    clienteOfertas: ClienteOferta[] = [];

    calculateTotal() : number {
        this.total = 0;
        this.clienteOfertas.forEach((po:ClienteOferta) => {
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
        const re:number = Math.round(numero * 100) / 100;
        return re;
    }  
}
