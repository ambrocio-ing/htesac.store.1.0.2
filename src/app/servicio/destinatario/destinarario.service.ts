import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Destinatario } from 'src/app/modelo/destinatario/destinatario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinararioService {

  cbPaginar:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/di-envio/die";

  constructor(private http:HttpClient) { }

  public listDES(page:number) : Observable<any> {
    return this.http.get(this.url+"/des-list/"+page).pipe(
      map((resp:any) => {
        resp.content as Destinatario[];
        return resp;
      })
    );
  }

  public getDES(dni:string) : Observable<Destinatario[]> {
    return this.http.get(this.url+"/des-obtener/"+dni).pipe(
      map((resp:any) => {        
        const des: Destinatario[] = [];
        des.push(resp as Destinatario);
        return des;
      })
    );
  }

  public updateDES(des:Destinatario) : Observable<any> {
    return this.http.post(this.url+"/des-editar", des);
  }
}
