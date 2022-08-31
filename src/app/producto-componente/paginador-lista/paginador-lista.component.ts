import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IngresoService } from 'src/app/servicio/ingreso/ingreso.service';
import { ProductoService } from 'src/app/servicio/producto/producto.service';

@Component({
  selector: 'app-paginador-lista',
  templateUrl: './paginador-lista.component.html',
  styleUrls: ['./paginador-lista.component.css']
})
export class PaginadorListaComponent implements OnInit, OnChanges {

  @Input() paginador!:any;
  @Input() tipo!:string;

  paginas:number[]=[];

  desde!:number;
  hasta!:number;

  constructor(private productoService:ProductoService,
    private ingresoService:IngresoService) { }
  
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
    if(this.tipo == "producto"){
      this.productoService.cbPaginar.emit(page);
    }
    else if(this.tipo == "ingreso"){
      this.ingresoService.cbIngreso.emit(page);
    }
    
  }

}
