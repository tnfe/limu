// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const HEL_GIT = 'https://github.com/tnfe/limu';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'limu',
  tagline: '更快更好用的不可变数据js库',
  // url: 'https://your-docusaurus-test-site.com',
  // baseUrl: '/',
  url: 'https://tnfe.github.io',
  baseUrl: '/limu/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/limu.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['en', 'zh-Hans'],
    path: 'i18n',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/tnfe/hel/doc',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'http://localhost:3000/hel/blog',
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
        title: 'limu',
        logo: {
          alt: 'limu-logo',
          src: 'https://user-images.githubusercontent.com/7334950/253809392-40426760-bb02-43fc-a5bb-f1fd369bb8e6.png',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'api',
            label: 'api',
            docId: 'docs/api/intro',
          },
          {
            type: 'docSidebar', // docSidebar
            position: 'left',
            sidebarId: 'changelog', // foldername
            label: '日志', // navbar title
            docId: 'changelog',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: HEL_GIT,
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/tutorial/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: '议题',
                href: 'https://github.com/tnfe/hel/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: '更新日志',
                to: '/docs/changelog/intro',
              },
              {
                label: 'GitHub',
                href: HEL_GIT,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tencent PCG TNTWeb.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

if (process.env.IS_LOCAL === 'true') {
  /** @type any */
  const navbar = config.themeConfig ? config.themeConfig.navbar : [];
  navbar.items.push(
    {
      type: 'docSidebar',
      position: 'left',
      sidebarId: 'tutorial-basics',
      label: 'tutorial-basics',
    },
    {
      type: 'docSidebar',
      position: 'left',
      sidebarId: 'tutorial-extras',
      label: 'tutorial-extras',
    },
  );
}

module.exports = config;
