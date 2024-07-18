import { useEffect, useState } from 'react';
import HeaderManager from '../../../components/Header/HeaderManager';
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout, Table } from 'antd';
import { getDataByParams } from '../../../services/service';
const { Content } = Layout;
function Event() {
    const columns = [
        {
            title: 'Ten Su Kien',
            dataIndex: 'event_name',
            key: 'event_name'
        },
        {
            title: 'Noi Dung Su Kien',
            dataIndex: 'event_description',
            key: 'event_description'
        },
        {
            title: 'Ngay Bat Dau',
            dataIndex: 'event_start',
            key: 'event_start'
        },
        {
            title: 'Ngay Ket Thuc',
            dataIndex: 'event_end',
            key: 'event_end'
        }
    ]
    useEffect(()=> {
        getAllDataEvent();
    },[]);
    const [dataEvent, setDataEvent] = useState([]);
    const getAllDataEvent = async()=> {
        await getDataByParams('admin/all-event').then(res=> {
            setDataEvent(res.data.event);
        })
    }



    return (
        <div>
            <div className="flex">
                <SideBar props={3} />
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
                            <div>
                                <Table columns={columns} dataSource={eventData}/>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
        </div>
    );
}

export default Event;