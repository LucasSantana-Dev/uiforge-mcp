import type { IComponentLibrary } from '../types.js';

export const COMPONENT_LIBRARIES: readonly IComponentLibrary[] = [
  {
    name: 'shadcn/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS. Copy-paste, not a dependency.',
    frameworks: ['react', 'nextjs'],
    installPackage: {
      react: 'npx shadcn@latest init',
      nextjs: 'npx shadcn@latest init',
    },
    docsUrl: 'https://ui.shadcn.com',
    features: ['accessible', 'customizable', 'open-source', 'copy-paste', 'dark-mode', 'tailwind-css'],
    recommended: true,
  },
  {
    name: 'Material UI',
    description: 'Comprehensive React component library implementing Google Material Design.',
    frameworks: ['react', 'nextjs'],
    installPackage: {
      react: '@mui/material @emotion/react @emotion/styled',
      nextjs: '@mui/material @emotion/react @emotion/styled @mui/material-nextjs',
    },
    docsUrl: 'https://mui.com',
    features: ['accessible', 'theming', 'responsive', 'enterprise-ready', 'large-ecosystem'],
    recommended: false,
  },
  {
    name: 'Ant Design',
    description: 'Enterprise-class UI design language and React component library.',
    frameworks: ['react', 'nextjs'],
    installPackage: {
      react: 'antd',
      nextjs: 'antd',
    },
    docsUrl: 'https://ant.design',
    features: ['enterprise', 'i18n', 'theming', 'form-validation', 'data-tables', 'accessible'],
    recommended: false,
  },
  {
    name: 'Flowbite React',
    description: 'Open-source UI component library built on Tailwind CSS with React support.',
    frameworks: ['react', 'nextjs'],
    installPackage: {
      react: 'flowbite-react',
      nextjs: 'flowbite-react',
    },
    docsUrl: 'https://flowbite-react.com',
    features: ['tailwind-css', 'dark-mode', 'accessible', 'responsive', 'open-source'],
    recommended: false,
  },
  {
    name: 'PrimeVue',
    description: 'Rich set of open-source UI components for Vue 3.',
    frameworks: ['vue'],
    installPackage: {
      vue: 'primevue',
    },
    docsUrl: 'https://primevue.org',
    features: ['accessible', 'theming', 'responsive', 'enterprise-ready', 'tailwind-css'],
    recommended: true,
  },
  {
    name: 'Vuetify',
    description: 'Material Design component framework for Vue.js.',
    frameworks: ['vue'],
    installPackage: {
      vue: 'vuetify',
    },
    docsUrl: 'https://vuetifyjs.com',
    features: ['material-design', 'accessible', 'responsive', 'i18n', 'enterprise-ready'],
    recommended: false,
  },
  {
    name: 'Angular Material',
    description: 'Official Material Design components for Angular.',
    frameworks: ['angular'],
    installPackage: {
      angular: '@angular/material @angular/cdk',
    },
    docsUrl: 'https://material.angular.io',
    features: ['material-design', 'accessible', 'responsive', 'official', 'cdk'],
    recommended: true,
  },
  {
    name: 'PrimeNG',
    description: 'Rich set of open-source UI components for Angular.',
    frameworks: ['angular'],
    installPackage: {
      angular: 'primeng',
    },
    docsUrl: 'https://primeng.org',
    features: ['accessible', 'theming', 'responsive', 'enterprise-ready', 'data-tables'],
    recommended: false,
  },
] as const;

export function getComponentLibrariesForFramework(framework: string): IComponentLibrary[] {
  return COMPONENT_LIBRARIES.filter((lib) => lib.frameworks.includes(framework));
}

export function getRecommendedLibrary(framework: string): IComponentLibrary | undefined {
  return COMPONENT_LIBRARIES.find((lib) => lib.frameworks.includes(framework) && lib.recommended);
}
