import { Component, OnInit } from '@angular/core';
import { Comprobante } from 'src/app/modelo/comprobante/comprobante';
import { DetallePago } from 'src/app/modelo/comprobante/detalle-pago';
import { DireccionEnvio } from 'src/app/modelo/direcion-envio/direccion-envio';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda-ventas',
  templateUrl: './busqueda-ventas.component.html',
  styleUrls: ['./busqueda-ventas.component.css']
})
export class BusquedaVentasComponent implements OnInit {

  titulo:string = "BUSQUEDA GENERAL DE VENTAS";
  tipo!:string;

  comprobantes:Comprobante[] = [];
  errMessageComs!:string;
  url_backend:string = environment.urlBackend+"/mostrar/pto/imagen";
  opcion:string = "";  

  numero:string = "";
  docOrNombre:string = "";

  direccionEnvio:DireccionEnvio = new DireccionEnvio();
  isVisibleModal:boolean = false;

  isVisibleDetallePagob:boolean = false;
  detallePagob!:DetallePago;

  preloader:boolean = false;

  constructor(private comService:ComprobanteService) { }

  ngOnInit(): void {

  }  

  verTodo(de:DireccionEnvio) : void {
    this.direccionEnvio = de;
    this.isVisibleModal = true;
  }

  buscarNumero() : void {
    if(this.numero != null && this.numero != ""){
      this.comprobantes.length = 0;
      const num:string = this.numero.replace(" ", "");
      this.comService.buscarComsPorNumero(num).subscribe(resp => {
        this.comprobantes = resp;
        this.errMessageComs = "";
      }, err => {
        this.errMessageComs = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        text:'Ingreso texto a buscar'
      });
    }
  }

  buscarDocOrNombre() : void {
    if(this.docOrNombre != null && this.docOrNombre != ""){
      this.comprobantes.length = 0;
      const doc:string[] =  this.docOrNombre.split(" ");
      this.comService.buscarComsPorDocOrNombre(doc.join("")).subscribe(resp => {
        this.comprobantes = resp;
        this.errMessageComs = "";
      }, err => {
        this.errMessageComs = "Sin datos que mostrar";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        text:'Ingreso texto a buscar'
      });
    }
  }

  verDetallePago(com:Comprobante): void {
    this.detallePagob = com.detallePago;
    this.isVisibleDetallePagob = true;
  }

  marcarPendiente(com:Comprobante): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado a pendiente???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.preloader = true;       
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;        
        comm.estado = "Entrega pendiente";      
        comm.tipoComprobante = com.tipoComprobante;
        comm.idtransaccion = com.idtransaccion;

        this.comService.editarComprobante(comm).subscribe(resp => {
          this.preloader = false;          
          Swal.fire({
            icon: 'success',
            text: 'Estado de la venta combiado con éxito'
          });
        }, err => {
          this.preloader = false;          
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado, intentelo mas tarde'
          });
        });
      }
    });
  }

  marcarAnulado(com:Comprobante): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea anular comprobante???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      this.preloader = true;   
      const comm = new Comprobante();
      comm.idcomprobante = com.idcomprobante;
      comm.estado = "Anulado";
  
      this.comService.anularComprobante(comm).subscribe(resp => {
        this.preloader = false;
        Swal.fire({
          icon: 'success',
          text: resp.mensaje
        });
      }, err => {
        this.preloader = false;      
        Swal.fire({
          icon: 'error',
          text: 'No fue posible anular estado, intentelo mas tarde'
        });
      });
    });    
  }

  marcarEntregado(com:Comprobante): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado a entregado???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.preloader = true;       
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;        
        comm.estado = "Entregado";      
        comm.tipoComprobante = com.tipoComprobante;
        comm.idtransaccion = com.idtransaccion;

        this.comService.editarComprobante(comm).subscribe(resp => {
          this.preloader = false;          
          Swal.fire({
            icon: 'success',
            text: 'Estado de la venta combiado con éxito'
          });
        }, err => {
          this.preloader = false;          
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado, intentelo mas tarde'
          });
        });
      }
    });
  }

}
