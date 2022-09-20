import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleIngreso } from 'src/app/modelo/detalle-ingreso/detalleingreso';
import { Ingreso } from 'src/app/modelo/ingreso/ingreso';
import { Persona } from 'src/app/modelo/persona/persona';
import { Personal } from 'src/app/modelo/personal/personal';
import { Color } from 'src/app/modelo/producto/color';
import { Producto } from 'src/app/modelo/producto/producto';
import { Variedad } from 'src/app/modelo/producto/variedad';
import { IngresoService } from 'src/app/servicio/ingreso/ingreso.service';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-ingreso',
  templateUrl: './editar-ingreso.component.html',
  styleUrls: ['./editar-ingreso.component.css']
})
export class EditarIngresoComponent implements OnInit {

  url_img:string = environment.urlBackend + "/mostrar/pto/imagen";

  visibleModal: boolean = false;
  fechahoy = new Date(Date.now());
  preloader: boolean = false;

  ingreso: Ingreso = new Ingreso();

  detalleIngreso: DetalleIngreso = new DetalleIngreso();

  //variedades
  variedad: Variedad = new Variedad();
  color:Color = new Color();

  mproducto:Producto = new Producto();
  verMasVisible:boolean = false;

  constructor(private productoService: ProductoService,
    private ingresoService: IngresoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    this.ingreso.personal = new Personal();
    this.ingreso.personal.persona = new Persona();

    this.detalleIngreso.producto = new Producto();
    
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.ingresoService.getIngreso(+id).subscribe(resp => {
          this.ingreso = resp;
        }, err => {
          Swal.fire({
            icon: 'info',
            title: 'Datos no recuperados',
            text: 'No fue posible recuperar registro, intentelo mas tarde'
          }).then(res => {
            this.router.navigate(['ingre-lista']);
          });
        });
      }
    });

    this.productoService.cbProducto.subscribe(resp => {
      this.detalleIngreso.producto = resp;
    });
  }

  selectProducto(): void {
    this.visibleModal = true;
  }

  isValidDetalleIngreso(): string[] {
    let mensajes: string[] = [];
    if (!this.detalleIngreso?.precioCompra) {
      mensajes.push("Precio de compra es obligatorio");
    }

    if (!this.detalleIngreso?.precioVenta) {
      mensajes.push("Precio de venta es obligatorio");
    }

    if (this.detalleIngreso.stockInicial == null) {
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

  agregarDI(): void {    
    if (this.isValidDetalleIngreso().length == 0) {
      const element = this.ingreso.detalleIngresos.find(di => di.iddetalleingreso == this.detalleIngreso.iddetalleingreso);
      if (element != undefined && element != null) {
        this.ingreso.detalleIngresos.forEach(di => {
          if(di.iddetalleingreso == this.detalleIngreso.iddetalleingreso){
            di.fechaProduccion = this.detalleIngreso.fechaProduccion;
            di.fechaVencimiento = this.detalleIngreso.fechaVencimiento;
            di.porcentajeDescuento = this.detalleIngreso.porcentajeDescuento;
            di.precioCompra = this.detalleIngreso.precioCompra;
            di.precioVenta = this.detalleIngreso.precioVenta;
            di.precioVentaAnterior = this.detalleIngreso.precioVentaAnterior;
            di.stockActual = this.detalleIngreso.stockActual;
            di.stockInicial = this.detalleIngreso.stockInicial;
            di.estado = this.detalleIngreso.estado;
            di.ventaPorGramo = this.detalleIngreso.ventaPorGramo;
            
            if(di.producto.productoVestimenta != null){
              di.variedades = this.detalleIngreso.variedades
            }

          }
        });

        this.detalleIngreso = new DetalleIngreso();
        this.detalleIngreso.producto = new Producto();
      }
      else {
        Swal.fire({
          icon: 'info',
          title: 'Acción no reconocido',
          text: 'No se encontro coincidencias en el lista de ingresos'
        });
      }
    }
    else {
      const mensajes: string = this.isValidDetalleIngreso().join(", ");
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: mensajes
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
      title: 'Seguro que desea eliminar?',
      text: 'Está intentando eliminar, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, eliminar'
    }).then(res => {
      if (res.value) {
        this.preloader = true;
        if (di.iddetalleingreso != null && di.iddetalleingreso > 0) {
          this.ingresoService.deleteDI(di.iddetalleingreso).subscribe(resp => {
            this.preloader = false;
            let dis = this.ingreso.detalleIngresos.filter(item => item.iddetalleingreso != di.iddetalleingreso);
            this.ingreso.detalleIngresos = dis;
          }, err => {
            this.preloader = false;
            Swal.fire({
              icon: 'error',
              text: 'No fue posible eliminar detalle del sistema'
            });
          });
        }
        else {
          let dis = this.ingreso.detalleIngresos.filter(item => item.producto.idproducto != di.producto.idproducto);
          this.ingreso.detalleIngresos = dis;
          this.preloader = false;
        }
      }
    });

  }

  verMas(di:DetalleIngreso): void {
    this.mproducto = di.producto;
    this.verMasVisible = true;
  }

  updateIngreso(): void {
    this.preloader = true;
    if (this.ingreso.idingreso > 0 && this.ingreso.detalleIngresos.length > 0) {
      this.ingresoService.updateIngreso(this.ingreso).subscribe(resp => {
        this.preloader = false;
        this.cancelar();
        Swal.fire({
          icon: 'success',
          title: 'Operación exitosa',
          text: resp.mensaje
        }).then(res => {
          this.router.navigate(['ingre-lista']);
        });
      }, err => {
        this.preloader = false;
        if (err.status == 400 || err.status == 500 || err.status == 404) {
          Swal.fire({
            icon: 'error',
            title: 'Operación fallida',
            text: err.mensaje
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
        title: 'Acción no identificada',
        text: 'No fue posible validar la accion como un proceso de edición'
      });
    }
  }

  cancelar(): void {
    this.ingreso = new Ingreso();
    this.ingreso.personal = new Personal();
    this.router.navigate(['ingre-lista']);
  }

  eliminar(): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea eliminar?',
      text: 'Está intentando eliminar, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, eliminar'
    }).then(res => {
      if (res.value) {
        this.preloader = true;
        if (this.ingreso.idingreso > 0) {
          this.ingresoService.deleteIngreso(this.ingreso.idingreso).subscribe(resp => {
            this.preloader = false;
            Swal.fire({
              icon: 'success',
              text: resp.mensaje
            }).then(response => {
              this.router.navigate(['ingre-lista']);
            });
          }, err => {
            this.preloader = false;
            if (err.status == 500) {
              Swal.fire({
                icon: 'error',
                text: err.error.mensaje
              });
            }
            else {
              Swal.fire({
                icon: 'error',
                text: 'No fue posible eliminar el ingreso, intentelo mas tarde'
              });
            }

          });
        }
        else {
          this.preloader = false;
          Swal.fire({
            icon: 'info',
            text: 'No fue posible eliminar el ingreso, refresque e intentelo denuevo'
          });
        }
      }
    });
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

  obtenerDI(di: DetalleIngreso): void {
    this.detalleIngreso.iddetalleingreso = di.iddetalleingreso;
    this.detalleIngreso.estado = di.estado;
    this.detalleIngreso.ventaPorGramo = di.ventaPorGramo;
    this.detalleIngreso.fechaProduccion = di.fechaProduccion;
    this.detalleIngreso.fechaVencimiento = di.fechaVencimiento;
    this.detalleIngreso.ingresoId = di.ingresoId;
    this.detalleIngreso.porcentajeDescuento = di.porcentajeDescuento;
    this.detalleIngreso.precioCompra = di.precioCompra;
    this.detalleIngreso.precioVenta = di.precioVenta;
    this.detalleIngreso.precioVentaAnterior = di.precioVentaAnterior;
    this.detalleIngreso.producto = di.producto;
    this.detalleIngreso.stockActual = di.stockActual;
    this.detalleIngreso.stockInicial = di.stockInicial;
    this.detalleIngreso.sucursal = di.sucursal;

    if(di.producto.productoVestimenta != null){
      di.variedades.forEach(va => this.detalleIngreso.variedades.push(va));
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
    this.variedad.idvariedad = va.idvariedad;
    this.variedad.nombreTalla = va.nombreTalla;
    this.variedad.cantidadTalla = va.cantidadTalla;
    va.colores.forEach(co => this.variedad.colores.push(co));
  }

  generateNewVariedad(variedad:Variedad) : Variedad{
    let va = new Variedad();
    va.idvariedad = variedad.idvariedad;
    va.nombreTalla = variedad.nombreTalla;
    va.cantidadTalla = variedad.cantidadTalla;
    va.pvestimentaId = variedad.pvestimentaId;
    variedad.colores.forEach(co => va.colores.push(co));
    return va;
  }

  addVariedad(): void {
    if (this.isValidVariedad(this.variedad) && this.variedad.idvariedad == null) {
      const indice = this.detalleIngreso.variedades.find(va => va.nombreTalla == this.variedad.nombreTalla);
      if (indice == undefined || indice == null) {
        
        this.detalleIngreso.variedades.push(this.generateNewVariedad(this.variedad));
        this.variedad = new Variedad();
        this.variedad.cantidadTalla = 0;
        this.variedad.colores = [];
        
      }
      else {
        this.detalleIngreso.variedades.forEach(va => {
          if (va.nombreTalla == this.variedad.nombreTalla) {
            va.cantidadTalla = this.variedad.cantidadTalla;
            va.colores = this.variedad.colores;
          }
        });

        this.variedad = new Variedad();
        this.variedad.cantidadTalla = 0;
        this.variedad.colores = [];
      }
    }
    else if (this.isValidVariedad(this.variedad) && this.variedad.idvariedad > 0) {
      this.detalleIngreso.variedades.forEach(va => {
        if (va.idvariedad == this.variedad.idvariedad) {
          va.cantidadTalla = this.variedad.cantidadTalla;
          va.colores = this.variedad.colores;
        }
      });

      this.variedad = new Variedad();
      this.variedad.cantidadTalla = 0;
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

    if(color.nombreImagen == null || color.nombreImagen == ""){
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

  generateNewColor(color:Color): Color {
    let col = new Color();
    col.idcolor = color.idcolor;
    col.nombreColor = color.nombreColor;
    col.cantidadColor = color.cantidadColor;
    col.nombreImagen = color.nombreImagen;
    col.variedadId = color.variedadId;
    return col;
  }

  addColor(): void {
    if (this.isValidColor(this.color) && this.color.idcolor == null) {
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
    else if (this.isValidColor(this.color) && this.color.idcolor > 0) {
      this.variedad.colores.forEach(co => {
        if (co.idcolor == this.color.idcolor) {
          co.nombreColor = this.color.nombreColor;
          co.nombreImagen = this.color.nombreImagen;
          co.cantidadColor = this.color.cantidadColor;
        }
      });

      let cantidad: number = 0;
      this.variedad.colores.forEach(co => cantidad += co.cantidadColor);
      this.variedad.cantidadTalla = cantidad;
      this.color = new Color();
      this.color.cantidadColor = 1;
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Ingrese los campos solicitados primero(imagen, nombre color y cantidad)'
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

  activarVentaPorGramo(event:any): void {
   
    
    const estado:boolean = event.target.checked;
    if(estado){
      this.detalleIngreso.ventaPorGramo = true;
    }
    else{
      this.detalleIngreso.ventaPorGramo = false;
    }

    
    
  }

  stockCero(event:any): void {

    const estado = event.target.checked;
    if(!estado){      
      this.detalleIngreso.estado = true;
      this.ingreso.detalleIngresos.forEach(di => {
        if(di.iddetalleingreso == this.detalleIngreso.iddetalleingreso){
          this.detalleIngreso.stockActual = di.stockActual;
          this.detalleIngreso.stockInicial = di.stockInicial;
        }
      });
    }
    else{
      Swal.fire({
        icon:'question',
        text:'Seguro que desea poner stocks en cero y estado del ingreso en falso?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(res => {
        if(res.value){
          this.detalleIngreso.stockActual = 0;
          this.detalleIngreso.stockInicial = 0;
          this.detalleIngreso.estado = false;
        }
        else{
          event.target.checked = false;
        }
      });
    }
    
  }

}
