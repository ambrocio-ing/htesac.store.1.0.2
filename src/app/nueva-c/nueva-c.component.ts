import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordDto } from '../modelo/change-pass/change-password-dto';
import { LoginService } from '../servicio/login/login.service';

@Component({
  selector: 'app-nueva-c',
  templateUrl: './nueva-c.component.html',
  styleUrls: ['./nueva-c.component.css']
})
export class NuevaCComponent implements OnInit {

  dto:ChangePasswordDto = new ChangePasswordDto();
  successfulMessage!:string;
  errMessage!:string;

  constructor(private router: Router, 
    private activatedRoute:ActivatedRoute,
    private loginService:LoginService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      const token = params.get('token');
      if(token != null){
        this.dto.tokenPassword = token;
      }
    });

  }
  
  confirmar() : void {
    if(this.dto.password != null && this.dto.confirmPassword != null 
      && this.dto.tokenPassword != null){

      this.loginService.changePassword(this.dto).subscribe(resp => {
        this.successfulMessage = resp.mensaje;
        this.errMessage = "";
        this.dto = new ChangePasswordDto();
      }, err => {
        this.successfulMessage = "";
        if(err.status == 404 || err.status == 500){
          this.errMessage = err.error.mensaje
        }
        else{
          this.errMessage = "No fue posible enviar confirmación, por favor inténtelo mas tarde";
        }
      });

    }
    else{
      this.successfulMessage = "";
      this.errMessage = "Datos incompletos, ingrese los campos pedidos o refresque la página";
    }
  }

}
