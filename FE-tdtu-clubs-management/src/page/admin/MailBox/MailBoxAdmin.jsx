import { Layout } from "antd";
const { Content } = Layout;
import StickyBox from "react-sticky-box";
import SideBarAdmin from "../../../components/SideBar/SideBarAdmin";

function MailBoxAdmin() {
    return (
        <>
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBarAdmin props={4} />
                    </StickyBox>
                </div>
                <Layout>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}>
                        <div>
                            MailBox Page
                        </div>
                    </Content>
                </Layout>
            </div>
        </>
    );
}

export default MailBoxAdmin;