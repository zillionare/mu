import { Line } from "@ant-design/charts";
import { Table, Tabs } from "antd";
import { useState, useEffect } from "react";
import { getFundPortfolioStock } from "../../service/request/api";
import "./index.less";

const FundInfo = (props) => {
    const {
        fund: {
            name,
            code,
            advisor,
            trustee,
            operate_mode,
            start_date,
            pub_date,
            end_date,
        },
    } = props;
    const [postionStock, setPostionStock] = useState([])
    useEffect(() => {
        getFundPortfolioStock({ code }).then(({ items }) => setPostionStock(items))
    }, [])
    const columns = [
        {
            title: "股票名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "持仓占比",
            dataIndex: "proportion",
            key: "proportion",
        },
        {
            title: "较上期",
            dataIndex: "quoteChange",
            key: "quoteChange",
        },
    ];
    const lineData = [
        {
            Date: "2010-01",
            scales: 1998,
        },
        {
            Date: "2010-02",
            scales: 1850,
        },
        {
            Date: "2010-03",
            scales: 1720,
        },
        {
            Date: "2010-04",
            scales: 1818,
        },
        {
            Date: "2010-05",
            scales: 1920,
        },
        {
            Date: "2010-06",
            scales: 1802,
        },
        {
            Date: "2010-07",
            scales: 1945,
        },
    ];

    const config = {
        data: lineData,
        padding: "auto",
        xField: "Date",
        yField: "scales",
    };

    return (
        <div>
            <div id="fund_info">
                <div className="widget_header">
                    <div id="title">基金简介</div>
                </div>
                <div className="info" id="code">
                    基金编码: {code || "-"}
                </div>
                <div className="info" id="name">
                    基金名称: {name || "-"}
                </div>
                <div className="info" id="advisor">
                    基金管理人: {advisor || "-"}
                </div>
                <div className="info" id="trustee">
                    基金托管人: {trustee || "-"}
                </div>
                <div className="info" id="operate_mode">
                    基金运作方式: {operate_mode || "-"}
                </div>
                <div className="info" id="start_date">
                    成立日期: {start_date || "-"}
                </div>
                <div className="info" id="pub_date">
                    发行日期: {pub_date || "-"}
                </div>
                <div className="info" id="end_date">
                    结束日期: {end_date || "-"}
                </div>
            </div>
            <Tabs type="card">
                <Tabs.TabPane tab="股票持仓" key="1">
                    <Line {...config} style={{ height: "100px" }} />
                    <Table
                        columns={columns}
                        dataSource={postionStock}
                        pagination={{ hideOnSinglePage: true }}
                        size="small"
                        style={{ fontSize: "10px" }}
                    />
                    <div>前十持仓占比合计: 78.17%</div>
                    <div>持仓截止日期: 2021-09-30</div>
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default FundInfo;
