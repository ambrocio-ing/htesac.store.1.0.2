import { Component, Input, OnInit } from '@angular/core';
import { DestinararioService } from 'src/app/servicio/destinatario/destinarario.service';

@Component({
  selector: 'app-destinatarios-paginador',
  templateUrl: './destinatarios-paginador.component.html',
  styleUrls: ['./destinatarios-paginador.component.css']
})
export class DestinatariosPaginadorComponent implements OnInit {

  @Input() paginador!:any;
  
  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private desService:DestinararioService) { }
  
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
    
    this.desService.cbPaginar.emit(page);
    
  }

}
