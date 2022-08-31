import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Personal } from 'src/app/modelo/personal/personal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private url = environment.urlBackend+"/personal/per";

  constructor(private http:HttpClient) { }

  public getPersonals() : Observable<Personal[]>{
    return this.http.get<Personal[]>(this.url+"/lista");
  }

  public createPersonal(personal:Personal, foto:File) : Observable<any> {
    return this.http.post(this.url+"/crear", personal).pipe(
      switchMap((resp: any) => {
        const documento = resp.documento;
        const formData = new FormData();
        formData.append("documento", documento);
        formData.append("imagen", foto);

        return this.http.post(`${this.url}/foto`, formData).pipe(
          map((res:any) => {
            return res;
          })
        );

      }),

      catchError(e => {
        return throwError(e);
      })
    );
  }

  public create_Personal(personal:Personal) : Observable<any> {
    return this.http.post(this.url+"/crear", personal).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public getPersonal(id:number) : Observable<Personal> {
    return this.http.get(this.url+"/obtener/"+id).pipe(
      map(resp => resp as Personal),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public updatePersonal(personal:Personal) : Observable<any> {
    return this.http.post(this.url+"/editar", personal).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deletePersonal(id:number) : Observable<any> {
    return this.http.delete(this.url+"/eliminar/"+id).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public uploadFoto(dni:string, foto:File) : Observable<any> {

    const formData = new FormData();
    formData.append("documento", dni);
    formData.append("imagen", foto);

    return this.http.post(`${this.url}/foto`, formData).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
