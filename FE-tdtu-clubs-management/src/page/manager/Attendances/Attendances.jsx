import { useParams } from "react-router-dom";
import HeaderManager from '../../../components/Header/HeaderManager';
import StickyBox from "react-sticky-box";
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout, Table, Button, Spin, Modal, DatePicker, Input, TimePicker, Tag, Space} from 'antd';
import { useEffect, useState } from 'react';
import { getDataByParams } from "../../../services/service";
const { Content } = Layout;
const {Search} = Input;

function Attendances() {
    const columns = [
        {
            title: "Tên Sinh Viên",
            dataIndex: "studentName",
            key:"studentName"
        },
        {
            title: "MSSV",
            dataIndex: "studentId",
            key: "studentId"
        },
        {
            title: "Điểm Danh",
            render: (record) => {
                if (record.attendanceCreatedAt == null) {
                    return (
                        <>
                            <Tag color="red" className='flex items-center w-fit'>
                                Chưa Điểm Danh
                            </Tag>
                        </>
                    )
                } else {
                    return (
                        <>
                            {new Date(record.attendanceCreatedAt).toLocaleTimeString('en-GB')}
                        </>
                    )
                }
            }
        },
        {
            title: "Trạng Thái",
            render: (record) => {
                const attendanceTime = new Date(record.attendanceCreatedAt);
                const scheduleTime = new Date(record.scheduleDate);
                if (record.attendanceCreatedAt == null) {
                    return (
                        <Tag color="red" className='flex items-center w-fit'>
                            Không Điểm Danh
                        </Tag>
                    );
                } else if (attendanceTime > scheduleTime) {
                    return (
                        <Tag color="orange" className='flex items-center w-fit'>
                            Trễ
                        </Tag>
                    );
                } else {
                    return (
                        <Tag color="green" className='flex items-center w-fit'>
                            Đúng Giờ
                        </Tag>
                    );
                }
            }
        }
    ]
    const { id } = useParams();
    useEffect(() => {
        getDataAttendance();
    }, []);
    const [dataAtt, setDataAtt] = useState([]);
    const getDataAttendance = async () => {
        await getDataByParams(`club/attendances-list/${id}`).then(res => {
            console.log(res.data);
            setDataAtt(res.data.attendanceList);
        })
    }
    return ( 
        <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={5} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        <div>
                            <HeaderManager />
                        </div>
                        <div className='float-right mb-10'>
                            {/* <Search
                                placeholder="Tìm Kiếm Sự Kiện ..."
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeInput}
                            /> */}
                            </div>
                            <div>
                                <Table columns={columns} dataSource={dataAtt}/>
                            </div>
                    </Content>
                </Layout>
            </div>
     );
}

export default Attendances;