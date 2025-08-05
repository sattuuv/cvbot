module.exports = {
  normalizeTikTokUrl: (url) => {
    const regex = /(?:tiktok\.com\/(?:@[\w\d._-]+\/)?video\/(\d+))/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.tiktok.com/video/${match[1]}/`;
    }
    return null;
  }
};
