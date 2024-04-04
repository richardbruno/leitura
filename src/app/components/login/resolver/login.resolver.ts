import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Login } from "../../../models/login.model";
import { LoginService } from "../../../services/login.service";
import { inject } from "@angular/core";

export const loginResolver: ResolveFn<Login> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(LoginService).findById(route.paramMap.get('id')!);
    }