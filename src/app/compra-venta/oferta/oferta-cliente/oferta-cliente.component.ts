import { Component, OnInit } from '@angular/core';
import { ClienteComprobante } from 'src/app/modelo/cliente/cliente-comprobante';
import { ClienteOferta } from 'src/app/modelo/cliente/cliente-oferta';
import { ClienteComprobanteService } from 'src/app/servicio/cliente/cliente-comprobante.service';
import { LoginService } from 'src/app/servicio/login/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-oferta-cliente',
  templateUrl: './oferta-cliente.component.html',
  styleUrls: ['./oferta-cliente.component.css']
})
export class OfertaClienteComponent implements OnInit {

  url_backend = environment.urlBackend + "/mostrar/cli-oferta/imagen"

  ccsearchs: ClienteComprobante[] = [];
  errMessageSearch!: string;

  ccaceptados: ClienteComprobante[] = [];
  errMessageAceptado!: string;
  paginatorAceptado: any = {};

  ccrechazados: ClienteComprobante[] = [];
  errMessageRechazado!: string;
  paginatorRechazado: any = {};

  ccpendientes: ClienteComprobante[] = [];
  errMessagePendiente!: string;
  paginatorPendiente: any = {};

  finicio!: string;
  ffin!: string;

  tipo: string = "cliente";

  constructor(private ccservice: ClienteComprobanteService, public loginService:LoginService) { }

  ngOnInit(): void {

    this.listarPendientes(0);
    this.listarAceptados(0);
    this.listarRechazados(0);

    this.ccservice.cbPendiente.subscribe(page => {
      this.listarPendientes(page);
    });

    this.ccservice.cbAceptado.subscribe(page => {
      this.listarAceptados(page);
    });

    this.ccservice.cbRechazado.subscribe(page => {
      this.listarRechazados(page);
    });

  }

  listarAceptados(page: number): void {
    const estado = "Aceptado";
    this.ccservice.listCC(estado, page).subscribe(resp => {
      this.ccaceptados = resp.content;
      this.paginatorAceptado = resp;
      this.errMessageAceptado = "";
    }, err => {
      this.ccaceptados.length = 0;
      this.errMessageAceptado = "Sin datos que mostrar";
    });
  }

  listarRechazados(page: number): void {
    const estado = "Rechazado";
    this.ccservice.listCC(estado, page).subscribe(resp => {
      this.ccrechazados = resp.content;
      this.paginatorRechazado = resp;
      this.errMessageRechazado = "";
    }, err => {
      this.ccrechazados.length = 0;
      this.errMessageRechazado = "Sin datos que mostrar";
    });
  }

  listarPendientes(page: number): void {
    const estado = "Pendiente";
    this.ccservice.listCC(estado, page).subscribe(resp => {
      this.ccpendientes = resp.content;
      this.paginatorPendiente = resp;
      this.errMessagePendiente = "";
    }, err => {
      this.ccpendientes.length = 0;
      this.errMessagePendiente = "Sin datos que mostrar";
    });
  }

  buscar(): void {
    if (this.finicio != null && this.ffin != null) {
      this.ccsearchs.length = 0;
      this.ccservice.searchByFechas(this.finicio, this.ffin).subscribe(datos => {
        this.ccsearchs = datos;
        this.errMessageSearch = "";
      }, err => {
        this.errMessageSearch = "Sin datos que mostrar";
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        title: 'Datos incompletos',
        text: 'Ingrese las dos fechas necesarias para empezar la busqueda'
      });
    }
  }

  limpiar(): void {
    this.ccsearchs.length = 0;
    this.errMessageSearch = "";
  }

  marcarAceptado(ccom: ClienteComprobante): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea aceptar oferta',
      text: 'Esá intentando aceptar oferta, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(res => {

      if (res.value) {        
        ccom.estado = "Aceptado";
        this.ccservice.ccUpdate(ccom).subscribe(resp => {   

          this.ngOnInit();

          Swal.fire({
            icon: 'success',
            text: resp.mensaje
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

  marcarRechazado(ccom: ClienteComprobante): void {
    Swal.fire({
      icon: 'question',
      title: 'Seguro que desea rechazar oferta',
      text: 'Esá intentando poner el estado como rechazado, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(res => {

      if (res.value) {        
        ccom.estado = "Rechazado";
        this.ccservice.ccUpdate(ccom).subscribe(resp => {   

          this.ngOnInit();

          Swal.fire({
            icon: 'success',
            text: resp.mensaje
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

  marcarPendiente(ccom: ClienteComprobante): void {
    Swal.fire({
      icon: 'question',
      title: 'Marcar como pendiente?',
      text: 'Está intentando poner el estado en pendiente, por favor confirme la acción',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(res => {

      if (res.value) {        
        ccom.estado = "Pendiente";
        this.ccservice.ccUpdate(ccom).subscribe(resp => {    

          this.ngOnInit();

          Swal.fire({
            icon: 'success',
            text: resp.mensaje
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

}
