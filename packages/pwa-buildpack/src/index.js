const magentoLayoutLoader = require('./magento-layout-loader');
const Utilities = require('./Utilities');
const WebpackTools = require('./WebpackTools');
module.exports = {
    magentoLayoutLoader,
    ...Utilities,
    ...WebpackTools,
    Utilities,
    WebpackTools
};
