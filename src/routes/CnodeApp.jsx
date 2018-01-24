import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';

import TopicList from '../components/cnodejs/TopicList';

class CnodeApp extends React.Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'cnodejs/queryTopicsByType',
      payload: {tab: 'share'},
    });
  }

  render() {
    const {topicMap} = this.props;
    const list = topicMap.share.list;
    console.log('list',list);
    return(
      <TopicList
        list={list}
        key='share'
      />
    )
  }
}

CnodeApp.propType = {
  topicMap: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  const topicMap = state.cnodejs.topicMap;
  return {topicMap};
};

export default connect(mapStateToProps)(CnodeApp)
