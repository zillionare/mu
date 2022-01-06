import { Line } from '@ant-design/charts';
import { Button } from 'antd';
import _ from 'lodash';
import propTypes from 'prop-types';
import './index.less';

const FundChart = (props) => {
  const {
    data,
    fund: { name, code, exchange },
    isFocused,
  } = props;
  const sortedData = _.sortBy(data, ['day']);
  const config = {
    data: sortedData,
    padding: 'auto',
    xField: 'day',
    yField: 'sumValue',
    yAxis: {},
  };
  return (
    <div id="fund_charts">
      <div className="header">
        <div className="fund_info">
          {name}({exchange ? `${exchange.toUpperCase()}:` : ''}
          {code})
        </div>
        <Button type="primary">{isFocused ? '已添加' : '添加自选'}</Button>
      </div>
      <Line {...config} />
    </div>
  );
};

FundChart.propTypes = {
  data: propTypes.array,
  fund: propTypes.object,
  isFocused: propTypes.bool,
};

FundChart.defaultProps = {
  isFocused: false,
};

export default FundChart;
