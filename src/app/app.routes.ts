import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LivroComponent } from './components/cadastros/livro/livro.component';
import { ProdutoComponent } from './components/cadastros/produto/produto.component';
import { UsuarioComponent } from './components/cadastros/usuario/usuario.component';
import { LivroListComponent } from './components/cadastros/livro/livro-list/livro-list.component';
import { ProdutoListComponent } from './components/cadastros/produto/produto-list/produto-list.component';
import { UsuarioListComponent } from './components/cadastros/usuario/usuario-list/usuario-list.component';
import { AutorComponent } from './components/cadastros/autor/autor.component';
import { EditoraComponent } from './components/cadastros/editora/editora.component';
import { EditoraListComponent } from './components/cadastros/editora/editora-list/editora-list.component';
import { livroResolver } from './components/cadastros/livro/resolver/livro.resolver' ; 
import { produtoResolver } from './components/cadastros/produto/resolver/produto.resolver' ; 
import { usuarioResolver } from './components/cadastros/usuario/resolver/usuario.resolver' ; 
import { editoraResolver } from './components/cadastros/editora/resolver/editora.resolver' ; 
import { CorComponent } from './components/cadastros/cor/cor.component';
import { CorListComponent } from './components/cadastros/cor/cor-list/cor-list.component';



export const routes: Routes = [
    { path: 'login', component: LoginComponent, title: 'Login'},
    
    { path: 'livro', component: LivroComponent, title: 'Livro'},
    { path: 'livro/list', component: LivroListComponent, title: 'Lista de Livros'},
    { path: 'livro/edit/:id', component: LivroComponent, resolve: {livro: livroResolver}} , 

    { path: 'produto', component: ProdutoComponent, title: 'Produto'},
    { path: 'produto/list', component: ProdutoListComponent, title: 'Lista de Produtos'},
    { path: 'produto/edit/:id', component: ProdutoComponent, resolve: {produto: produtoResolver}} , 
    { path: 'luminaria', component: ProdutoComponent, title: 'luminaria'},
    { path: 'luminaria/list', component: ProdutoListComponent, title: 'Lista de luminaria'},

    { path: 'usuario', component: UsuarioComponent, title: 'Usuario'},
    { path: 'autor', component: AutorComponent, title: 'Autor'},
    { path: 'usuario/list', component: UsuarioListComponent, title: 'Lista de Usuários'},
    { path: 'usuario/edit/:id', component: UsuarioComponent, resolve: {usuario: usuarioResolver}} , 

    { path: 'editora', component: EditoraComponent, title: 'Editora'},
    { path: 'editora/list', component: EditoraListComponent, title: 'Lista de Editoras'},
    { path: 'editora/edit/:id', component: EditoraComponent, resolve: {editora: editoraResolver}} , 

    { path: 'cor', component: CorComponent, title: 'cor'},
    { path: 'cor/list', component: CorListComponent, title: 'Lista de cor'},


];
