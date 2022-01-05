import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Table
} from "antd";
import _ from "lodash";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFunds } from "../../service/request/api";
import {
  INDOOR_OPERATE_MODE_ID,
  OTC_OPERATE_MODE_ID
} from "../../utils/constants";
import "./index.less";

const FundSearchBox = (props) => {
  const { getFundList, setIsModalVisible, query: queryParams } = props;
  const [form] = Form.useForm();
  const [totalTnaMin, setTotalTnaMin] = useState(-1);
  const [totalTnaMax, setTotalTnaMax] = useState(-1);
  const onFinish = (values) => { };
  const getFunds = () => {
    let query = form.getFieldValue();

    if (totalTnaMin >= 0) {
      Object.assign(query, { totalTnaMin });
    }
    if (totalTnaMax >= 0) {
      Object.assign(query, { totalTnaMax });
    }

    if (query.fund_type === "indoor_fund") {
      Object.assign(query, {
        operate_mode_id: INDOOR_OPERATE_MODE_ID,
      });
    } else if (query.fund_type === "otc_fund") {
      Object.assign(query, {
        operate_mode_id: OTC_OPERATE_MODE_ID,
      });
    }

    if (!_.isEmpty(query["code"])) {
      query["code"] = _.split(query["code"], ",");
    }

    if (!_.isEmpty(query.positionSymbol)) {
      query.positionSymbol = _.split(query.positionSymbol, ",")
    }


    getFundList(form.getFieldValue(), { current: 1, pageSize: 10 }).then(() => {
      if (_.isFunction(setIsModalVisible)) {
        setIsModalVisible(false)
      }
    });
  };
  return (
    <div>
      <Form form={form} onFinish={onFinish} initialValues={{ ...queryParams }}>
        <Row>
          <Col span={6} offset={1}>
            <Form.Item label={"基金代码"} name={"code"}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"基金名称"} name={"name"}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"基金范围"} name={'fundRange'}>
              <Radio.Group defaultValue={0}>
                <Radio value={0}>全部基金</Radio>
                <Radio value={1}>仅包含独门股的基金</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={1}>
            <Form.Item label={"持仓股名称"} name={"postion_stock"}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"持仓股代码"} name={"positionSymbol"}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"重仓股仓位和"} name={"position_stock_percent"}>
              <InputNumber allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={1}>
            <Form.Item label={"基金类别"} name={"underlying_asset_type"}>
              <Select placeholder="请选择基金类别" allowClear>
                <Select.Option value={402001}>股票型</Select.Option>
                <Select.Option value={402002}>货币型</Select.Option>
                <Select.Option value={402003}>债券型</Select.Option>
                <Select.Option value={402004}>混合型</Select.Option>
                <Select.Option value={402005}>基金型</Select.Option>
                <Select.Option value={402006}>贵金属</Select.Option>
                <Select.Option value={402007}>封闭式</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"基金运作方式"} name={"fund_type"}>
              <Select placeholder="请选择基金类型" allowClear>
                <Select.Option value={"indoor_fund"}>场内基金</Select.Option>
                <Select.Option value={"otc_fund"}>场外基金</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={2}>
            <Form.Item label={"基金规模"}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <InputNumber
                  onChange={(val) => setTotalTnaMin(val)}
                  allowClear
                />
                ~
                <InputNumber
                  onChange={(val) => setTotalTnaMax(val)}
                  allowClear
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={23} style={{ textAlign: "right" }}>
            <Button type="primary" onClick={getFunds}>
              搜索
            </Button>
            <Button
              style={{ margin: "0 10px" }}
              onClick={() => form.resetFields()}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const FundSearchResult = (props) => {
  const {
    items,
    totalCount,
    showHeader,
    showColumns,
    paginationSimple,
    getFundListPartial,
    current,
    query,
    getFundDetail,
    pagination,
  } = props;
  let navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  let columns = [
    { title: "基金代码", dataIndex: "code", key: "code" },
    { title: "基金名称", dataIndex: "name", key: "name" },
    {
      title: "基金类型",
      dataIndex: "operateModeId",
      key: "operateModeId",
      render: (val) => {
        if (_.includes(INDOOR_OPERATE_MODE_ID, val)) {
          return "场内基金";
        } else if (_.includes(OTC_OPERATE_MODE_ID, val)) {
          return "场外基金";
        }
        return null;
      },
    },
    { title: "基金规模", dataIndex: "totalTna", key: "totalTna" },
    {
      title: "基金单位净值",
      dataIndex: "netValue",
      key: "netValue",
      render: (netValue) => netValue && Math.round(netValue * 10000) / 10000,
    },
    {
      title: "近一周涨跌幅",
      dataIndex: "quoteChangeWeekly",
      key: "quoteChangeWeekly",
      sorter: { multiple: 2 },
      render: (val) => {
        const val_string =
          (val > 0 ? "+" : "") +
          ((Math.round(val * 10000) / 10000) * 100).toString();
        if (val > 0) {
          return (
            <div style={{ color: "#dd2200" }}>
              {val_string.substring(0, val_string.indexOf(".") + 3)}%
            </div>
          );
        } else if (val < 0) {
          return (
            <div style={{ color: "#009933" }}>
              {val_string.substring(0, val_string.indexOf(".") + 3)}%
            </div>
          );
        } else if (val === 0) {
          return <div>0.0</div>;
        }
        return "";
      },
    },
    {
      title: "近一月涨跌幅",
      dataIndex: "quoteChangeMonthly",
      key: "quoteChangeMonthly",
      sorter: { multiple: 1 },
      render: (val) => {
        const val_string =
          (val > 0 ? "+" : "") +
          ((Math.round(val * 10000) / 10000) * 100).toString();
        if (val > 0) {
          return (
            <div style={{ color: "#dd2200" }}>
              {val_string.substring(0, val_string.indexOf(".") + 3)}%
            </div>
          );
        } else if (val < 0) {
          return (
            <div style={{ color: "#009933" }}>
              {val_string.substring(0, val_string.indexOf(".") + 3)}%
            </div>
          );
        } else if (val === 0) {
          return <div>0.0</div>;
        }
        return "";
      },
    },
  ];
  columns = _.filter(
    columns,
    (column) => _.isEmpty(showColumns) || _.includes(showColumns, column.key)
  );

  const onChange = (pagination, filters, sorter, extra) => {
    const { action } = extra;
    if (action === "paginate") {
      setPageSize(pagination.pageSize);
    }
    if (!_.isArray(sorter)) {
      sorter = [sorter];
    }
    getFundListPartial(pagination, filters, sorter);
  };

  if (!_.isEmpty(items) && items.length < pageSize) {
    items.push(...new Array(pageSize - items.length).fill({}));
  }
  return (
    <div>
      <Table
        columns={columns}
        showHeader={showHeader}
        dataSource={items}
        onChange={onChange}
        pagination={{
          total: totalCount,
          simple: paginationSimple,
          pageSize,
          current,
          showTotal: (total) => `共 ${total} 条`
        }}
        rowKey={(record) => record.code || _.uniqueId()}
        onRow={(record) => {
          return {
            onClick: (event) => {
              if (_.isEmpty(record)) {
                return;
              }
              if (_.isFunction(getFundDetail)) {
                getFundDetail(record);
              } else {
                navigate("/funds/detail", {
                  state: {
                    query: query,
                    currentFund: record,
                    pagination: pagination,
                  },
                });
              }
            },
          };
        }}
      />
    </div>
  );
};

