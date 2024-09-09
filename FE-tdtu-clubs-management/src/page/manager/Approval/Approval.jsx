import HeaderManager from '../../../components/Header/HeaderManager';
import StickyBox from "react-sticky-box";
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout } from 'antd';
const { Content } = Layout;
import { Button, Table, Tag, Modal,Space, Input } from 'antd';
const {Search} = Input;


function Approval() {
    return ( 
        <>
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={6} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content>
                        <div>
                            <HeaderManager />
                        </div>
                        {/* <div className='float-right mb-10'>
                            <Search
                                placeholder="Tìm Kiếm Thành Viên ..."
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeInput}
                            />
                        </div> */}
                        <div className='mt-10 px-4'>
                            <div className=''>
                                approval
                                {/* <Table columns={columns}
                                    dataSource={allMember} /> */}
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
        </>
     );
}

export default Approval;