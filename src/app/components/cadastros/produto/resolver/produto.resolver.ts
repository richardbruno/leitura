import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Produto } from "../../../models/produto.model";
import { ProdutoService } from "../../../services/produto.service";
import { inject } from "@angular/core";

export const livroResolver: ResolveFn<Produto> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(ProdutoService).findById(route.paramMap.get('id')!);
    }