import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import RouteErrorPage from './RouteErrorPage';
import { resolvedRouteRegistry } from './routeRegistry';
import RegistryRouteElement from './RegistryRouteElement';

function buildRouteTree(parentId?: string): RouteObject[] {
  return resolvedRouteRegistry
    .filter((route) => route.parentId === parentId)
    .map((route) => {
      const children = buildRouteTree(route.id);
      return {
        id: route.id,
        ...(route.index ? { index: true } : { path: route.path }),
        element: <RegistryRouteElement route={route} />,
        errorElement: <RouteErrorPage />,
        ...(children.length ? { children } : {}),
      } as RouteObject;
    });
}

export const router = createBrowserRouter(buildRouteTree());

export { buildRouteTree };
