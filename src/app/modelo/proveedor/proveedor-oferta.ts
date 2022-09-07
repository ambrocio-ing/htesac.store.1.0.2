export class ProveedorOferta {

    idproveedoroferta!: number;
    nombre!: string;
    precio!: number;
    cantidad: number = 1;
    unidad!: string;
    calidad!: string;
    descripcion!: string;
    imagen!: string;
    idproveedorcomprobante!: number;

    operar() : number {
        return this.cantidad * this.precio;
    }
}
