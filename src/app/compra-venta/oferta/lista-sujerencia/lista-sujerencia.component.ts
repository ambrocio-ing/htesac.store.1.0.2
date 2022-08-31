import { Component, OnInit } from '@angular/core';
import { Sujerencia } from 'src/app/modelo/sujerencia/sujerencia';
import { LibroReclamoService } from 'src/app/servicio/libro-reclamo/libro-reclamo.service';

@Component({
  selector: 'app-lista-sujerencia',
  templateUrl: './lista-sujerencia.component.html',
  styleUrls: ['./lista-sujerencia.component.css']
})
export class ListaSujerenciaComponent implements OnInit {

  sujerencias:Sujerencia[] = [];
  errMessageSuje!:string;

  paginator:any = {};

  constructor(private libroService:LibroReclamoService) { }

  ngOnInit(): void {

    this.listar(0);

    this.libroService.cbPaginarSuje.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page:number) : void {
    this.libroService.listSujerencias(page).subscribe(resp => {
      this.sujerencias = resp.content;
      this.paginator = resp;
      this.errMessageSuje = "";
    }, err => {
      this.errMessageSuje = "Sin datos que mostrar";
    });
  }

}
