import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibroReclamo } from 'src/app/modelo/libro-reclamo/libro-reclamo';
import { Sujerencia } from 'src/app/modelo/sujerencia/sujerencia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroReclamoService {

  cbPaginar:EventEmitter<number> = new EventEmitter();
  private url:string = environment.urlBackend+"/lib-re/lr";

  cbPaginarSuje:EventEmitter<number> = new EventEmitter();  

  constructor(private Http:HttpClient) { }

  public listLibroReclamo(page:number) : Observable<any> {
    return this.Http.get(this.url+"/lista/"+page).pipe(
      map((resp:any) => {
        resp.content as LibroReclamo[];
        return resp;
      })
    );
  }

  public createLibroReclamo(lr:LibroReclamo) : Observable<any> {
    return this.Http.post(this.url+"/crear", lr);
  }

  public getLibroReclamo(id:number) : Observable<LibroReclamo> {
    return this.Http.get<LibroReclamo>(this.url+"/obtener/"+id);
  }

  public updateLibroReclamo(lr:LibroReclamo) : Observable<any> {
    return this.Http.post(this.url+"/editar", lr);
  }

  public deleteLibroReclamo(id:number) : Observable<any> {
    return this.Http.delete(this.url+"/eliminar/"+id);
  }

  //metodos para sujerencia
  public listSujerencias(page:number) : Observable<any> {
    return this.Http.get(this.url+"/suje-list/"+page).pipe(
      map((resp: any) => {
        resp.content as Sujerencia[];
        return resp;
      })
    );
  }

}
