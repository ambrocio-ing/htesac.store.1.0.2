import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Categoria } from 'src/app/modelo/producto/categoria';
import { Tipo } from 'src/app/modelo/producto/tipo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private url = environment.urlBackend+"/cat-tipo";

  constructor(private http:HttpClient) { }

  public listCategorias() : Observable<Categoria[]>{
    return this.http.get(this.url+"/cat-lista").pipe(
      map(resp => resp as Categoria[])
    );
  }

  public createCategoria(cat:Categoria) : Observable<any>{
    return this.http.post(this.url+"/cat-crear", cat).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getCategoria(id:number) : Observable<Categoria>{
    return this.http.get(this.url+"/cat-obtener/"+id).pipe(
      map(resp => resp as Categoria),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public updateCategoria(cat:Categoria) : Observable<any>{
    return this.http.post(this.url+"/cat-editar", cat).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deleteCategoria(id:number) : Observable<any>{
    return this.http.delete(this.url+"/cat-eliminar/"+id).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  //tipo 

}
