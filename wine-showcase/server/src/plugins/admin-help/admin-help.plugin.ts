import * as path from 'path';
import { fileURLToPath } from 'url';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

@VendurePlugin({
  imports: [PluginCommonModule],
  compatibility: '^3.0.0',
})
export class AdminHelpPlugin {
  static ui: AdminUiExtension = {
    id: 'admin-help-ui',
    extensionPath: path.join(__dirname, 'ui'),
    routes: [{ route: 'hilfe', filePath: 'routes.ts' }],
    providers: ['providers.ts'],
  };
}
