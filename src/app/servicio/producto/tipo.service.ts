import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tipo } from 'src/app/modelo/producto/tipo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  private url = environment.urlBackend+"/cat-tipo";

  constructor(private http:HttpClient) { }

  public listTipos() : Observable<Tipo[]>{
    return this.http.get(this.url+"/tip-lista").pipe(
      map(resp => resp as Tipo[])
    );
  }

  public createTipo(tipo:Tipo) : Observable<any>{
    return this.http.post(this.url+"/tip-crear", tipo).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getTipo(id:number) : Observable<Tipo>{
    return this.http.get(this.url+"/tip-obtener/"+id).pipe(
      map(resp => resp as Tipo),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public updateTipo(tipo:Tipo) : Observable<any>{
    return this.http.post(this.url+"/tip-editar", tipo).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deleteTipo(id:number) : Observable<any>{
    return this.http.delete(this.url+"/tip-eliminar/"+id).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
