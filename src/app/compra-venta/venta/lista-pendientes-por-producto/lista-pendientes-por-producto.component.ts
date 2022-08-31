import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MResumenVenta } from 'src/app/modelo/comprobante/m-resumen-venta';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import JsPdf from 'jspdf';
//import { MDetalleResumenVenta } from 'src/app/modelo/comprobante/m-detalle-resumen-venta';

@Component({
  selector: 'app-lista-pendientes-por-producto',
  templateUrl: './lista-pendientes-por-producto.component.html',
  styleUrls: ['./lista-pendientes-por-producto.component.css']
})
export class ListaPendientesPorProductoComponent implements OnInit { 

  @ViewChild("asResumen", {static:false}) resumen!:ElementRef;
  
  url_backend:string = environment.urlBackend+"/mostrar/pto/imagen";  
  preloader:boolean = false;  
  fechaEntrega!:string;

  bus_resumenes:MResumenVenta[] = [];
  errMessageBusResumenes!:string;

  resumenes:MResumenVenta[] = [];
  errMessageResumenes!:string;
  page:number = 1;
  pageSize:number = 10;

  constructor(private comService:ComprobanteService) { }

  ngOnInit(): void {

    this.listarResumenes();

  }

  descargar(){
    const doc = new JsPdf("p", "pt", "a4");
    
    doc.html(this.resumen.nativeElement, {callback : (pdf) => {
      const numero = new Date(Date.now()).getTime();
      pdf.save(numero + "pedidos.pdf");
    }})
  } 

  listarResumenes(): void {
    this.preloader = true;
    this.comService.resumenes().subscribe(resp => {
      this.preloader = false;
      this.resumenes = resp;    
      this.errMessageResumenes = "";  
    }, err => {
      this.preloader = false;
      this.errMessageResumenes = "No se encontó productos que entregar"
    });

    /* let detalleResumen = new MDetalleResumenVenta();
    detalleResumen.cantidadProducto = 10;
    detalleResumen.dniCliente = "12354785";
    detalleResumen.nombreCliente = "Eloy becerra porra";
    detalleResumen.fechaEntrega = "2022-05-05";
    detalleResumen.fechaPedido = "2022-02-05";
    detalleResumen.numeroComprobante = "001-000001";   

    let resumen = new MResumenVenta();
    resumen.nombreProducto = "Lavavajilla Sapolio x 250g";
    resumen.cantidadTotal = 25;
    resumen.fechaEntrega = "2022-05-05";
    resumen.detalleResumenVentas.push(detalleResumen);
    resumen.detalleResumenVentas.push(detalleResumen);
    resumen.detalleResumenVentas.push(detalleResumen);
    resumen.detalleResumenVentas.push(detalleResumen);

    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen);
    this.resumenes.push(resumen); */
  }

  buscar(): void {
    if(this.fechaEntrega != null && this.fechaEntrega != ""){
      this.bus_resumenes.length = 0;
      this.preloader = true;
      this.comService.resumenesPorFecha(this.fechaEntrega).subscribe(resp => {
        this.preloader = false;
        this.bus_resumenes = resp;
        this.errMessageBusResumenes = "";
      }, err => {
        this.preloader = false;
        this.errMessageBusResumenes = "No se encontraron entregas pendientes";
      });
    }
    else{
      Swal.fire({
        icon:'info',
        text:'Ingrese una fecha válida para continuar con la busqueda'
      });
    }
  }

}
