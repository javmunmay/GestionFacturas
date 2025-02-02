import { Routes } from '@angular/router';
import { PrincipalComponent } from './component/principal/principal.component';
import { ListaDetalleComponent } from './component/lista-detalle/lista-detalle.component';

export const routes: Routes = [

    {
        path:"",
        component: PrincipalComponent
      },
      {
        path:"facturaInfo-add/:id/:numero",
        component: ListaDetalleComponent
      
      }
];
