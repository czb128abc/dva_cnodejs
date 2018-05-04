// import { decodeEchartsGeoJson } from './index'
const fs = require('fs');
const path = require('path');


function readDirFiles(pwd) {
    const files = fs.readdirSync(pwd);
    return files.reduce((a, b) => {
        if (b.includes('.json')) {
            const bPath = path.join(pwd, b);
            if (fs.statSync(bPath).isDirectory()) {
                return [
                    ...a,
                    ...readDirFiles(bPath),
                ];
            } else {
                return [
                    ...a,
                    // eslint-disable-next-line import/no-dynamic-require
                    path.join(pwd, b),
                ];
            }
        } else {
            return a;
        }
    }, []);
}
function main() {
    const files = readDirFiles(path.resolve(process.cwd(), 'src/json'));
    console.log(files);
    console.log(require(files[0]))
}

main();
