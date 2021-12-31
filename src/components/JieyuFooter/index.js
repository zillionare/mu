import './index.less'
import moment from 'moment'
const JieyuFooter = () => {
    return <div id="footer">
        © {moment().format('YYYY')} 武汉格物致知信息科技有限公司
    </div>
}


export default JieyuFooter
