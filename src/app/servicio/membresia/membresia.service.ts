import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Membresia } from 'src/app/modelo/membresia/membresia';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private url: string = environment.urlBackend + "/membresia/mem";

  constructor(private http: HttpClient) { }

  public listMembresia(): Observable<Membresia[]> {
    return this.http.get<Membresia[]>(this.url + "/lista");
  }

  public createMembresia(mem: Membresia, imagen: File): Observable<any> {
    return this.http.post(this.url + "/crear", mem).pipe(
      switchMap((res: any) => {

        const formData = new FormData();
        formData.append("id", res.id);
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData).pipe(
          catchError(e => {  
            this.deleteMembresia(res.id).subscribe();      
            return throwError(e);
          })
        );

      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public create_Membresia(mem: Membresia): Observable<any> {
    return this.http.post(this.url + "/crear", mem).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getMembresia(id: number): Observable<Membresia> {
    return this.http.get<Membresia>(this.url + "/obtener/" + id);
  }

  public updateMembresia(mem: Membresia, imagen: File): Observable<any> {
    return this.http.post(this.url + "/editar", mem).pipe(
      switchMap((res: any) => {

        const formData = new FormData();
        formData.append("id", mem.idmembresia.toString());
        formData.append("imagen", imagen);

        return this.http.post(`${this.url}/imagen`, formData);

      }),
      catchError(e => {        
        return throwError(e);
      })
    );
  }

  public deleteMembresia(id: number): Observable<any> {
    return this.http.delete(this.url + "/eliminar/" + id);
  }

  public update_Membresia(mem: Membresia): Observable<any> {
    return this.http.post(this.url + "/editar", mem).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
