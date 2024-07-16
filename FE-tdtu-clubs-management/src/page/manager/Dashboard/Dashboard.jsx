import HeaderManager from '../../../components/Header/HeaderManager';
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout } from 'antd';
const { Content } = Layout;
function DashBoard() {
    return (
        <div>
            <div className="flex">
                <SideBar props={1} />
                <Layout className='min-h-svh'>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <div>
                                <HeaderManager />
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    );
}

export default DashBoard;