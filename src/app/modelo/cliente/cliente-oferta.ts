export class ClienteOferta {

    idclienteoferta!: number;
    nombre!: string;
    precio!: number;
    cantidad: number = 1;
    unidad!: string;
    calidad!: string;
    descripcion!: string;
    imagen!: string;
    idclientecomprobante!: number;

    public operar() : number {
        return this.cantidad * this.precio;
    }
}
