import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Cliente } from '../modelo/cliente/cliente';
import { ClienteService } from '../servicio/cliente/cliente.service';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  url:string = environment.urlBackend+"/mostrar/cli/imagen"

  bclientes:Cliente[] = [];
  errMessageSearch!:string;
  texto:string = "";
  
  clientes:Cliente[] = [];
  errMessageList!:string;
  paginatorList:any = {};

  clienteSelect!:Cliente;
  visibleModal:boolean = true;

  constructor(private clienteService:ClienteService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listAll(0);

    this.clienteService.cbPaginar.subscribe(page => {
      this.listAll(page);
    });
    
  }

  listAll(page:number) : void {
    this.clienteService.listClientes(page).subscribe(resp => {
      this.clientes = resp.content;
      this.paginatorList = resp;
      this.errMessageList = "";
    }, err => {
      this.errMessageList = "Sin datos que mostrar";
    });
  }

  searchClientes() : void {
    if(this.texto != null){
      this.bclientes.length = 0;
      const texto = this.texto.split(" ").join("");
      this.clienteService.searchClientes(texto).subscribe(resp => {
        this.bclientes = resp;
        this.errMessageSearch = "";
      }, err => {
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos imcompletos',
        text:'Ingreso texto para empezar la búsqueda'
      });
    }
  }

  limpiar() : void {
    this.bclientes.length = 0;
  }

  ver(cli:Cliente) : void {
    this.visibleModal = true;
    this.clienteSelect = cli;
  }

  suspender(cli:Cliente) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea suspender??',
      text:'Esta intentando suspender un cliente, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, suspender',
      cancelButtonText:'No, suspender'
    }).then(res => {
      if(res.value){
        cli.estado = "Suspendido";
        this.clienteService.suspenderCliente(cli).subscribe(resp => {
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible suspender al cliente, intentelo mas tarder'
          });
        });
      }
    });
  }

  activar(cli:Cliente) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea volver a activar ?',
      text:'Esta intentando activar un cliente, confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si, suspender',
      cancelButtonText:'No, suspender'
    }).then(res => {
      if(res.value){
        cli.estado = "Activo";
        this.clienteService.suspenderCliente(cli).subscribe(resp => {
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'error',
            text:'No fue posible activar estado del cliente, intentelo mas tarder'
          });
        });
      }
    });
  }

}
