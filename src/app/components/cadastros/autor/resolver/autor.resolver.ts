import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Autor } from "../../../../models/autor.model";
import { AutorService } from "../../../../services/autor.service";
import { inject } from "@angular/core";

export const autorResolver: ResolveFn<Autor> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(AutorService).findById(route.paramMap.get('id')!);
    }