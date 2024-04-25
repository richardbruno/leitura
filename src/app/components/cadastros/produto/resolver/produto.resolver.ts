import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Produto } from "../../../../models/produto.model";
import { LuminariaService } from "../../../../services/Luminaria.service" ;
import { inject } from "@angular/core";

export const produtoResolver:  ResolveFn<Produto> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(LuminariaService).findById(route.paramMap.get('id')!);
    }