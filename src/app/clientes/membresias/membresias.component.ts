import { Component, OnInit } from '@angular/core';
import { DetalleMembresia } from 'src/app/modelo/membresia/detalle-membresia';
import { MembresiaService } from 'src/app/servicio/membresia/membresia.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-membresias',
  templateUrl: './membresias.component.html',
  styleUrls: ['./membresias.component.css']
})
export class MembresiasComponent implements OnInit {

  url_dm: string = environment.urlBackend + "/mostrar/detmem/imagen";

  bus_detmembresias: DetalleMembresia[] = [];
  dniOrName!: string;
  errMessageBus!: string;

  val_detmembresias: DetalleMembresia[] = [];
  errMessageVal!: string;
  val_page: number = 1;
  val_pageSize: number = 10;

  re_detmembresias: DetalleMembresia[] = [];
  errMessageRe!: string;
  re_page: number = 1;
  re_pageSize: number = 10;

  detmembresias: DetalleMembresia[] = [];
  errMessage!: string;
  page: number = 1;
  pageSize: number = 10;

  constructor(private memService: MembresiaService) { }

  ngOnInit(): void {

    this.listarEstadoValido();
    this.listarEstadoPendiente();
    this.listarEstadoRechazado();

  }

  listarEstadoValido(): void {
    const estado = "Vigente";
    this.memService.listDetMembresiaPorEstado(estado).subscribe(resp => {
      this.detmembresias = resp;
      this.errMessage = "";
    }, err => {
      this.errMessage = "Sin datos que mostrar";
    });
  }

  listarEstadoPendiente(): void {
    const estado = "Validación pendiente";
    this.memService.listDetMembresiaPorEstado(estado).subscribe(resp => {
      this.val_detmembresias = resp;
      this.errMessageVal = "";
    }, err => {
      this.errMessageVal = "Sin datos que mostrar";
    });
  }

  listarEstadoRechazado(): void {
    const estado = "Rechazado";
    this.memService.listDetMembresiaPorEstado(estado).subscribe(resp => {
      this.re_detmembresias = resp;
      this.errMessageRe = "";
    }, err => {
      this.errMessageRe = "Sin datos que mostrar";
    });
  }

  validar(dm: DetalleMembresia): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea validar el estado de la compra???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {

        let detmem = new DetalleMembresia();
        detmem.iddetallemembresia = dm.iddetallemembresia;
        detmem.idtransaccion = dm.idtransaccion;
        detmem.estado = "Vigente";
        detmem.detallePago.estadoPago = "Vigente";

        this.memService.updateDetMembresia(detmem).subscribe(resp => {

          this.ngOnInit();
          Swal.fire({
            icon: 'success',
            text: resp.mensaje
          });
        }, err => {
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado'
          });
        });
      }
    });
  }

  rechazar(dm: DetalleMembresia): void {
    Swal.fire({
      icon: 'question',
      text: 'Seguro que desea rechazar el estado de la compra???',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.value) {

        let detmem = new DetalleMembresia();
        detmem.iddetallemembresia = dm.iddetallemembresia;
        detmem.idtransaccion = dm.idtransaccion;
        detmem.estado = "Rechazado";
        detmem.detallePago.estadoPago = "Rechazado";

        this.memService.updateDetMembresia(detmem).subscribe(resp => {

          this.ngOnInit();

          Swal.fire({
            icon: 'success',
            text: resp.mensaje
          });

        }, err => {
          Swal.fire({
            icon: 'error',
            text: 'No fue posible actualizar estado'
          });
        });
      }
    });
  }

  buscar(): void {
    if (this.dniOrName != null && this.dniOrName != "") {
      this.bus_detmembresias.length = 0;
      const texto = this.dniOrName.split(" ").join("").toUpperCase();
      this.memService.listDetMembresiaPorCliente(texto).subscribe(resp => {
        this.bus_detmembresias = resp;
        this.errMessageBus = "";
      }, err => {
        this.errMessageBus = "Sin datos que mostrar";
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Ingrese nombre o dni del cliente para continuar con la busqueda'
      });
    }
  }

  limpiar(): void {
    this.bus_detmembresias.length = 0;
  }

}