FundSearchResult.propTypes = {
  items: PropTypes.array,
  totalCount: PropTypes.number,
  getChildMsg: PropTypes.func,
  showHeader: PropTypes.bool,
  showColumns: PropTypes.array,
  paginationSimple: PropTypes.bool,
};

const FundSearch = (props) => {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [current, setCurrent] = useState(1);
  const [query, setQuery] = useState(props.query || { name: "" });
  const [pagination, setPagination] = useState(props.pagination || {});
  const {
    isShowSearchBox,
    showFundHeader,
    fundColumns,
    paginationSimple,
    getFundDetail,
    isModalVisible,
    setIsModalVisible
  } = props;
  useEffect(() => {
    getFundList(query, pagination);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFundList = (query, pagination, filters, sorter) => {
    getFunds(query, pagination, filters, sorter).then((data) => {
      const { items, totalCount } = data;
      setItems(items);
      setTotalCount(totalCount);
      setQuery(query);
      setCurrent(pagination?.current || 1);
      setPagination(pagination);
    });
  };

  const getFundListPartial = _.partial(getFundList, query);

  return (
    <div id="fund_search">
      {isShowSearchBox && (
        <div id="fund_search_box">
          <FundSearchBox getFundList={getFundList} />
        </div>
      )}
      {
        <Modal
          title="基金搜索"
          visible={isModalVisible}
          bodyStyle={{ width: '1150px', height: '300px' }}
          width={1150}
          centered={true}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          <FundSearchBox getFundList={getFundList} setIsModalVisible={setIsModalVisible} query={query} />
        </Modal>
      }
      <div id="fund_search_result">
        <div className="title">基金列表</div>
        <FundSearchResult
          {...{
            items,
            totalCount,
            showHeader: showFundHeader,
            showColumns: fundColumns,
            paginationSimple,
            getFundListPartial,
            current,
            query,
            getFundDetail,
            pagination,
          }}
        />
      </div>
    </div>
  );
};

FundSearch.propTypes = {
  isShowSearchBox: PropTypes.bool,
  showFundHeader: PropTypes.bool,
  fundColumns: PropTypes.array,
  paginationSimple: PropTypes.bool,
  query: PropTypes.object,
  getFundDetail: PropTypes.func,
  isModalVisible: PropTypes.bool
};

FundSearch.defaultProps = {
  isShowSearchBox: true,
  showFundHeader: true,
  fundColumns: [],
  paginationSimple: false,
  isModalVisible: false
};

export default FundSearch;
