import { DetalleComprobante } from "../detalle-comprobante/detalle-comprobante";
import { DireccionEnvio } from "../direcion-envio/direccion-envio";
import { DetallePago } from './detalle-pago';

export class Comprobante {

    idcomprobante!: number;
    numero!: string;
    ruc!:string;
    razonSocial!:string;
    idtransaccion!: string;
    tipoComprobante!: string;
    fechaPedido!: string;
    estado!: string;
    igv!: number;
    montoEnvio!: number;
    subTotal!: number;
    descuento!:number;
    total!: number;
    nbolsa!:string;
    fechaEntrega!: string;
    formaEnvio!:string;    
    direccionEnvio!: DireccionEnvio;
    detallePago!:DetallePago;
    detalleComprobantes: DetalleComprobante[] = [];

}
