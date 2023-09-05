import { createHashRouter, RouteObject } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { EditorPage } from '@/pages/EditorPage';
import { RouteObjectParser } from './types';

export type Routes = (typeof routes)[number];
export type PathPatterns = RouteObjectParser<Routes>;
export type StaticPaths = '/' | Exclude<PathPatterns, `${string}/:${string}`>;

/**
 * !!! Note:
 * Make sure `as const` added in the `path` property
 */
const routes = [
  {
    path: '' as const,
    Component: MainLayout,
    children: [
      {
        path: '' as const,
        Component: HomePage
      },
      {
        path: '/editor/:title/:id' as const,
        Component: EditorPage
      },
      {
        path: '*' as const,
        element: <NotFoundPage />
      }
    ]
  }
] satisfies RouteObject[];

export const router = createHashRouter(routes);
