import { Component, OnInit } from '@angular/core';
import { DetalleIngreso } from 'src/app/modelo/detalle-ingreso/detalleingreso';
import { Ingreso } from 'src/app/modelo/ingreso/ingreso';
import { Personal } from 'src/app/modelo/personal/personal';
import { Color } from 'src/app/modelo/producto/color';
import { Producto } from 'src/app/modelo/producto/producto';
import { Variedad } from 'src/app/modelo/producto/variedad';
import { IngresoService } from 'src/app/servicio/ingreso/ingreso.service';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.css']
})
export class NuevoIngresoComponent implements OnInit {

  url_img:string = environment.urlBackend + "/mostrar/pto/imagen";

  visibleModal: boolean = false;
  ingreso: Ingreso = new Ingreso();
  detalleIngreso: DetalleIngreso = new DetalleIngreso();

  fechahoy = new Date(Date.now());
  preloader: boolean = false;

  //variedades
  variedad: Variedad = new Variedad();
  color: Color = new Color();

  mproducto: Producto = new Producto();
  verMasVisible: boolean = false;

  sucursal!:string;

  constructor(private productoService: ProductoService,
    private ingresoService: IngresoService) {

    this.ingreso.personal = new Personal();
    this.ingreso.igv = 0.18;

    this.detalleIngreso.producto = new Producto();
    //this.detalleIngreso.producto.productoVestimenta = new ProductoVestimenta();
    this.color.cantidadColor = 1;

  }

  ngOnInit(): void {

    this.productoService.cbProducto.subscribe(resp => {
      this.detalleIngreso.producto = resp;
    });
  }

  selectProducto(): void {
    this.visibleModal = true;
  }

  isValidDetalleIngreso(): string[] {
    let mensajes: string[] = [];

    if (!this.detalleIngreso?.precioVentaAnterior) {
      mensajes.push("Precio de venta anterior es obligatorio");
    }

    if (!this.detalleIngreso?.porcentajeDescuento) {
      mensajes.push("El porcentaje de descuento es obligatorio");
    }

    if (!this.detalleIngreso?.precioVenta) {
      mensajes.push("Precio de venta es obligatorio");
    }

    if (!this.detalleIngreso?.stockInicial) {
      mensajes.push("Stock inicial es obligatorio");
    }

    if (!this.detalleIngreso?.sucursal) {
      mensajes.push("La sucursal es obligatorio");
    }

    if (!this.detalleIngreso.producto?.idproducto) {
      mensajes.push("Producto es obligatorio");
    }    

    return mensajes;
  }

  isValidStock(di: DetalleIngreso): boolean {

    if (di.producto.productoVestimenta == null) {
      return true;
    }

    let cant_stock: number = 0;
    di.variedades.forEach(va => cant_stock += va.cantidadTalla);

    if (di.stockInicial == cant_stock) {
      return true;
    }

    return false;
  }

