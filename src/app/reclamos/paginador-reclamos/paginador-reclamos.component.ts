import { Component, Input, OnInit } from '@angular/core';
import { ReclamoService } from 'src/app/servicio/reclamo/reclamo.service';

@Component({
  selector: 'app-paginador-reclamos',
  templateUrl: './paginador-reclamos.component.html',
  styleUrls: ['./paginador-reclamos.component.css']
})
export class PaginadorReclamosComponent implements OnInit {

  @Input() paginador!:any; 

  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private reclamoService:ReclamoService) { }
  
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
    
    this.reclamoService.cbPaginar.emit(page);
    
  }

}
