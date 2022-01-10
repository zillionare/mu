import { Line } from '@ant-design/charts';
import { Table, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { getFundPortfolioStock } from '../../service/request/api';
import _ from 'lodash';
import './index.less';
import propTypes from 'prop-types';

const FundInfo = (props) => {
  const {
    fund: {
      name,
      code,
      advisor,
      trustee,
      operateMode,
      startDate,
      pubDate,
      endDate,
    },
  } = props;
  const [postionStock, setPostionStock] = useState([]);
  const [perPostionStock, setPerPostionStock] = useState([]);
  const [maxPubDate, setMaxPubDate] = useState('-');
  const [sumProportion, setSumProportion] = useState('0');
  useEffect(() => {
    async function fetchData() {
      const { items } = await getFundPortfolioStock({ code });
      const _maxPubDate = _.maxBy(items, 'pubDate')?.pubDate;
      const quoteChangeResult = _.reduce(
        _.map(_.values(_.groupBy(items, 'symbol')), (data) => {
          data = _.reverse(_.sortBy(data, ['pubDate'], ['desc']));
          if (data?.length > 1) {
            let quoteChange = `${data[0].proportion - data[1].proportion}`;
            if (!_.startsWith(quoteChange, '-')) {
              quoteChange = `+${quoteChange}`;
            }
            return {
              [data[0].symbol]: quoteChange.substring(
                0,
                quoteChange.indexOf('.') + 3
              ),
            };
          } else {
            return {
              [data[0].symbol]: '新增',
            };
          }
        }),
        (result, value) => {
          Object.assign(result, value);
          return result;
        },
        {}
      );
      const _PostionStock = _.map(
        _.orderBy(
          _.filter(items, ({ pubDate }) => pubDate === _maxPubDate),
          ['proportion'],
          ['desc']
        ),
        (row) => {
          row.quoteChange = quoteChangeResult[row.symbol] || '-';
          return row;
        }
      );
      const symbol = _PostionStock[0]?.symbol;
      setMaxPubDate(_maxPubDate);
      setPostionStock(_PostionStock);
      setSumProportion(_.sumBy(_PostionStock, 'proportion').toString());
      await getPerPostionStock({ code, symbol });
    }
    fetchData();
  }, [code]);

  const getPerPostionStock = async ({ code, symbol }) => {
    const { items: symbolItems } = await getFundPortfolioStock({
      code,
      symbol,
    });
    setPerPostionStock(_.sortBy(symbolItems, 'pubDate'));
  };

  const columns = [
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      render: (val, { isSingleStock }) => {
        return isSingleStock ? (
          <div style={{ color: '#dd2200' }}>{val}</div>
        ) : (
          <div>{val}</div>
        );
      },
    },
    {
      title: '持仓占比',
      dataIndex: 'proportion',
      key: 'proportion',
      render: (val) => `${val}%`,
    },
    {
      title: '较上期',
      dataIndex: 'quoteChange',
      key: 'quoteChange',
      render: (val) => {
        if (val.length > 1) {
          if (_.startsWith(val, '+')) {
            return <div style={{ color: '#dd2200' }}>{val}%</div>;
          } else if (_.startsWith(val, '-')) {
            return <div style={{ color: '#009933' }}>{val}%</div>;
          }
        }
        return <div>{val}</div>;
      },
    },
  ];

  const config = {
    data: perPostionStock,
    padding: 'auto',
    xField: 'pubDate',
    yField: 'proportion',
  };

  return (
    <div>
      <div id="fund_info">
        <div className="widget_header">
          <div id="title">基金简介</div>
        </div>
        <div className="info" id="code">
          基金编码: {code || '-'}
        </div>
        <div className="info" id="name">
          基金名称: {name || '-'}
        </div>
        <div className="info" id="advisor">
          基金管理人: {advisor || '-'}
        </div>
        <div className="info" id="trustee">
          基金托管人: {trustee || '-'}
        </div>
        <div className="info" id="operate_mode">
          基金运作方式: {operateMode || '-'}
        </div>
        <div className="info" id="start_date">
          成立日期: {startDate || '-'}
        </div>
        <div className="info" id="pub_date">
          发行日期: {pubDate || '-'}
        </div>
        <div className="info" id="end_date">
          结束日期: {endDate || '-'}
        </div>
      </div>
      <Tabs type="card">
        <Tabs.TabPane tab="股票持仓" key="1">
          <Line {...config} style={{ height: '100px' }} />
          <Table
            columns={columns}
            dataSource={postionStock}
            pagination={{ hideOnSinglePage: true }}
            size="small"
            style={{ fontSize: '10px', marginTop: '10px' }}
            rowKey={(row) => row.id}
            onRow={(record) => {
              return {
                onClick: async () => {
                  await getPerPostionStock(record);
                },
              };
            }}
          />
          <div>
            前十持仓占比合计:{' '}
            {sumProportion.substring(0, sumProportion.indexOf('.') + 3)}%
          </div>
          <div>持仓截止日期: {maxPubDate || '-'}</div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

FundInfo.propTypes = {
  fund: propTypes.objectOf({
    name: propTypes.string,
    code: propTypes.string,
    advisor: propTypes.string,
    trustee: propTypes.string,
    operateMode: propTypes.string,
    startDate: propTypes.string,
    pubDate: propTypes.string,
    endDate: propTypes.string,
  }),
};

export default FundInfo;
