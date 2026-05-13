import { Routes } from '@angular/router';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { Adherant } from './Dashboard/adherant/adherant';
import { App } from './app';
import { PlannignReservation } from './Dashboard/plannign-reservation/plannign-reservation';

export const routes: Routes = [
 
{
path:'dashboard',
component:Dashboard
},
{
path:'adherent',
component:Adherant
},
{
path:'planning-reservation',
component:PlannignReservation
}
,
{
path:'',
redirectTo:'dashboard',
pathMatch :'full'
}

];
