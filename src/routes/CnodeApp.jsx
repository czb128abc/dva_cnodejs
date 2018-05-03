import React from 'react';
import PropTypes from 'prop-types';
import D3Chart from '../components/d3/D3Chart';
import { connect } from 'dva';

import TopicList from '../components/cnodejs/TopicList';

class CnodeApp extends React.Component {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cnodejs/queryTopicsByType',
      payload: { tab: 'share' },
    });
  }

  render() {
    const { topicMap } = this.props;
    const list = topicMap.share.list;
    return (
      <div>
        <TopicList
          list={list}
          key='share'
        />
        <D3Chart />
      </div>
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
  return { topicMap };
};

export default connect(mapStateToProps)(CnodeApp)
