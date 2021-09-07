const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'Golf4Bob Documentation Site',
  tagline: 'OK, but how much of this will you actually read?',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'rajanphadnis', // Usually your GitHub org/user name.
  projectName: 'Golf_Event_Platform', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/rajanphadnis/Golf_Event_Platform/edit/main/site-documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Reference',
        logo: {
          alt: 'Golf4Bob Reference',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Documentation',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Intro',
                to: '/docs/intro',
              },
              {
                label: 'Main Site',
                to: '/docs/main-site/overview',
              },
              {
                label: 'Admin Site',
                to: '/docs/admin-site/overview',
              },
              {
                label: 'Backend',
                to: '/docs/backend/services-overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com',
              },
              {
                label: 'Instagram',
                href: 'https://instagram.com',
              },
              {
                label: 'Facebook',
                href: 'https://facebook.com',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/rajanphadnis/Golf_Event_Platform',
              },
              {
                label: 'Admin Site',
                href: 'https://admin-golf-event-site--dev-v1w2rkn2.web.app/',
              },
              {
                label: 'Main Site',
                href: 'https://golf-event-platform--dev-u2suwtdi.web.app/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Golf4Bob. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
