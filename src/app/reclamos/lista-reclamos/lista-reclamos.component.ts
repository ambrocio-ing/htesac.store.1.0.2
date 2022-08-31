import { Component, OnInit } from '@angular/core';
import { Reclamo } from 'src/app/modelo/reclamo/reclamo';
import { ReclamoService } from 'src/app/servicio/reclamo/reclamo.service';

@Component({
  selector: 'app-lista-reclamos',
  templateUrl: './lista-reclamos.component.html',
  styleUrls: ['./lista-reclamos.component.css']
})
export class ListaReclamosComponent implements OnInit {

  reclamos:Reclamo[] = [];
  errMessageReclamo!:string;

  paginator:any = {};

  constructor(private reclamoService:ReclamoService) { }

  ngOnInit(): void {

    this.listar(0);

    this.reclamoService.cbPaginar.subscribe(page => {
      this.listar(page);
    });

  }

  listar(page:number) : void {
    this.reclamoService.listarTodo(page).subscribe(resp => {
      this.reclamos = resp.content;
      this.paginator = resp;
      this.errMessageReclamo = "";
    }, err => {
      this.errMessageReclamo = "Sin datos que mostrar";
    });
  }

}
