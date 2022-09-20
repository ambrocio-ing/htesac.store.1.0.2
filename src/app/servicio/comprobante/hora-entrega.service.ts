import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HoraEntrega } from 'src/app/modelo/comprobante/hora-entrega';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HoraEntregaService {

  private url:string = environment.urlBackend + "/hour-delivery/he"

  constructor(private http:HttpClient) { }

  public listHE(): Observable<HoraEntrega[]>{
    return this.http.get<HoraEntrega[]>(this.url + "/lista");
  }

  public createHE(he:HoraEntrega): Observable<any> {
    return this.http.post(this.url + "/crear", he);
  }

  public getHe(id:number): Observable<HoraEntrega>{
    return this.http.get<HoraEntrega>(this.url + "/obtener/" + id);
  }

  public updateHE(he:HoraEntrega): Observable<any> {
    return this.http.post(this.url + "/editar", he);
  }

  public deleteHE(id:number): Observable<any> {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

}
