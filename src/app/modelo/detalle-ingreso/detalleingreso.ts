import { Producto } from "../producto/producto";
import { Variedad } from "../producto/variedad";

export class DetalleIngreso {

    iddetalleingreso!: number;
    precioCompra!: number;
    precioVenta!: number;
    precioVentaAnterior:number = 0;
    porcentajeDescuento!:number;
    stockInicial: number = 1;
    stockActual!: number;
    fechaProduccion!: string;
    fechaVencimiento!: string;
    estado!: boolean;
    sucursal!:string;
    createAt!:string;
    producto!: Producto;
    variedades:Variedad[] = [];    
    ingresoId!: number;  
       

}
