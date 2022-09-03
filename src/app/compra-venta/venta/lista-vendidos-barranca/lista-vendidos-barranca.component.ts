import { Component, OnInit } from '@angular/core';
import { Comprobante } from 'src/app/modelo/comprobante/comprobante';
import { DetallePago } from 'src/app/modelo/comprobante/detalle-pago';
import { DireccionEnvio } from 'src/app/modelo/direcion-envio/direccion-envio';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import { LoginService } from 'src/app/servicio/login/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-vendidos-barranca',
  templateUrl: './lista-vendidos-barranca.component.html',
  styleUrls: ['./lista-vendidos-barranca.component.css']
})
export class ListaVendidosBarrancaComponent implements OnInit {

  titulo: string = "LISTA DE VENTAS ENTREGADOS";
  tipo: string = "entregados";
  sucursal: string = "Barranca";

  url_backend: string = environment.urlBackend + "/mostrar/pto/imagen";
  opcion: string = "";
  fecha!: string;
  comprobantes: Comprobante[] = [];
  errMessageBusqueda!: string;

  direccionEnvio: DireccionEnvio = new DireccionEnvio();
  isVisibleModal: boolean = false;

  preloaderAnulando: boolean = false;
  preloaderEntregando: boolean = false;
  editando!: number;

  isVisibleDetallePagov: boolean = false;
  detallePagov!: DetallePago;

  constructor(private comService: ComprobanteService, public loginService: LoginService) { }

  ngOnInit(): void {

  }

  buscar(): void {
    if (this.fecha != null) {
      this.comprobantes.length = 0;
      this.comService.buscarEntregadosPorFecha(this.fecha, this.sucursal).subscribe(resp => {
        this.comprobantes = resp;
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
    this.comprobantes.length = 0;
  }

  changeStatusPedido(com: Comprobante): void {

    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado a ENTREGA PENDIENTE???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.preloaderEntregando = true;
        this.editando = com.idcomprobante;
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;
        comm.estado = "Entrega pendiente";
        comm.tipoComprobante = com.tipoComprobante;
        comm.idtransaccion = com.idtransaccion;

        this.comService.editarComprobante(comm).subscribe(resp => {
          this.preloaderEntregando = false;
          this.editando = 0;
          this.comprobantes = this.comprobantes.filter(co => co.idcomprobante != com.idcomprobante);
          Swal.fire({
            icon: 'success',
            text: 'Estado de la venta combiado con éxito'
          });
        }, err => {
          this.preloaderEntregando = false;
          this.editando = 0;
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado, intentelo mas tarde'
          });
        });
      }
    });

  }

  verTodo(de: DireccionEnvio): void {
    this.direccionEnvio = de;
    this.isVisibleModal = true;
  }

  verDetallePago(com: Comprobante): void {
    this.detallePagov = com.detallePago;
    this.isVisibleDetallePagov = true;
  }

}
