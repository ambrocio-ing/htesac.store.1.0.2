import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClienteComprobante } from 'src/app/modelo/cliente/cliente-comprobante';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteComprobanteService {

  public cbAceptado:EventEmitter<number> = new EventEmitter();
  public cbRechazado:EventEmitter<number> = new EventEmitter();
  public cbPendiente:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/cli-oferta/co";

  constructor(private http:HttpClient) { }

  public searchByFechas(finicio:string,ffin:string): Observable<ClienteComprobante[]> {
    return this.http.get<ClienteComprobante[]>(this.url+"/entre/fechas/"+finicio+"/"+ffin);
  }

  public listCC(estado:string, page:number) : Observable<any> {
    return this.http.get(this.url+"/pores/"+estado+"/"+page).pipe(
      map((resp : any) => {
        resp.content as ClienteComprobante[];
        return resp;
      })
    );
  }

  public ccUpdate(cc:ClienteComprobante) : Observable<any> {
    return this.http.post(this.url+"/editar", cc);
  }
}
