import parseGeoJson from './parseGeoJson';
export function decodeEchartsGeoJson (echartsGeoJson) {
    const geoJson = {...echartsGeoJson,features:parseGeoJson(echartsGeoJson),};
    return geoJson;
}