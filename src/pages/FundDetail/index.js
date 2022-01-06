import { Button, Col, Row } from 'antd';
import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FundChart from '../../components/FundChart';
import FundInfo from '../../components/FundInfo';
import FundSearch from '../../components/FundSearch';
import { getFundNetValues } from '../../service/request/api';
import './index.less';
const FundChartContext = createContext();

const FundDetailPage = () => {
  const location = useLocation();
  const {
    state: { query, currentFund },
  } = location;
  const [fund, setFund] = useState(currentFund || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fundNetValues, setFundNetValues] = useState([]);

  useEffect(() => {
    getFundNetValues({ code: currentFund.code }).then(({ items }) => {
      setFundNetValues(items);
    });
  }, [currentFund.code]);

  const getFundDetail = (msg) => {
    setFund(msg);
    getFundNetValues({ code: msg.code }).then(({ items }) => {
      setFundNetValues(items);
    });
  };

  return (
    <div id="fund_detail">
      <Row>
        <Col offset={1} span={4}>
          <div id="fund_detail_left">
            <Button
              onClick={() => setIsModalVisible(!isModalVisible)}
              type={'primary'}
            >
              基金搜索
            </Button>
            <FundSearch
              isShowSearchBox={false}
              showFundHeader={false}
              fundColumns={['name']}
              paginationSimple={true}
              query={query}
              getFundDetail={getFundDetail}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
          </div>
        </Col>
        <Col span={13} id="test123">
          <div id="fund_detail_middle">
            <FundChart data={fundNetValues} fund={fund} />
          </div>
        </Col>
        <Col offset={1} span={4}>
          <div id="fund_detail_right">
            <FundInfo fund={fund} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export { FundChartContext };

export default FundDetailPage;
