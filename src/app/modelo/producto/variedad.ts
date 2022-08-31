import { Color } from "./color";

export class Variedad {

    idvariedad!: number;
    nombreTalla!: string;
    cantidadTalla!: number;
    pvestimentaId!:number;
    carritoId!:number;
    colores:Color[] = [];
}
