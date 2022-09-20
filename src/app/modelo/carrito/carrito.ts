import { DetalleIngreso } from "../detalle-ingreso/detalleingreso";

export class Carrito {

    idcarrito!: number;
    variedad!:string;
    cantidad: number = 1;
    descuento!: number;
    subTotal!: number;
    idcliente!: number;
    detalleIngreso!: DetalleIngreso;   
    
    public calculateSubTotal() : number {
        this.subTotal = this.cantidad * this.detalleIngreso.precioVenta;
        return this.subTotal;
    }

    public stockSuficiente() : boolean {
        if(this.cantidad <= this.detalleIngreso.stockActual){
            return true;
        }
        
        return false;
    }
    
}
