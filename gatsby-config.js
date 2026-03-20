require(`dotenv`).config()

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteTitle: `Pregnancy Tracker`,
    siteTitleAlt: `Pregnancy Tracker`,
    siteHeadline: `Pregnancy Week Tracker`,
    siteUrl: `https://pg.gatsbyjs.io/`,
    siteDescription: `A configurable pregnancy week tracker supporting IVF and natural conception`,
    siteImage: `/banner.jpg`,
    author: `@rmw`,
  },
  trailingSlash: `never`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-cara`,
      // See the theme's README for all available options
      options: {},
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Pregnancy Tracker`,
        short_name: `Pregnancy Tracker`,
        description: `A configurable pregnancy week tracker supporting IVF and natural conception`,
        start_url: `/`,
        background_color: `#141821`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        analyzerMode: `static`,
        reportFilename: `_bundle.html`,
        openAnalyzer: false,
      },
    },
  ].filter(Boolean),
}
