import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/modelo/producto/producto';
import { LoginService } from 'src/app/servicio/login/login.service';
import Swal from 'sweetalert2';
import { DetalleIngreso } from '../../../modelo/detalle-ingreso/detalleingreso';
import { IngresoService } from '../../../servicio/ingreso/ingreso.service';

@Component({
  selector: 'app-lista-ingreso',
  templateUrl: './lista-ingreso.component.html',
  styleUrls: ['./lista-ingreso.component.css']
})
export class ListaIngresoComponent implements OnInit {

  detalleIngresos:DetalleIngreso[] = [];
  errMessageList!:string;

  bdetalleIngresos:DetalleIngreso[] = [];
  errMessageSearch!:string;

  paginator:any = {};
  tipo:string = "ingreso";

  texto:string = "";

  productoSeleccionado:Producto = new Producto();
  visibleModal:boolean = false;

  constructor(private ingresoService:IngresoService, public loginService:LoginService) { 

  }

  ngOnInit(): void {

    this.listar(0);

    this.ingresoService.cbIngreso.subscribe(resp => {
      this.listar(resp);
    });

  }

  listar(page:number) : void {
    this.ingresoService.listDI(page).subscribe(resp => {
      this.detalleIngresos = resp.content;
      this.paginator = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  buscar() {
    if(this.texto.length > 0){
      this.bdetalleIngresos.length = 0;
      const texto = this.texto.split(" ").join("");
      this.ingresoService.searchDIByProducto(texto).subscribe(resp => {
        this.bdetalleIngresos = resp;
        this.errMessageSearch = "";
      }, err => {
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Primero ingrese nombre o código del producto a buscar'
      });
    }
  }

  limpiar() : void {
    this.bdetalleIngresos.length = 0;
    this.errMessageSearch = "";
  }

  vermas(di:DetalleIngreso): void {
    this.visibleModal = true;
    this.productoSeleccionado = di.producto;    
  }

}
