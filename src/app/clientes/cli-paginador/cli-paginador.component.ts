import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/servicio/cliente/cliente.service';

@Component({
  selector: 'app-cli-paginador',
  templateUrl: './cli-paginador.component.html',
  styleUrls: ['./cli-paginador.component.css']
})
export class CliPaginadorComponent implements OnInit, OnChanges {

  @Input() paginador!:any; 

  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private cliService:ClienteService) { }
  
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
    this.cliService.cbPaginar.emit(page);
    
  }

}
