import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LivroComponent } from './components/cadastros/livro/livro.component';
import { ProdutoComponent } from './components/cadastros/produto/produto.component';
import { UsuarioComponent } from './components/cadastros/usuario/usuario.component';
import { LivroListComponent } from './components/cadastros/livro/livro-list/livro-list.component';
import { ProdutoListComponent } from './components/cadastros/produto/produto-list/produto-list.component';
import { UsuarioListComponent } from './components/cadastros/usuario/usuario-list/usuario-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, title: 'Login'},
    
    { path: 'livro', component: LivroComponent, title: 'Livro'},
    { path: 'livro/list', component: LivroListComponent, title: 'Lista de Livros'},

    { path: 'produto', component: ProdutoComponent, title: 'Produto'},
    { path: 'produto/list', component: ProdutoListComponent, title: 'Lista de Produtos'},

    { path: 'usuario', component: UsuarioComponent, title: 'Usuario'},
    { path: 'usuario/list', component: UsuarioListComponent, title: 'Lista de Usuários'},
];
