import { Component, OnInit } from '@angular/core';
import { ProveedorComprobante } from 'src/app/modelo/proveedor/proveedor-comprobante';
import { LoginService } from 'src/app/servicio/login/login.service';
import { ProveedorOfertaService } from 'src/app/servicio/proveedor/proveedor-oferta.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { ProveedorOferta } from '../../../modelo/proveedor/proveedor-oferta';

@Component({
  selector: 'app-oferta-proveedor',
  templateUrl: './oferta-proveedor.component.html',
  styleUrls: ['./oferta-proveedor.component.css']
})
export class OfertaProveedorComponent implements OnInit {

  url_backend = environment.urlBackend+"/mostrar/pro-oferta/imagen"

  pcsearchs:ProveedorComprobante[] = [];
  errMessgeSeardch!:string; 

  pcpendientes:ProveedorComprobante[] = [];
  errMessagePendiente!:string;
  paginatorPendiente:any = {};

  pcaceptados:ProveedorComprobante[] = [];
  errMessageAceptado!:string;
  paginatorAceptado:any = {};

  pcrechazados:ProveedorComprobante[] = [];
  errMessageRechazado!:string;
  paginatorRechazado:any = {};

  finicio!:string;
  ffin!:string;
  tipo:string = "proveedor";

  constructor(private poService:ProveedorOfertaService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listarPendientes(0);
    this.listarAceptados(0);
    this.listarRechazados(0);

    this.poService.cbPendiente.subscribe(page => {
      this.listarPendientes(page);
    });

    this.poService.cbAceptado.subscribe(page => {
      this.listarAceptados(page);
    });

    this.poService.cbRechazado.subscribe(page => {
      this.listarRechazados(page);
    });

  }

  listarPendientes(page:number) : void {
    this.poService.listPendientes(page).subscribe(resp => {
      this.pcpendientes = resp.content;
      this.paginatorPendiente = resp;
      this.errMessagePendiente = "";
    }, err => {
      this.errMessagePendiente = "Sin datos que mostrar";
    });
  }

  listarAceptados(page:number) : void {
    this.poService.listAceptado(page).subscribe(resp => {
      this.pcaceptados = resp.content;
      this.paginatorAceptado = resp;
      this.errMessageAceptado = "";
    }, err => {
      this.errMessageAceptado = "Sin datos que mostrar";
    });
  }

  listarRechazados(page:number) : void {
    this.poService.listRechazado(page).subscribe(resp => {
      this.pcrechazados = resp.content;
      this.paginatorRechazado = resp;
      this.errMessageRechazado = "";
    }, err => {
      this.errMessageRechazado = "Sin datos que mostrar";
    });
  }  

  buscar() : void {
    if(this.finicio != null && this.ffin != null){
      this.pcsearchs.length = 0;
      this.poService.searchProveedorComprobante(this.finicio, this.ffin).subscribe(resp => {
        this.pcsearchs = resp;
        this.errMessgeSeardch = "";
      }, err => {
        this.errMessgeSeardch = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        title:'Datos incompletos',
        text:'Ingrese las dos fechas necesarias para empezar la busqueda'
      });
    }
    
  }

  marcarAceptado(pc:ProveedorComprobante): void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea aceptar?',
      text:'Está intentando aceptar, por favor confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {      
      if(res.value){
        pc.estado = "Aceptado";
        this.poService.updatePC(pc).subscribe(resp => {
          this.ngOnInit();
          
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'success',
            text:'No fue posible actualizar estado, inténtelo mas tarde'
          });
        });
      }
    });
  }

  marcarRechazado(pc:ProveedorComprobante) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea rechazar?',
      text:'Está intentando rechazar, por favor confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {      
      if(res.value){
        pc.estado = "Rechazado";
        this.poService.updatePC(pc).subscribe(resp => {
          this.ngOnInit();
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'success',
            text:'No fue posible actualizar estado, inténtelo mas tarde'
          });
        });
      }
    });
  }  

  marcarPendiente(pc:ProveedorComprobante) : void {
    Swal.fire({
      icon:'question',
      title:'Seguro que desea pendiente?',
      text:'Está intentando poner el estado en pendiente, por favor confirme la acción',
      showCancelButton:true,
      confirmButtonText:'Si',
      cancelButtonText:'No'
    }).then(res => {      
      if(res.value){
        pc.estado = "Pendiente";
        this.poService.updatePC(pc).subscribe(resp => {
          this.ngOnInit();
          Swal.fire({
            icon:'success',
            text:resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon:'success',
            text:'No fue posible actualizar estado, inténtelo mas tarde'
          });
        });
      }
    });
  }   

  limpiar() : void {
    this.pcsearchs.length = 0;
    this.errMessgeSeardch = "";
  }

}
