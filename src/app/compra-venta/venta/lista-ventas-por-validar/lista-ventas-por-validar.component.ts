import { Component, OnInit } from '@angular/core';
import { Comprobante } from 'src/app/modelo/comprobante/comprobante';
import { DetallePago } from 'src/app/modelo/comprobante/detalle-pago';
import { DireccionEnvio } from 'src/app/modelo/direcion-envio/direccion-envio';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import { LoginService } from 'src/app/servicio/login/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-ventas-por-validar',
  templateUrl: './lista-ventas-por-validar.component.html',
  styleUrls: ['./lista-ventas-por-validar.component.css']
})
export class ListaVentasPorValidarComponent implements OnInit {

  titulo: string = "LISTA DE VENTAS POR ENTREGAR";
  tipo: string = "pedidos";
  url_backend: string = environment.urlBackend + "/mostrar/pto/imagen";
  url_backend_com: string = environment.urlBackend + "/mostrar/comprobante/imagen";

  fecha!: string;
  bus_comprobantes: Comprobante[] = [];
  errMessageBusqueda!: string;

  direccionEnvio: DireccionEnvio = new DireccionEnvio();
  isVisibleModal: boolean = false;  

  isVisibleDetallePagol: boolean = false;
  detallePagol!: DetallePago;

  comprobantes: Comprobante[] = [];
  errMessageComs!: string;
  paginator:any = {};

  constructor(private comService: ComprobanteService, public loginService: LoginService) { }

  ngOnInit(): void {

    this.listarPedidos(0);

    this.comService.cbPaginator.subscribe(page => {
      this.listarPedidos(page);
    });
    
  }

  listarPedidos(page: number): void {
    this.comService.listarPedidos(page).subscribe(resp => {
      this.comprobantes = resp.content;
      this.paginator = resp;
      this.errMessageComs = "";
    }, err => {
      this.errMessageComs = "Sin datos que mostrar";
    });
  }

  buscar(): void {
    if (this.fecha != null) {
      this.comprobantes.length = 0;
      this.comService.buscarPedidosPorFechaValidar(this.fecha).subscribe(resp => {
        this.bus_comprobantes = resp;
        this.errMessageBusqueda = "";
      }, err => {
        this.errMessageBusqueda = "Sin datos que mostrar";
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Ingrese una fecha para empezar'
      });
    }
  }

  limpiar(): void {
    this.bus_comprobantes.length = 0;
  }

  verTodo(de: DireccionEnvio): void {
    this.direccionEnvio = de;
    this.isVisibleModal = true;
  }

  changeStatusValido(com: Comprobante): void {

    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado a ENTREGA PENDIENTE???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
       
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;
        comm.estado = "Entregada Pendiente";
        comm.tipoComprobante = com.tipoComprobante;
        comm.idtransaccion = com.idtransaccion;

        this.comService.editarComprobante(comm).subscribe(resp => {
         
          this.comprobantes = this.comprobantes.filter(co => co.idcomprobante != com.idcomprobante);
          Swal.fire({
            icon: 'success',
            text: 'Estado de la venta combiado con éxito'
          });
        }, err => {
          
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado, intentelo mas tarde'
          });
        });
      }
    });

  }

  changeStatusRechazado(com: Comprobante): void {

    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado a rechazado, debes tener en cuenta que el stock será restablecido?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
       
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;
        comm.estado = "Rechazado";

        this.comService.anularComprobante(comm).subscribe(resp => {
          this.comprobantes = this.comprobantes.filter(co => co.idcomprobante != com.idcomprobante);
          
          Swal.fire({
            icon: 'success',
            text: resp.mensaje
          });
        }, err => {
          
          Swal.fire({
            icon: 'error',
            text: 'No fue posible anular estado, intentelo mas tarde'
          });
        });
      }
    });

  }

  verDetallePago(com: Comprobante): void {
    this.detallePagol = com.detallePago;
    this.isVisibleDetallePagol = true;
  }

}
