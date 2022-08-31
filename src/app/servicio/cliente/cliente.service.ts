import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from 'src/app/modelo/cliente/cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public cbPaginar:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/admin";

  constructor(private http:HttpClient) { }

  public searchClientes(texto:string) : Observable<Cliente[]> {
    return this.http.get(this.url+"/cli/buscar/"+texto).pipe(
      map(resp => resp as Cliente[])
    );
  }

  public listClientes(page:number) : Observable<any> {
    return this.http.get(this.url+"/cli/lista/"+page).pipe(
      map((resp:any) => {
        resp.content as Cliente[];
        return resp;
      })
    );
  }

  public suspenderCliente(cliente:Cliente) : Observable<any> {
    return this.http.post(this.url+"/cli/sus", cliente).pipe(
      map(resp => resp),
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
