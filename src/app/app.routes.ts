import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Layout } from './components/layout/layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Immobilien } from './components/immobilien/immobilien';
import { Kontakte } from './components/kontakte/kontakte';
import { Beziehungen } from './components/beziehungen/beziehungen';
import { KontaktDetail } from './components/kontakt-detail/kontakt-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,

    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'immobilien', component: Immobilien },
      { path: 'kontakte', component: Kontakte },
       { path: 'kontakt-detail/:id', component: KontaktDetail },
      { path: 'beziehungen', component: Beziehungen }
    ]
  }
];
