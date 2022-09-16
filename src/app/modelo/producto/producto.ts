import { ProductoDatoNutricional } from "./producto-dato-nutricional";
import { ProductoImagen } from "./producto-imagen";
import { ProductoOtros } from "./producto-otros";
import { ProductoVestimenta } from "./producto-vestimenta";
import { Tipo } from "./tipo";

export class Producto {

    idproducto!: number;
    codigo!: string;
    nombre!: string;
    puntos!: number;
    nventas!: number;
    nestrellas!: number;
    descripcion!: string;
    marca!: string;
    tipo!: Tipo;
    productoImagenes: ProductoImagen[] = [];
    productoDatoNutricional!: ProductoDatoNutricional;
    productoVestimenta!: ProductoVestimenta;
    productoOtros!: ProductoOtros;
}
