import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ClienteComprobanteService } from 'src/app/servicio/cliente/cliente-comprobante.service';
import { ProveedorOfertaService } from 'src/app/servicio/proveedor/proveedor-oferta.service';

@Component({
  selector: 'app-rechazado-paginador',
  templateUrl: './rechazado-paginador.component.html',
  styleUrls: ['./rechazado-paginador.component.css']
})
export class RechazadoPaginadorComponent implements OnInit, OnChanges {

  @Input() paginador!:any;
  @Input() tipo!:string;

  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private ccservice:ClienteComprobanteService, 
    private poService:ProveedorOfertaService) { }
  
  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.desde = Math.min(Math.max(1,this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    if(this.paginador.totalPages > 5){
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((valor, indice) => indice + this.desde);
    }
    else{
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor, indice) => indice + 1);
    }  
    
  }

  cambiarpagina(page:number) : void {
    if(this.tipo == "cliente"){
      this.ccservice.cbRechazado.emit(page);
    }
    else if(this.tipo == "proveedor"){
      this.poService.cbRechazado.emit(page);
    }
    
  }

}
