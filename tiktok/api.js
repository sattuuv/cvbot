const axios = require('axios');
const { rapidApiKey, rapidApiHost } = require('../config');

const baseHeaders = {
  'x-rapidapi-key': rapidApiKey,
  'x-rapidapi-host': rapidApiHost,
};

async function getUser(username) {
  const url = `https://${rapidApiHost}/user/${username}`;
  const response = await axios.get(url, { headers: baseHeaders });
  return response.data;
}

async function getVideo(videoId) {
  const url = `https://${rapidApiHost}/video/${videoId}`;
  const response = await axios.get(url, { headers: baseHeaders });
  return response.data;
}

async function getMusic(musicId) {
  const url = `https://${rapidApiHost}/music/${musicId}`;
  const response = await axios.get(url, { headers: baseHeaders });
  return response.data;
}

module.exports = { getUser, getVideo, getMusic };
