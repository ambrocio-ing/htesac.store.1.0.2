import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { JwtDto } from '../modelo/seguridad/jwtdto/jwt-dto';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuarioLogin:any = {usernameOrEmail:null,password:null};
  errMessageLogin!:string;

  constructor(private router: Router, public loginService:LoginService) { }

  ngOnInit(): void {
    if(this.loginService.isAuthenticated()){
      this.router.navigate(['/inicio']);
    }
  }

  iniciarSesion() : void {
    if(this.usuarioLogin.usernameOrEmail != null && this.usuarioLogin.password != null){
      this.loginService.login(this.usuarioLogin).subscribe(resp => {
        console.log("LOGIN*******", resp);
        if(resp.estado){
          let jwtdto:JwtDto = new JwtDto();
          jwtdto = resp.jwtDto;
          const token:string = resp.token;
          this.loginService.guardarUsuario(jwtdto, token);
          this.router.navigate(['inicio']);
        }
        else{
          this.errMessageLogin = resp.mensaje;
        }     

      });
    }
    else{
      Swal.fire({
        icon:'info',
        text:'Datos incompletos, llene los campos requeridos para continuar'
      });
    }
  }

  recuperarPassword() : void {

  }
  
}
