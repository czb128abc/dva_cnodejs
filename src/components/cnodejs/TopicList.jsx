import React from 'react';
import { List } from 'antd';

const TopicList = ({key, list}) => (
  <List
    dataSource={list}
    renderItem={(item) => (
      <List.Item>{item.title}</List.Item>
    )}
  />
);

export default  TopicList;
