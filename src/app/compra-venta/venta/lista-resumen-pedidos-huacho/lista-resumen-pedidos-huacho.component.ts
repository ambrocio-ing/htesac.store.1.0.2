import { Component, OnInit } from '@angular/core';
import { MResumenVenta } from 'src/app/modelo/comprobante/m-resumen-venta';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import Swal from 'sweetalert2';
import JsPdf from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-lista-resumen-pedidos-huacho',
  templateUrl: './lista-resumen-pedidos-huacho.component.html',
  styleUrls: ['./lista-resumen-pedidos-huacho.component.css']
})
export class ListaResumenPedidosHuachoComponent implements OnInit {

  preloader: boolean = false;
  fechaEntrega!: string;

  bus_resumenes: MResumenVenta[] = [];
  errMessageBusResumenes!: string;

  resumenes: MResumenVenta[] = [];
  errMessageResumenes!: string;
  page: number = 1;
  pageSize: number = 10;

  sucursal!: string;

  constructor(private comService: ComprobanteService) {
    this.sucursal = "Huacho";
  }

  ngOnInit(): void {

    this.listarResumenes();

    /* let resumen = new MResumenVenta();
    resumen.nombreProducto = "Lavavajilla Sapolio x 250g";
    resumen.cantidadTotal = 25;
    //resumen.fechaEntrega = "2022-05-05";
    resumen.fechaHoraEntrega = "2022-05-25T05:05";
    resumen.precioVenta = 45.8;

    let variedad = new Variedad();
    variedad.nombreTalla = "M",
      variedad.cantidadTalla = 12;
    let color = new Color();
    color.nombreColor = "Amarillo";
    color.cantidadColor = 12;
    variedad.colores.push(color);
    variedad.colores.push(color);
    variedad.colores.push(color);

    resumen.variedades.push(variedad);
    resumen.variedades.push(variedad);
    resumen.variedades.push(variedad);

    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen); */
  }

  descargar() {
    if (this.resumenes.length > 0) {
      var pdf = new JsPdf();
      pdf.setFontSize(15);
      pdf.text("RESUMEN DE PEDIDOS", 11, 8);
      autoTable(pdf, { html: '#my-table' });

      pdf.output('dataurlnewwindow');
      pdf.save('table' + new Date(Date.now()).getTime() + '.pdf');

    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'No se ha encontrado registros que descargar'
      });
    }
  }

  listarResumenes(): void {
    this.preloader = true;
    this.comService.resumenes(this.sucursal).subscribe(resp => {
      this.preloader = false;
      this.resumenes = resp;
      this.errMessageResumenes = "";
    }, err => {
      this.preloader = false;
      this.errMessageResumenes = "No se encontó productos que entregar"
    });


  }

  buscar(): void {
    if (this.fechaEntrega != null && this.fechaEntrega != "") {
      this.bus_resumenes.length = 0;
      this.preloader = true;
      this.comService.resumenesPorFecha(this.fechaEntrega, this.sucursal).subscribe(resp => {
        this.preloader = false;
        this.bus_resumenes = resp;
        this.errMessageBusResumenes = "";
      }, err => {
        this.preloader = false;
        this.errMessageBusResumenes = "No se encontraron entregas pendientes";
      });
    }
    else {
      Swal.fire({
        icon: 'info',
        text: 'Ingrese una fecha válida para continuar con la busqueda'
      });
    }
  }

}
