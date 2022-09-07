import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from 'src/app/modelo/cliente/cliente';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cli-ver',
  templateUrl: './cli-ver.component.html',
  styleUrls: ['./cli-ver.component.css']
})
export class CliVerComponent implements OnInit {

  @Input() isVisibleModal!:boolean;
  @Input() cliente!:Cliente;
  @Output() cerrar:EventEmitter<boolean> = new EventEmitter();

  public url_backend:string = environment.urlBackend+"/mostrar/cli/imagen";

  constructor() { }

  ngOnInit(): void {

  }

  closeModal() : void {
    this.cerrar.emit(false);
  }

}
