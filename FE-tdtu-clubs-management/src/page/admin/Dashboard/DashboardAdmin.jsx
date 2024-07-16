import StickyBox from 'react-sticky-box';
import SideBar from '../../../components/SideBar/SideBarAdmin';
import { Layout } from 'antd';
const { Content } = Layout;
function DashBoardAdmin() {
    return (
        <div>
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={1} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            Dashboard Page
                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    );
}

export default DashBoardAdmin;