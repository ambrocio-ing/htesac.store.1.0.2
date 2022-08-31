import { Component, Input, OnInit } from '@angular/core';
import { ComprobanteService } from 'src/app/servicio/comprobante/comprobante.service';

@Component({
  selector: 'app-paginador-general',
  templateUrl: './paginador-general.component.html',
  styleUrls: ['./paginador-general.component.css']
})
export class PaginadorGeneralComponent implements OnInit {

  @Input() paginador!:any; 

  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private comService:ComprobanteService) { }
  
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
    
    this.comService.cbPaginator.emit(page);
  }

}
