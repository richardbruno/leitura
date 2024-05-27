import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LivroListComponent } from './components/cadastros/livro/livro-list/livro-list.component';
import { ProdutoListComponent } from './components/cadastros/produto/produto-list/produto-list.component';
import { UsuarioListComponent } from './components/cadastros/usuario/usuario-list/usuario-list.component';
import { EditoraListComponent } from './components/cadastros/editora/editora-list/editora-list.component';
import { livroResolver } from './components/cadastros/livro/resolver/livro.resolver' ; 
import { produtoResolver } from './components/cadastros/produto/resolver/produto.resolver' ; 
import { usuarioResolver } from './components/cadastros/usuario/resolver/usuario.resolver' ; 
import { editoraResolver } from './components/cadastros/editora/resolver/editora.resolver' ; 
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { ConsultaCardListComponent } from './components/consulta-card-list/consulta-card-list.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';
import { LivroFormComponent } from './components/cadastros/livro/livro-form/livro-form.component';
import { EditoraFormComponent } from './components/cadastros/editora/editora-form/editora-form.component';
import { ProdutoFormComponent } from './components/cadastros/produto/produto-form/produto-form.component';
import { UsuarioFormComponent } from './components/cadastros/usuario/usuario-form/usuario-form.component';
import { PerfilFormComponent } from './components/perfil/perfil-form.component';
import { EditSenhaFormComponent } from './components/perfil/editSenha/editSenha.component';


export const routes: Routes = [
    // { path: 'login', component: LoginComponent, title: 'Login'},
    
    // { path: 'livro', component: LivroComponent, title: 'Livro'},
    // { path: 'livro/list', component: LivroListComponent, title: 'Lista de Livros'},
    // { path: 'livro/edit/:id', component: LivroComponent, resolve: {livro: livroResolver}} , 

    // { path: 'produto', component: ProdutoComponent, title: 'Produto'},
    // { path: 'produto/list', component: ProdutoListComponent, title: 'Lista de Produtos'},
    // { path: 'produto/edit/:id', component: ProdutoComponent, resolve: {produto: produtoResolver}} , 
    // { path: 'luminaria', component: ProdutoComponent, title: 'luminaria'},
    // { path: 'luminaria/list', component: ProdutoListComponent, title: 'Lista de luminaria'},

    // { path: 'usuario', component: UsuarioComponent, title: 'Usuario'},
    // { path: 'autor', component: AutorComponent, title: 'Autor'},
    // { path: 'usuario/list', component: UsuarioListComponent, title: 'Lista de Usuários'},
    // { path: 'usuario/edit/:id', component: UsuarioComponent, resolve: {usuario: usuarioResolver}} , 

    // { path: 'editora', component: EditoraComponent, title: 'Editora'},
    // { path: 'editora/list', component: EditoraListComponent, title: 'Lista de Editoras'},
    // { path: 'editora/edit/:id', component: EditoraComponent, resolve: {editora: editoraResolver}} , 

    // { path: 'cor', component: CorComponent, title: 'cor'},
    // { path: 'cor/list', component: CorListComponent, title: 'Lista de cor'},


    { 
        path: '', 
        component: UserTemplateComponent, 
        title: 'e-commerce',
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'livros'},

            { path: 'livros', component: ConsultaCardListComponent, title: 'Livros à Venda'},
            { path: 'login', component: LoginComponent, title: 'Login'},
            { path: 'carrinho', component: CarrinhoComponent, title: 'Carrinho de Compras'},

            { path: 'perfil', component: PerfilFormComponent, title: 'Perfil de Usuário'},
            { path: 'perfil/editpass', component: EditSenhaFormComponent, title: 'Alterar Senha'},
        ]

    },
    { 
        path: 'admin', 
        component: AdminTemplateComponent, 
        title: 'e-commerce',
        children: [
            {path: '', pathMatch: 'full', redirectTo: 'livros'},
        
            { path: 'livros', component: LivroListComponent, title: 'Lista de Livros'},
            { path: 'livros/new', component: LivroFormComponent, title: 'Novo Livro'},
            { path: 'livros/edit/:id', component: LivroFormComponent, resolve: {livro: livroResolver}},
        
            { path: 'editoras', component: EditoraListComponent, title: 'Lista de Editoras'},
            { path: 'editoras/new', component: EditoraFormComponent, title: 'Nova Editora'},
            { path: 'editoras/edit/:id', component: EditoraFormComponent, resolve: {editora: editoraResolver}},
        
            { path: 'produtos', component: ProdutoListComponent, title: 'Lista de Produtos'},
            { path: 'produtos/new', component: ProdutoFormComponent, title: 'Novo Produto'},
            { path: 'produtos/edit/:id', component: ProdutoFormComponent, resolve: {produto: produtoResolver}},

            { path: 'usuarios', component: UsuarioListComponent, title: 'Lista de Usuários'},
            { path: 'usuarios/new', component: UsuarioFormComponent, title: 'Novo Usuário'},
            { path: 'usuarios/edit/:id', component: UsuarioFormComponent, resolve: {usuario: usuarioResolver}},
        ]

    },

];