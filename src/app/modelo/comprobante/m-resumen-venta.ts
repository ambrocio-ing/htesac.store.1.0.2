import { MDetalleResumenVenta } from "./m-detalle-resumen-venta";

export class MResumenVenta {

    nombreProducto!:string;
    imagenProducto!:string;    
    cantidadTotal!:number;
    fechaEntrega!:string;
    detalleResumenVentas:MDetalleResumenVenta[] = [];    
}
