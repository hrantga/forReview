const isProduction = (window.backofficeData && window.backofficeData.hotelId);
const hotelId = isProduction ?  window.backofficeData.hotelId : '48518';
const headerSettings = isProduction ? {} : {
  'Auth-bypass-userId':  317
}
if (window.wpApiSettings) {
  headerSettings['X-WP-Nonce'] = window.wpApiSettings.nonce
}
const isDevelopment = window.location.href.indexOf('http://localhost') === 0;
let currentProtocol = window.location.href.split(':')[0];
currentProtocol = currentProtocol === 'file' ? 'https' : currentProtocol;
const protocol = isDevelopment ? 'https' : currentProtocol;
const host = window.location.host !== "localhost:3000" ? window.location.host :  'dev.innwaze.com';
const ROOT_URL = `${protocol}://${host}/wp-json/v1/backoffice`;

const exportData = {
  hotelId,
  headerSettings,
  isDevelopment,
  isProduction,
  ROOT_URL
};

export {
  hotelId,
  headerSettings,
  isDevelopment,
  isProduction,
  ROOT_URL
}

export default exportData;
