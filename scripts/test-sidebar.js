import assert from 'node:assert';
import { renderAdminSidebar } from '../src/admin/components/sidebar.js';

console.log('🧪 Testing Admin Sidebar External Link...');

const html = renderAdminSidebar('overview');

// 1. Must contain the Near.tl URL
assert(
  html.includes('href="https://near.tl/wisatatampirkulon"'),
  'Sidebar should contain link to https://near.tl/wisatatampirkulon'
);

// 2. Must contain the label "Formulir Kesehatan"
assert(
  html.includes('Formulir Kesehatan'),
  'Sidebar should display label "Formulir Kesehatan"'
);

// 3. Must open in new tab with security attributes
assert(
  html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'),
  'External link must have target="_blank" and rel="noopener noreferrer"'
);

// 4. Must render medical_services icon and open_in_new indicator
assert(
  html.includes('medical_services'),
  'External link should use medical_services icon'
);
assert(
  html.includes('open_in_new'),
  'External link should display open_in_new icon'
);

// 5. External link must NOT be marked active
assert(
  !html.includes('active" href="https://near.tl/wisatatampirkulon"'),
  'External link should never have active class'
);

console.log('✅ All sidebar external link assertions passed!');
