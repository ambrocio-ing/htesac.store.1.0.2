import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProveedorComprobante } from 'src/app/modelo/proveedor/proveedor-comprobante';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorOfertaService {

  public cbPendiente:EventEmitter<number> = new EventEmitter();
  public cbAceptado:EventEmitter<number> = new EventEmitter();
  public cbRechazado:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/oferta-pro";

  constructor(private http:HttpClient) { }

  public searchProveedorComprobante(finicio:string, ffin:string) : Observable<ProveedorComprobante[]> {
    return this.http.get(this.url+"/buscar/"+finicio+"/"+ffin).pipe(
      map(resp => resp as ProveedorComprobante[])
    );
  }

  public listPendientes(page:number) : Observable<any> {
    return this.http.get(this.url+"/pendiente/"+page).pipe(
      map((resp:any) => {
        resp.content as ProveedorComprobante[];
        return resp;
      })
    );
  } 

  public listAceptado(page:number) : Observable<any> {
    return this.http.get(this.url+"/aceptado/"+page).pipe(
      map((resp:any) => {
        resp.content as ProveedorComprobante[];
        return resp;
      })
    );
  } 

  public listRechazado(page:number) : Observable<any> {
    return this.http.get(this.url+"/rechazado/"+page).pipe(
      map((resp:any) => {
        resp.content as ProveedorComprobante[];
        return resp;
      })
    );
  } 

  public updatePC(pc:ProveedorComprobante) : Observable<any> {
    return this.http.post(this.url+"/editar", pc);
  }

}
