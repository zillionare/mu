import { Table } from 'antd'
import { useNavigate } from 'react-router-dom'


const FundTable = (props) => {
    const { items, totalCount, getChildMsg } = props
    let navigate = useNavigate()
    const columns = [
        { title: '基金代码', dataIndex: 'code', key: 'code' },
        { title: '基金名称', dataIndex: 'name', key: 'name' },
        {
            title: '基金单位净值', dataIndex: 'netValue', key: 'netValue', sorter: {
                compare: (a, b) => a.netValue - b.netValue
            }
        },
        { title: '涨跌幅', dataIndex: 'quoteChange', key: 'quoteChange' },
        // { title: '近一月', dataIndex: 'quoteChangeLastMonth', key: 'quoteChangeLastMonth' },
        // { title: '近一年', dataIndex: 'quoteChangeLastYear', key: 'quoteChangeLastYear' },
    ]

    return <div>
        <Table
            columns={columns}
            dataSource={items}
            onChange={getChildMsg}
            pagination={{ total: totalCount }}
            rowKey={'code'}
            onRow={record => {
                return {
                    onClick: (event) => {
                        navigate('/funds/detail')
                    }
                }
            }}
        />
    </div>
}

export default FundTable
