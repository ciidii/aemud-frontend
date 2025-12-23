import {Routes} from "@angular/router";
import {ConfigurationPageComponent} from "./pages/configuration-page/configuration-page.component";

export const CONFIG_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationPageComponent,
    title: 'Paramétrage de l\'application'
  },
];
