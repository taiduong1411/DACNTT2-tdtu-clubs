import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { Table, Button, Space, Tag } from "antd";
import { getDataByParams, postDataByParams } from "../../../services/service";
import Message from "../../../components/Popup/Message";
import { useState, useEffect } from "react";
function ScheduleActivity() {
    const columns = [
        {
            title: 'Tên CLB',
            dataIndex: 'clubName',
        },
        {
            title: "Ngày Sinh Hoạt",
            dataIndex: 'date',
            key: 'date'
        },
        {
            title: "Thời Gian",
            dataIndex: "time",
            key: "time"
        },
        {
            title: "Địa Điểm",
            dataIndex: "location",
            key: "location"
        },
        {
            title: "Nội Dung",
            key: "content",
            dataIndex: "content"
        },
        {
            title: 'Người Hướng Dẫn',
            dataIndex: 'teacher_name',
            key: "teacher_name"
        },
        {
            title: 'Active',
            key: 'active',
            render: (record) => {
                const currentTime = new Date();
                const activityDateTime = new Date(`${record.date}T${record.time}`);

                if (activityDateTime > currentTime) {
                    return (
                        <Tag color="blue" className='flex items-center w-fit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(30,144,255,1)">
                                <path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path>
                            </svg>
                            Chưa đến hạn
                        </Tag>
                    );
                } else if (activityDateTime <= currentTime && currentTime < activityDateTime.setHours(activityDateTime.getHours() + 1)) {
                    return (
                        <Space>
                            <Tag color="green" className='flex items-center w-fit'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)">
                                    <path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path>
                                </svg>
                                Đang hoạt động
                            </Tag>
                            <Button type='primary' className=' text-white' data-id={record.id} data-club={record.clubId} onClick={handleAttendance}>
                                Điểm Danh
                            </Button>
                        </Space>
                    );
                } else {
                    return (
                        <Tag color="red" className='flex items-center w-fit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)">
                                <path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path>
                            </svg>
                            Đã hết hạn
                        </Tag>
                    );
                }
            },
            width: 100
        },
    ]
    useEffect(() => {
        getDataSchedule();
    }, []);
    const [allData, setAllData] = useState([]);
    const getDataSchedule = async () => {
        await getDataByParams('student/my-schedule').then(res => {
            console.log(res.data);
            setAllData(res.data.schedules);
        })
    }
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    const handleAttendance = async (e) => {
        const id = e.currentTarget.dataset.id;
        const club_id = e.currentTarget.dataset.club;
        const data = {
            club_id: club_id,
            schedules_id: id, 
        }
        await postDataByParams('student/attendances', data).then(res => {
            setTimeout(() => {
                 setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
            }, 2000);
            getDataSchedule();
        })
    }
    return (
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal}/>
            
            <div>
                <Header/>
            </div>
            <div className="min-h-svh container mx-auto">
                <div className="mt-10">
                    <Table columns={columns} dataSource={allData}/>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </>
     );
}

export default ScheduleActivity;