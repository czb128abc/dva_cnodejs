import request from '../utils/request';
const baseUrl = 'https://cnodejs.org';

export function queryTopicsByType({ page = 1, tab = 'share', limit = 10 }) {
    return request(`${baseUrl}/api/v1/topics?tab=${tab}&page=${page}&limit=${limit}`, {
        method: 'GET',
    })
}
