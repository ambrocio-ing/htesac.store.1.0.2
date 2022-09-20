import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-anulados',
  templateUrl: './lista-anulados.component.html',
  styleUrls: ['./lista-anulados.component.css']
})
export class ListaAnuladosComponent implements OnInit {

  tipo:string = "anulados";
  titulo:string = "LISTA DE VENTAS ANULADOS";
  sucursal!:string;

  constructor() { }

  ngOnInit(): void {
    
  }

}
