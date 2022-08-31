import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Producto } from 'src/app/modelo/producto/producto';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seleccion-producto',
  templateUrl: './seleccion-producto.component.html',
  styleUrls: ['./seleccion-producto.component.css']
})
export class SeleccionProductoComponent implements OnInit {

  @Input() isVisibleModal!: boolean;
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter();

  url_backend = environment.urlBackend + "/mostrar/pto/imagen";
  productos: Producto[] = [];
  bproductos: Producto[] = [];

  errMessageList!: string;
  errMessageSearch!: string;

  texto: string = "";
  paginator: any = {};

  tipo:string = "producto";

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.listar(0);

    this.productoService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page: number): void {
    this.productoService.listProductosModal(page).subscribe(resp => {
      this.productos = resp.content;
      this.paginator = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  buscar(): void {
    if (this.texto.length != 0) {
      this.bproductos.length = 0;
      this.productoService.searchProductos(this.texto).subscribe(datos => {
        this.bproductos = datos;
        this.errMessageSearch = "";
      }, err => {
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Ingrese texto para empezar con la busqueda'
      });
    }
  }

  limpiar(): void {
    this.bproductos.length = 0;
  }

  seleccionar(producto: Producto): void {
    this.productoService.cbProducto.emit(producto);
    this.cerrarModal.emit(false);
  }

  closeModal(): void {
    this.cerrarModal.emit(false);
  }

}
