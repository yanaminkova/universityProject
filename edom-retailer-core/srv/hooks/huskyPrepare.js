// as by https://typicode.github.io/husky/#/?id=with-a-custom-script
const isCi = process.env.CI || process.env.BUILD_ID;
if (!isCi) {
    // eslint-disable-next-line
    require('husky').install();
}
