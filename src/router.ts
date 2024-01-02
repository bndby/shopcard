// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill');
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/shopcard-list/shopcard-list.js';

const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
  routes: [
    {
      path: resolveRouterPath(),
      title: 'Home',
      render: () => html`<shopcard-list></shopcard-list>`,
    },
    {
      path: resolveRouterPath('code/:code/:type'),
      title: 'Code',
      plugins: [lazy(() => import('./pages/shopcard-code/shopcard-code.js'))],
      render: ({ params }) =>
        html`<shopcard-code code="${params.code}"></shopcard-code>`,
    },
    {
      path: resolveRouterPath('edit'),
      title: 'New',
      plugins: [lazy(() => import('./pages/shopcard-edit/shopcard-edit.js'))],
      render: () => html`<shopcard-edit></shopcard-edit>`,
    },
    {
      path: resolveRouterPath('edit/:code'),
      title: 'Edit',
      plugins: [lazy(() => import('./pages/shopcard-edit/shopcard-edit.js'))],
      render: ({ params }) =>
        html`<shopcard-edit code="${params.code}"></shopcard-edit>`,
    },
  ],
});

// This function will resolve a path with whatever Base URL was passed to the vite build process.
// Use of this function throughout the starter is not required, but highly recommended, especially if you plan to use GitHub Pages to deploy.
// If no arg is passed to this function, it will return the base URL.

export function resolveRouterPath(unresolvedPath?: string) {
  var resolvedPath = baseURL;
  if (unresolvedPath) {
    resolvedPath = resolvedPath + unresolvedPath;
  }

  return resolvedPath;
}

