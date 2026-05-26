import { registerRouteComponent } from '@vendure/admin-ui/core';
import { AdminHelpComponent } from './components/admin-help/admin-help.component';

export default [
  registerRouteComponent({
    component: AdminHelpComponent,
    path: '',
    title: 'Hilfe & Anleitung',
    breadcrumb: 'Hilfe',
  }),
];
