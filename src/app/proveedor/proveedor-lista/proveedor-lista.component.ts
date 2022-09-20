import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/modelo/proveedor/proveedor';
import { LoginService } from 'src/app/servicio/login/login.service';
import { ProveedorService } from 'src/app/servicio/proveedor/proveedor.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor-lista',
  templateUrl: './proveedor-lista.component.html',
  styleUrls: ['./proveedor-lista.component.css']
})
export class ProveedorListaComponent implements OnInit {

  bproveedores:Proveedor[] = [];
  errMessageSearch!:string;
  texto:string = "";
  paginatorList:any = {};

  proveedores:Proveedor[] = [];
  errMessageList!:string;
  
  url_backend = environment.urlBackend+"/mostrar/pro/imagen";

  constructor(private proService:ProveedorService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listar(0);

    this.proService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page:number) : void {
    this.proService.listProveedores(page).subscribe(resp => {
      this.proveedores = resp.content;
      this.paginatorList = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }  

  buscar() : void {
    if(this.texto.length > 0){
      this.bproveedores.length = 0;
      const texto = this.texto.split(" ").join("");     
      this.proService.searchProveedores(texto).subscribe(resp => {
        this.bproveedores = resp;
        this.errMessageSearch = "";
      }, err => {
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Ingrese texto para empezar la busqueda'
      });
    }
  }

  limpiar() : void {
    this.bproveedores.length = 0;
    this.errMessageSearch = "";
  }

  suspender(pro:Proveedor) : void {
    Swal.fire({
      icon:'question',
      title:'Esta seguro que desea suspender',
      text:'Esta intentando suspender por favor confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, suspender',
      cancelButtonText:'No, suspender'
    }).then(resp => {
      if(resp.value){
        pro.estado = "Suspendido";
        this.proService.suspenderProveedor(pro).subscribe(response => {
          Swal.fire({
            icon:'success',
            text:response.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible suspender al proveedor, intentelo mas tarde'
          });
        });
      }
    });
  }

  activar(pro:Proveedor) : void {
    Swal.fire({
      icon:'question',
      title:'Esta seguro que desea activar ?',
      text:'Esta intentando activar por favor confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(resp => {
      if(resp.value){
        pro.estado = "Activo";
        this.proService.suspenderProveedor(pro).subscribe(response => {
          Swal.fire({
            icon:'success',
            text:response.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible activar estado del proveedor, intentelo mas tarde'
          });
        });
      }
    });
  }

}