  agregarDI(): void {
    this.detalleIngreso.estado = true;
    this.detalleIngreso.sucursal = this.sucursal;
    if (this.isValidDetalleIngreso().length == 0 && this.isValidStock(this.detalleIngreso)) {
      const element = this.ingreso.detalleIngresos.find(di => di.producto.idproducto == this.detalleIngreso.producto.idproducto);
      if (element == undefined || element == null) {        
        this.detalleIngreso.stockActual = this.detalleIngreso.stockInicial;
        this.ingreso.detalleIngresos.push(this.detalleIngreso);
        this.detalleIngreso = new DetalleIngreso();
        this.detalleIngreso.producto = new Producto();
      }
      else {
        Swal.fire({
          icon: 'info',
          title: 'Dato redundante',
          text: 'El producto ya fue agregado'
        });
      }
    }
    else {
      const mensajes: string = this.isValidDetalleIngreso().join(", ");
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos o stock injustificado',
        text: mensajes + " o stock inicial no coincide con la cantidad de tallas y colores ingresados"
      });
    }
  }

  cancelarDI(): void {
    this.detalleIngreso = new DetalleIngreso();
    this.detalleIngreso.producto = new Producto();
  }

  eliminarDI(di: DetalleIngreso): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea eliminar',
      text: 'Está intentando eliminar, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, eliminar'
    }).then(resp => {
      if (resp.value) {
        let dis = this.ingreso.detalleIngresos.filter(item => item.producto.idproducto != di.producto.idproducto);
        this.ingreso.detalleIngresos = dis;
      }
    });

  }

  verMas(di: DetalleIngreso): void {
    this.mproducto = di.producto;
    this.verMasVisible = true;
  }

  saveIngreso(): void {
    this.preloader = true;
    this.ingreso.personal.idpersonal = 1;
    this.ingreso.estado = "Vigente";
    if (this.ingreso.detalleIngresos.length > 0) {
      this.ingresoService.createIngreso(this.ingreso).subscribe(resp => {
        this.preloader = false;
        this.cancelar();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        });
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 500 || err.status == 404) {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: err.error.mensaje
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: 'No fue posible establecer conexión, por favor intentelo mas tarde'
          });
        }
      });
    }
    else {
      this.preloader = false;
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Agrege por lo menos un detalle de ingreso'
      });
    }
  }

  cancelar(): void {
    this.ingreso = new Ingreso();
    this.ingreso.personal = new Personal();
    this.ingreso.igv = 0.18;
  }

  calculos(): void {
    if (this.detalleIngreso.porcentajeDescuento > 0) {
      let descuento: number = (this.detalleIngreso.porcentajeDescuento / 100) * this.detalleIngreso.precioVentaAnterior;
      descuento = Math.round(descuento * 100) / 100;

      let pv: number = this.detalleIngreso.precioVentaAnterior - descuento;
      this.detalleIngreso.precioVenta = Math.round(pv * 100) / 100;
    }
    else {
      this.detalleIngreso.precioVenta = this.detalleIngreso.precioVentaAnterior;
    }
  }

  //variedad
  isValidVariedad(variedad: Variedad): boolean {
    if (variedad.nombreTalla == null || variedad.nombreTalla.trim() == "") {
      return false;
    }

    if (variedad.cantidadTalla < 1) {
      return false;
    }

    if (variedad.colores.length == 0) {
      return false;
    }

    return true;
  }

  editarVariedad(va: Variedad): void {
    this.variedad = new Variedad();
    this.variedad.colores = [];
    this.variedad.idvariedad = va.idvariedad;
    this.variedad.nombreTalla = va.nombreTalla;
    this.variedad.cantidadTalla = va.cantidadTalla;
    va.colores.forEach(co => this.variedad.colores.push(co));
  }

  generateNewVariedad(variedad: Variedad): Variedad {
    let va = new Variedad();
    va.idvariedad = variedad.idvariedad;
    va.nombreTalla = variedad.nombreTalla;
    va.cantidadTalla = variedad.cantidadTalla;
    va.pvestimentaId = variedad.pvestimentaId;
    variedad.colores.forEach(co => va.colores.push(co));
    return va;
  }

  addVariedad(): void {
    if (this.isValidVariedad(this.variedad)) {
      const indice = this.detalleIngreso.variedades.find(va => va.nombreTalla == this.variedad.nombreTalla);
      if (indice == undefined || indice == null) {

        this.detalleIngreso.variedades.push(this.generateNewVariedad(this.variedad));

      }
      else {
        this.detalleIngreso.variedades.forEach(va => {
          if (va.nombreTalla == this.variedad.nombreTalla) {
            va.cantidadTalla = this.variedad.cantidadTalla;
            this.variedad.colores.forEach(co => va.colores.push(co));
            //va.colores = this.variedad.colores;
          }
        });
      }

      this.variedad = new Variedad();
      this.variedad.cantidadTalla = 0;
      this.variedad.colores = [];
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Asegurece de haber ingresado nombre de talla y colores'
      });
    }
  }

  eliminarVariedad(va: Variedad): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea eliminar ??',
      text: 'Está intentando eliminar, confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.detalleIngreso.variedades = this.detalleIngreso.variedades.filter(v => v.nombreTalla != va.nombreTalla);
      }
    });
  }

  isValidColor(color: Color): boolean {

    if (color.nombreImagen == null || color.nombreImagen == "") {
      return false;
    }

    if (color.nombreColor == null || color.nombreColor.trim() == "") {
      return false;
    }

    if (color.cantidadColor < 1) {
      return false;
    }

    return true;
  }

  generateNewColor(color: Color): Color {
    let col = new Color();
    col.idcolor = color.idcolor;
    col.nombreColor = color.nombreColor;
    col.cantidadColor = color.cantidadColor;
    col.nombreImagen = color.nombreImagen;
    col.variedadId = color.variedadId;
    return col;
  }

  addColor(): void {
    if (this.isValidColor(this.color)) {
      const exist_color = this.variedad.colores.find(co => co.nombreColor == this.color.nombreColor);
      if (exist_color == undefined || exist_color == null) {

        this.variedad.colores.push(this.generateNewColor(this.color));
      }
      else {
        this.variedad.colores.forEach(co => {
          if (co.nombreColor == this.color.nombreColor) {
            co.nombreImagen = this.color.nombreImagen;
            co.cantidadColor = this.color.cantidadColor;
          }
        });
      }

      let cantidad: number = 0;
      this.variedad.colores.forEach(co => cantidad += co.cantidadColor);
      this.variedad.cantidadTalla = cantidad;
      this.color = new Color();
      this.color.cantidadColor = 1;
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Ingrese los campos solicitados primero(imagen, nombre color, cantidad)'
      });
    }
  }

  eliminarColor(color: Color): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea quitar color ??',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(resp => {
      if (resp.value) {
        this.variedad.colores = this.variedad.colores.filter(co => co.nombreColor != color.nombreColor);
      }
    });
  }

  eliminarColorEnVariedad(color: Color, va: Variedad): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea quitar color ??',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(resp => {
      if (resp.value) {
        this.detalleIngreso.variedades.forEach(v => {
          if (v.nombreTalla == va.nombreTalla) {
            v.colores = v.colores.filter(co => co.nombreColor != color.nombreColor);
          }
        });

        this.detalleIngreso.variedades.forEach(vari => {
          let cantidad: number = 0;
          vari.colores.forEach(co => cantidad += co.cantidadColor);
          vari.cantidadTalla = cantidad;
        });         
      }
    });
  }

  editarColor(color: Color): void {
    this.color.idcolor = color.idcolor;
    this.color.nombreColor = color.nombreColor;
    this.color.cantidadColor = color.cantidadColor;
    this.color.variedadId = color.variedadId;
  }

}
