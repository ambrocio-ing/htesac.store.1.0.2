import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/modelo/producto/producto';
import { ProductoImagen } from 'src/app/modelo/producto/producto-imagen';
import { LoginService } from 'src/app/servicio/login/login.service';
import { ProductoService } from 'src/app/servicio/producto/producto.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  url_backend = environment.urlBackend+"/mostrar/pto/imagen";
  productos:Producto[] = [];
  bproductos:Producto[] = [];

  errMessageList!:string;
  errMessageSearch!:string;

  texto:string = "";
  preloader:boolean = false;

  paginator:any = {};
  tipo:string = "producto";

  //modal imagenes
  visibleImg:boolean = false;
  pimagenes:ProductoImagen[]=[];

  constructor(private productoService:ProductoService, 
    private router:Router, public loginService:LoginService) { 

  }

  ngOnInit(): void {
    this.listar(0);

    this.productoService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page:number) : void {
    this.productoService.listProductos(page).subscribe(resp => {
      this.productos = resp.content;
      this.paginator = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  buscar() : void {
    if(this.texto.length != 0){
      this.preloader = true;
      this.bproductos.length = 0;
      this.productoService.searchProductos(this.texto).subscribe(datos => {
        this.preloader =false;
        this.bproductos = datos;
        this.errMessageSearch = "";
      }, err => {
        this.preloader =false;
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Ingrese texto para empezar con la busqueda'
      });
    }
  }

  limpiar() : void {
    this.bproductos.length = 0;
  }  

  eliminar(producto:Producto) : void {    
    Swal.fire({
      icon:'question',
      title:'Seguro que desea eliminar',
      text:'Esta intentando eliminar registro, confirme acción',
      showCancelButton:true,
      confirmButtonText:'Si, eliminar',
      cancelButtonText:'No, eliminar'
    }).then(resp => {
      if(resp.value){
        this.preloader = true;
        this.productoService.deleteProducto(producto.idproducto).subscribe(response => {
          this.preloader = false;
          Swal.fire({
            icon:'success',
            text:response.mensaje
          });
        }, err => {
          this.preloader = false;
          Swal.fire({
            icon:'error',
            text:'No fue posible eliminar registro'
          });
        });
      }
    });
  }

  verImagenes(producto:Producto): void {
    this.pimagenes = producto.productoImagenes;
    this.visibleImg = true;
  }

}
