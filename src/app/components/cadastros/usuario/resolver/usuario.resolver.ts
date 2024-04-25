import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Usuario } from "../../../../models/usuario.model";
import { UsuarioService } from "../../../../services/usuario.service";
import { inject } from "@angular/core";

export const usuarioResolver: ResolveFn<Usuario> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(UsuarioService).findById(route.paramMap.get('id')!);
    }