import type { ComponentType, LazyExoticComponent } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export type RouteAccessPolicy =
  | { type: 'public' }
  | { type: 'authenticated' }
  | {
      type: 'permissions';
      mode: 'any' | 'all';
      permissions: readonly string[];
      fallbackRoles?: readonly string[];
    };

export interface RouteMenuMetadata {
  label: string;
  group: string;
  order: number;
  icon: ComponentType<SvgIconProps>;
}

export interface RouteBreadcrumbMetadata {
  label: string;
  include?: boolean;
}

export interface AppRouteDefinition {
  id: string;
  parentId?: string;
  path?: string;
  index?: boolean;
  access: RouteAccessPolicy;
  load?: () => Promise<{ default: ComponentType }>;
  redirectTo?: string;
  menu?: RouteMenuMetadata;
  breadcrumb?: RouteBreadcrumbMetadata;
  title?: string;
}

export interface ResolvedAppRoute extends AppRouteDefinition {
  fullPath: string;
  lazyComponent?: LazyExoticComponent<ComponentType>;
}
