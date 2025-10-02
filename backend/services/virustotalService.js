const axios = require('axios');
require('dotenv').config();

const VT_API_KEY = process.env.VT_API_KEY;
const BASE_URL = 'https://www.virustotal.com/api/v3';

async function enrichIoC(iocValue, iocType) {
  try {
    let url = '';

    switch(iocType) {
      case 'ip':
        url = `${BASE_URL}/ip_addresses/${iocValue}`;
        break;
      case 'domain':
        url = `${BASE_URL}/domains/${iocValue}`;
        break;
      case 'url':
        url = `${BASE_URL}/urls`;
        break;
      case 'hash':
        url = `${BASE_URL}/files/${iocValue}`;
        break;
      default:
        throw new Error('Invalid IoC type');
    }

    const headers = { 'x-apikey': VT_API_KEY };

    let response;

    if(iocType === 'url') {
      // For URLs, we need to submit the URL first to get the analysis ID
      const submitRes = await axios.post(url, { url: iocValue }, { headers });
      const analysisId = submitRes.data.data.id;
      response = await axios.get(`${BASE_URL}/analyses/${analysisId}`, { headers });
    } else {
      response = await axios.get(url, { headers });
    }

    return response.data.data;
  } catch(err) {
    console.error('VirusTotal error:', err.response?.data || err.message);
    return null;
  }
}

module.exports = { enrichIoC };
