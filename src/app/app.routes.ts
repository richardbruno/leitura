import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LivroComponent } from './components/cadastros/livro/livro.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent, title: 'Login'},
    { path: 'livro', component: LivroComponent, title: 'Livro'},
];
