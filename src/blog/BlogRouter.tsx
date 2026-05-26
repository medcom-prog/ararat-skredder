/**
 * medcom-seo-managed — do not edit. Managed by Medcom portal.
 * Generated: Blog infrastructure installer.
 */
import { Routes, Route } from 'react-router-dom';
import { BlogIndex } from './BlogIndex';
import { BlogPost } from './BlogPost';

export function BlogRouter() {
  return (
    <Routes>
      <Route index element={<BlogIndex />} />
      <Route path=":slug" element={<BlogPost />} />
    </Routes>
  );
}
