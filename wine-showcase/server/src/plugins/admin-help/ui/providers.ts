import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
  addNavMenuSection(
    {
      id: 'admin-help',
      label: 'Hilfe',
      items: [
        {
          id: 'admin-help-guide',
          label: 'Anleitung',
          routerLink: ['/extensions/hilfe'],
          icon: 'help',
        },
      ],
    },
    // Section landet *vor* "settings" am unteren Ende der Sidebar
    'settings',
  ),
];
