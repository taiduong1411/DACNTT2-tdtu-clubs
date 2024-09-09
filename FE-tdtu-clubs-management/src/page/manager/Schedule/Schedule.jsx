import HeaderManager from '../../../components/Header/HeaderManager';
import StickyBox from "react-sticky-box";
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout, Table, Button, Spin, Modal, DatePicker, Input, TimePicker, Tag, Space} from 'antd';

import { useEffect, useState } from 'react';
import { delDataByParams, getDataByParams, postDataByParams } from '../../../services/service';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'react-hook-form';
import Message from "../../../components/Popup/Message";
const { Content } = Layout;
const {Search} = Input;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from 'react-router-dom';
dayjs.extend(customParseFormat);



function Schedule() {
    const columns = [
        {
            title: 'Ngày',
            key: 'date',
            dataIndex: 'date'
        },
        {
            title: 'Thời Gian',
            key: 'time',
            dataIndex: 'time'
        },
        {
            title: 'Địa Điểm',
            key: 'location',
            dataIndex: 'location'
        },
        {
            title: 'Người Giám Sát',
            key: 'teacher_name',
            dataIndex: 'teacher_name'
        },
        {
            title: 'Nội Dung',
            key: 'content',
            dataIndex: 'content'
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
                        <Tag color="green" className='flex items-center w-fit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)">
                                <path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path>
                            </svg>
                            Đang hoạt động
                        </Tag>
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
        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                const currentTime = new Date();
                const activityDateTime = new Date(`${record.date}T${record.time}`);

                if (activityDateTime > currentTime) {
                    return (
                        <div>
                            <Space>
                                <Button type='danger' className='bg-red-500 text-white' data-id={record.id} onClick={handleDelete}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                                </Button>
                                <Button type='success' className='bg-green-500 text-white' data-id={record.id} onClick={handleEdit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>
                                </Button>
                            </Space>
                        </div>
                    );
                } else if (activityDateTime <= currentTime && currentTime < activityDateTime.setHours(activityDateTime.getHours() + 1)) {
                    return (
                        <></>
                    );
                } else {
                    return (
                        <Button type='primary' data-id={record.id} onClick={()=> nav(`attendance/${record.id}`)}>
                            Xem Danh Sách
                        </Button>
                    );
                }
            },
            width: 100,
        },
    ]
    const { register, handleSubmit } = useForm();
    const nav = useNavigate();
    useEffect(() => {
        getDataSchedule();
    }, [])
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    const [dataSchedule, setDataSchedule] = useState([]);
    const getDataSchedule = async () => {
        await getDataByParams('club/all-schedule').then(res => {
            setDataSchedule(res.data);
        })
    }
    // DELETE
    const [delOpen, setDelOpen] = useState(false);
    const [delId, setDelId] = useState();
    const handleDelete = async (e) => {
        setDelId(e.currentTarget.dataset.id);
        setDelOpen(!delOpen);
    }
    const handleConfirmDelete = async () => {
        // console.log(delId);
        await delDataByParams(`club/delete-schedule/${delId}`).then(res => {
            console.log(res);
            setTimeout(() => {
                 setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
                setDelOpen(!delOpen);
            }, 2000);
            getDataSchedule();
        })
    }
    // Update
    const [updateOpen, setUpdateOpen] = useState(false);
    const [updateId, setUpdateId] = useState();
    const [updateData, setUpdateData] = useState([]);
    const handleEdit = async (e) => {
        const id = e.currentTarget.dataset.id
        let scheduleById = dataSchedule.filter(d => d.id == id);
        setUpdateId(id);
        setUpdateData(scheduleById[0]);
        setUpdateOpen(!updateOpen);
    }
    const onUpdateSubmit = async (data) => {
        const updateDataSubmit = {
            ...data,
            date: dateStart ? dateStart : updateData.date,
            time: timeStart ? timeStart : updateData.time,
            status: '1'
        }
        await postDataByParams(`club/update-schedule/${updateId}`, updateDataSubmit).then(res => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                 setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
                setUpdateOpen(!updateOpen);
            }, 2000);
            getDataSchedule();
        })
    }
    // ADD
    const [addOpen, setAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [dateStart, setDateStart] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const onChangeStart = (date, dateString) => {
        setDateStart(dateString);
    };
    const onChange = (time, timeString) => {
        setTimeStart(timeString);
    };
    const [error, setError] = useState('');
    const onAddSubmit = async (data) => {
        if (!dateStart || !timeStart) {
            setError("Bạn chưa chọn ngày hoặc giờ")
            setTimeout(() => {
                setError('')
            }, 2000)
        } else {
            const allData = {
                ...data,
                date: dateStart,
                time: timeStart,
                status: '1'
            }
            await postDataByParams('club/create-schedule', allData).then(res => {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                     setMsg({
                        type: res.status == 200 ? 'success' : 'error',
                        content: res.data.msg || res.data,
                    });
                    setSignal(true);
                    setAddOpen(!addOpen);
                }, 2000);
                getDataSchedule();
            })
        }
    }
    return ( 
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal}/>
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
                                <div className='mb-4'>
                                    <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(!addOpen)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                            Tạo Lịch
                                    </Button>
                                    </div>
                                <Table columns={columns} dataSource={dataSchedule}/>
                            </div>
                    </Content>
                </Layout>
                <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setAddOpen(false)}
                >
                    <form onSubmit={handleSubmit(onAddSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Nội Dung Sinh Hoạt</label>
                            <textarea rows={4} type="text" {...register('content')} placeholder="Nhập Nội Dung Sinh Hoạt" name="content" id="content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="teacher_name" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Người Giám Sát</label>
                            <input type="text" {...register('teacher_name')} placeholder="Nhập Tên Người Giám Sát" name="teacher_name" id="teacher_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Địa Điểm</label>
                            <input type="text" {...register('location')} placeholder="Địa Điểm Sinh Hoạt" name="location" id="location" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_start" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Sinh Hoạt</label>
                            <DatePicker onChange={onChangeStart} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_end" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Thời Gian</label>
                            <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                        </div>
                        <div className="mb-4">
                            <p className='text-red-500'>
                                {error}
                            </p>
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size='large'
                            className="w-full text-white"
                        >
                            {isLoading
                                ?
                                <div>
                                    <Spin
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 18,
                                                    color: "white",
                                                    marginRight: "8px"
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                    Loading ...
                                </div>
                                :
                                "Gửi"
                            }
                        </Button>
                    </form>
                </Modal>
                <Modal open={delOpen} onCancel={()=> setDelOpen(!delOpen)} okButtonProps={{ style: { backgroundColor: 'red' } }} onOk={handleConfirmDelete}>
                    <span className='font-bold'>Lịch sinh hoạt sẽ bị xoá. Bạn có muốn tiếp tục ?</span>
                </Modal>
                <Modal open={updateOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setUpdateOpen(false)}
                >
                    <form onSubmit={handleSubmit(onUpdateSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Nội Dung Sinh Hoạt</label>
                            <textarea rows={4} type="text" {...register('content')} defaultValue={updateData && updateData.content} placeholder="Nhập Nội Dung Sinh Hoạt" name="content" id="content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="teacher_name" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Người Giám Sát</label>
                            <input type="text" {...register('teacher_name')} defaultValue={updateData.teacher_name} placeholder="Nhập Tên Người Giám Sát" name="teacher_name" id="teacher_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Địa Điểm</label>
                            <input type="text" {...register('location')} defaultValue={updateData.location} name="location" id="location" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_start" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Sinh Hoạt</label>
                            <DatePicker onChange={onChangeStart} defaultValue={updateData?.date ? dayjs(updateData.date) : null} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_end" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Thời Gian</label>
                            <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} defaultValue={updateData?.time ? dayjs(updateData.time, 'HH:mm:ss') : dayjs('00:00:00', 'HH:mm:ss')} />
                        </div>
                        <div className="mb-4">
                            <p className='text-red-500'>
                                {error}
                            </p>
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size='large'
                            className="w-full text-white"
                        >
                            {isLoading
                                ?
                                <div>
                                    <Spin
                                        indicator={
                                            <LoadingOutlined
                                                style={{
                                                    fontSize: 18,
                                                    color: "white",
                                                    marginRight: "8px"
                                                }}
                                                spin
                                            />
                                        }
                                    />
                                    Loading ...
                                </div>
                                :
                                "Gửi"
                            }
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
     );
}

export default Schedule;