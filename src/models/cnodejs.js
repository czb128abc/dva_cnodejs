import * as cnodejsService from '../services/cnodejs';

const model = {
  namespace:'cnodejs',
  state: {
    topicMap: {
      ask: {
        list: []
      },
      share: {
        list: []
      },
      job: {
        list: []
      },
      good: {
        list: []
      }
    }
  },
  reducers: {
    setTopic(state, {payload}) {
      const {tab, list} = payload;
      const obj = {
        topicMap:{
          [tab]: {list}
        }
      };

      const newS = Object.assign({},state, obj);
      return newS;
    }
  },
  effects: {
    * queryTopicsByType(action, saga) {
      const {data} = yield saga.call(cnodejsService.queryTopicsByType,action.payload);
      yield saga.put({
        type: 'setTopic',
        payload: {
          tab:action.payload.tab,
          list: data.data,
        }
      })
    }
  },
};

export default model;
