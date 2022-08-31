import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reclamo } from 'src/app/modelo/reclamo/reclamo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {

  cbPaginar:EventEmitter<number> = new EventEmitter();

  private url:string = environment.urlBackend+"/reclamo/re";

  constructor(private http:HttpClient) { }

  public listarTodo(page:number) : Observable<any> {
    return this.http.get(this.url+"/all/"+page).pipe(
      map((resp:any) => {
        resp.content as Reclamo[];
        return resp;
      })
    );
  }

}
