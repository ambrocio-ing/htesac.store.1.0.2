import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DireccionEnvio } from 'src/app/modelo/direcion-envio/direccion-envio';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-direccion-envio',
  templateUrl: './ver-direccion-envio.component.html',
  styleUrls: ['./ver-direccion-envio.component.css']
})
export class VerDireccionEnvioComponent implements OnInit {

  @Input() diEnvio!:DireccionEnvio;
  @Input() visibleModal!:boolean;
  @Output() cerrar:EventEmitter<boolean> = new EventEmitter();

  public url_imagen:string = environment.urlBackend+"/mostrar/per/imagen";

  constructor() { }

  ngOnInit(): void {

  }

  close() : void {
    this.cerrar.emit(false);
  }

}
