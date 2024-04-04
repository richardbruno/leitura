import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LivroComponent } from './components/cadastros/livro/livro.component';
import { ProdutoComponent } from './components/cadastros/produto/produto.component';
import { UsuarioComponent } from './components/cadastros/usuario/usuario.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, title: 'Login'},
    { path: 'livro', component: LivroComponent, title: 'Livro'},
    { path: 'produto', component: ProdutoComponent, title: 'Produto'},
    { path: 'usuario', component: UsuarioComponent, title: 'Usuario'},
];
