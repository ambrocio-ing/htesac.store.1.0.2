import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordDto } from 'src/app/modelo/change-pass/change-password-dto';
import { EmailValuesDto } from 'src/app/modelo/change-pass/email-values-dto';
import { JwtDto } from 'src/app/modelo/seguridad/jwtdto/jwt-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url:string = environment.urlBackend+"/auth";
  private url_recovery:string = environment.urlBackend+"/ch-pass";

  private _token!:string | any;
  private _usuario!:JwtDto | any;

  public get token() : string | any {
    if(this._token != null){
      return this._token;
    }
    else if(this._token == null && localStorage.getItem("token") != null){
      this._token = localStorage.getItem("token") as string;
      return this._token; 
    }
    else{
      return null;
    }

  }

  public get usuario() : JwtDto | any {
    if(this._usuario != null){
      return this._usuario;
    }
    else if(this._usuario == null && localStorage.getItem("usuario") != null){
      this._usuario = JSON.parse(localStorage.getItem("usuario") as string) as JwtDto;
      return this._usuario; 
    }
    else{
      return null;
    }

  }

  constructor(private http:HttpClient, private router:Router) { }

  public login(usuarioLogin:any) : Observable<any> {
    return this.http.post(this.url+"/per/login", usuarioLogin).pipe(
      map((resp:any) => {
        resp.jwtDto as JwtDto;
        return resp;
      })
    );
  } 

  public refreshToken(token:string) : Observable<any> {
    return this.http.post(this.url+"/refresh", token);
  } 

  public isAuthenticated() : boolean {
    if(this.usuario != null && this.token != null){
      return true;
    }
    return false;
  }

  public guardarUsuario(dto:JwtDto, token:string) : void {
    this._usuario = new JwtDto();
    this._usuario.id = dto.id;
    this._usuario.documento = dto.documento;
    this._usuario.nombre = dto.nombre;
    this._usuario.email = dto.email;
    this._usuario.fotoPerfil = dto.fotoPerfil;

    this._token = token;

    localStorage.setItem("usuario", JSON.stringify(this._usuario));
    localStorage.setItem("token", this._token);

  }

  public setToken(token:string) : void {
    this._token = token;
    localStorage.setItem("token", this._token);
  }

  public isPresentRolname(rolname:string) : boolean {
    if(this.isAuthenticated()){
      const token:string = this.token;
      const payload:string = token.split(".")[1];
      const payload_decode = atob(payload); 
      const values = JSON.parse(payload_decode);
      const roles:string[] = values.roles;
      const indice = roles.indexOf(rolname);

      if(indice != -1){
        return true;
      }

      return false;            
    }

    return false;    
  }

  public logout() : void {
    localStorage.clear();
    this._token = null;
    this._usuario = null;
    this.router.navigate(['']);
  }

  public generarPassword(dto:EmailValuesDto) : Observable<any> {
    return this.http.post(this.url_recovery+"/send-email", dto);
  }

  public changePassword(dto:ChangePasswordDto) : Observable<any> {
    return this.http.post(this.url_recovery+"/change-pass", dto);
  }

}
