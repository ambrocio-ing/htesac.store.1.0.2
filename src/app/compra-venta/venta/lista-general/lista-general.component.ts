import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from 'src/app/modelo/cliente/cliente';
import { Comprobante } from 'src/app/modelo/comprobante/comprobante';
import { DetallePago } from 'src/app/modelo/comprobante/detalle-pago';
import { Destinatario } from 'src/app/modelo/destinatario/destinatario';
import { DireccionEnvio } from 'src/app/modelo/direcion-envio/direccion-envio';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import { LoginService } from 'src/app/servicio/login/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.css']
})
export class ListaGeneralComponent implements OnInit {

  @Input() titulo!: string;
  @Input() tipo!: string;

  comprobantes: Comprobante[] = [];
  errMessageComs!: string;
  url_backend: string = environment.urlBackend + "/mostrar/pto/imagen";
  opcion: string = "";

  paginator: any = {};
  isPedido: boolean = false;

  direccionEnvio: DireccionEnvio = new DireccionEnvio();
  isVisibleModal: boolean = false;

  preloaderAnulando: boolean = false;
  preloaderEntregando: boolean = false;
  editando!: number;

  isVisibleDetallePago: boolean = false;
  detallePago!: DetallePago;

  constructor(private comService: ComprobanteService, public loginService: LoginService) {
    this.direccionEnvio.cliente = new Cliente();
    this.direccionEnvio.destinatario = new Destinatario();
  }

  ngOnInit(): void {

    if (this.tipo == "pedidos") {
      this.listarPedidos(0);
      this.comService.cbPaginator.subscribe(page => {
        this.listarPedidos(page);
      });
      this.isPedido = true;
    }

    if (this.tipo == "entregados") {
      this.listarEntregados(0);
      this.comService.cbPaginator.subscribe(page => {
        this.listarEntregados(page);
      });
    }

    if (this.tipo == "anulados") {
      this.listarAnulados(0);
      this.comService.cbPaginator.subscribe(page => {
        this.listarAnulados(page);
      });
    }

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

  listarEntregados(page: number): void {
    this.comService.listarEntregados(page).subscribe(resp => {
      this.comprobantes = resp.content;
      this.paginator = resp;
      this.errMessageComs = "";
    }, err => {
      this.errMessageComs = "Sin datos que mostrar";
    });
  }

  listarAnulados(page: number): void {
    this.comService.listarAnulados(page).subscribe(resp => {
      this.comprobantes = resp.content;
      this.paginator = resp;
      this.errMessageComs = "";
    }, err => {
      this.errMessageComs = "Sin datos que mostrar";
    });
  }

  changeStatusEntregado(com: Comprobante): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea cambiar estado???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.preloaderEntregando = true;
        this.editando = com.idcomprobante;
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;

        if (this.isPedido) {
          comm.estado = "Entregado";
        }
        else {
          comm.estado = "Entrega pendiente";
        }

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

  changeStatusAnular(com: Comprobante): void {

    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea anular el comprobante ???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {
        this.preloaderAnulando = true;
        this.editando = com.idcomprobante;
        const comm = new Comprobante();
        comm.idcomprobante = com.idcomprobante;
        comm.estado = "Anulado";

        this.comService.anularComprobante(comm).subscribe(resp => {
          this.preloaderAnulando = false;
          this.editando = 0;
          this.comprobantes = this.comprobantes.filter(co => co.idcomprobante != com.idcomprobante);
          Swal.fire({
            icon: 'success',
            text: resp.mensaje
          });
        }, err => {
          this.preloaderAnulando = false;
          this.editando = 0;
          Swal.fire({
            icon: 'error',
            text: 'No fue posible anular estado, intentelo mas tarde'
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
    this.detallePago = com.detallePago;
    this.isVisibleDetallePago = true;
  }

}
