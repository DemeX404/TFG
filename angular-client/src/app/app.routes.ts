import { Routes } from '@angular/router';
import { TestComponent } from './componentes/test/test.component';
import { UserInfoComponent } from './shared/user-info/user-info.component';
import { LoginComponent } from './componentes/login/login.component';

export const routes: Routes = [
    {path: 'dev', component: UserInfoComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', component: TestComponent}
];
