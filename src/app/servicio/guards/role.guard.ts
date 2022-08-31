import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    let roles = route.data["roles"] as string[];
    const size = roles.length;

    switch (size) {
      case 1:
        if (this.loginService.isPresentRolname(roles[0])) {
          return true;
        }
        break;
      case 2:
        if (this.loginService.isPresentRolname(roles[0]) || this.loginService.isPresentRolname(roles[1])) {
          return true;
        }
    }

    Swal.fire('Acceso denegado', `Hola ${this.loginService.usuario.nombre} no tienes acceso`, 'warning');
    this.router.navigate(['/inicio']);
    return false;
  }

}
