import { Routes } from '@angular/router';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { Adherant } from './Dashboard/adherant/adherant';
import { App } from './app';
import { PlanningReservation } from './Dashboard/plannign-reservation/plannign-reservation';
import { InscriptionComponent } from './Dashboard/inscription/inscription';
import { PremiumComponent } from './Dashboard/premium/premium';
import { NutritionComponent } from './Dashboard/nutrition/nutrition';
import { HealthComponent } from './Dashboard/health/health';

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
component:PlanningReservation
},
{
path:'inscription',
component:InscriptionComponent
},
{
path:'premium',
component:PremiumComponent
},
{
path:'nutrition',
component:NutritionComponent
},
{
path:'health',
component:HealthComponent
},
{
path:'',
redirectTo:'dashboard',
pathMatch :'full'
}

];
