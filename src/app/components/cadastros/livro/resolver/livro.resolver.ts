import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Livro } from "../../../../models/livro.model";
import { LivroService } from "../../../../services/livro.service" ;
import { inject } from "@angular/core";

export const livroResolver:   ResolveFn<Livro> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(LivroService).findById(route.paramMap.get('id')!);
    }