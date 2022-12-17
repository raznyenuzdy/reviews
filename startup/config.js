const config = {
    blocksMaxThreshold: 20, //maximum allowed count of downloaded blocks
    commentsDepth: 4, //maximal visual indent at tree depth, after this depth will be no tree structure
    minimalTimeout: 5, //5 minutes during this user can edit or delete own post
    refreshTimeInterval: (e) => (e * 10 + 10) * 60 * 1000,
}

export default config;