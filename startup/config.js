const config = {
    blocksMaxThreshold: 20, //maximum allowed count of downloaded blocks
    commentsDepth: 4, //maximal visual indent at tree depth, after this depth will be no tree structure
    minimalTimeout: 5, //5 minutes during this user can edit or delete own post
    refreshTimeInterval: (e) => (e * 10 + 10) * 60 * 1000,
    metaIndex : {
        title: "Index page title",
        description: "index page description",
        keywords: "reviews,claims",
        robots: "noindex,nofollow"
    },
    indexPageLinkName: "Reviews home page",
    indexPageLinkAlt: "Reviews, ads and more at home page",
    robotsIndex : {
        title: "Default title for page",
        description: "Default descr of page",
        keywords: "page,robots",
        robots: "noindex,nofollow"
    }
}

export default config;