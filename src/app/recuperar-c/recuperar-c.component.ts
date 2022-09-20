import { Component, OnInit } from '@angular/core';
import { EmailValuesDto } from '../modelo/change-pass/email-values-dto';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-recuperar-c',
  templateUrl: './recuperar-c.component.html',
  styleUrls: ['./recuperar-c.component.css']
})
export class RecuperarCComponent implements OnInit {

  dto:EmailValuesDto = new EmailValuesDto();
  successfulMessageMail!:string;
  errMessageMail!:string;

  preloader:boolean = false;

  constructor(private loginService:LoginService) { }

  ngOnInit(): void {

  }

  enviar() : void {
    if(this.dto.mailTo != null){
      this.preloader = true;
      this.dto.typeUser = "Admin";
      this.loginService.generarPassword(this.dto).subscribe(resp => {
        this.preloader = false;
        this.successfulMessageMail = resp.mensaje;
        this.dto = new EmailValuesDto();
        this.errMessageMail = "";
      }, err => {
        this.preloader = false;
        this.successfulMessageMail = "";
        if(err.status == 404 || err.status == 500){
          this.errMessageMail = err.error.mensaje;
        }
        else{
          this.errMessageMail = "No fue posible enviar petición, por favor intentelo mas tarde";
        }       
        
      });
    }
    else{
      this.successfulMessageMail = "";
      this.errMessageMail = "Ingrese correo o usuario para continuar";
    }
    
  }
  
}
