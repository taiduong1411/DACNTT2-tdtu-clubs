import { useEffect, useState } from 'react';
import SideBar from '../../../components/SideBar/SideBarAdmin';
import { Layout, Table, Button, Spin, Modal, DatePicker, Tag, Space, Input} from 'antd';
import { getDataByParams, postDataByParams } from '../../../services/service';
import { useForm } from 'react-hook-form';
import { LoadingOutlined } from '@ant-design/icons';
import upload from '../../../services/upload';
import Message from '../../../components/Popup/Message';
const { Content } = Layout;

const { Search } = Input;

function EventAdmin() {
    const columns = [
        {
            title: 'Tên Sự Kiện',
            dataIndex: 'event_name',
            key: 'event_name'
        },
        {
            title: 'Nội Dung Sự Kiện',
            dataIndex: 'event_description',
            key: 'event_description'
        },
        {
            title: 'Địa Điểm Tổ Chức',
            dataIndex: 'event_location',
            key: 'event_location'
        },
        {
            title: 'Người Quản Lý',
            dataIndex: 'event_manager',
            key: 'event_manager'
        },
        {
            title: 'Ngày Bắt Đầu',
            dataIndex: 'event_start',
            key: 'event_start'
        },
        {
            title: 'Ngày Kết Thúc',
            dataIndex: 'event_end',
            key: 'event_end'
        },
        {
                 title: 'Trạng Thái',
                render: (record) => {
                    if (record.event_status == '1') {
                        return (
                            <div>
                                <Space>
                                    <Button type='danger' className='bg-red-500 text-white' data-id={record.id} onClick={handelCancelEvent}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                                    </Button>
                                    <Button type='success' className='bg-green-500 text-white' data-id={record.id} onClick={handelAcceptEvent}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>
                                    </Button>
                                </Space>
                            </div>
                        )
                    } else if (record.event_status == '2') {
                        return (
                            <div>
                                <Tag color="red" className='flex items-center w-fit'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                                    Không duyệt
                                </Tag>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <Tag color="green" className='flex items-center w-fit'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path></svg>
                                    Đã duyệt
                                </Tag>
                            </div>
                        )
                    }
                },
                width: 100,
                fixed: "right"
            }
    ]
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }

    const {register, handleSubmit} = useForm();
    useEffect(()=> {
        getAllDataEvent();
        getAllClub();
    },[]);
    const [dataEvent, setDataEvent] = useState([]);
    const [dataClubs, setDataClubs] = useState([]);
    const getAllDataEvent = async()=> {
        await getDataByParams('admin/all-event').then(res=> {
            // console.log(res.data);
            setDataEvent(res.data);
        })
    }
    const getAllClub = async()=> {
        await getDataByParams('admin/all-clubs').then(res=> {
            console.log(res.data);
            setDataClubs(res.data)
        })
    }
    // ADD

    const [addOpen, setAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);


    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const onChangeStart = (date, dateString) => {
        setDateStart(dateString);
    };
    const onChangeEnd = (date, dateString) => {
        setDateEnd(dateString);
    };

    const [managerId, setManagerId] = useState();
    const handleChangeOption = (e)=> {
        setManagerId(e.target.value);
    }
    const [file, setFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);


    const onAddSubmit = async(data)=> {
        const cloud = await upload(file, 'tdtu_clubs/events', setUploadProgress);
        const allData = {
            event_name: data['event_name'],
            event_description: data['event_description'],
            event_location: data['event_location'],
            event_image: cloud.url,
            event_start: dateStart,
            event_end: dateEnd,
            event_manager: managerId,
            event_status: "3"
        }
        await postDataByParams('admin/create-event', allData).then(res=> {
            setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
            setSignal(true);
            setAddOpen(!addOpen);
        })
    }
    // 
    const handelCancelEvent = async(e)=> {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`admin/cancel-event/${id}`).then(res => {
            getAllDataEvent();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
        })
    }
    const handelAcceptEvent = async(e)=> {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`admin/accept-event/${id}`).then(res => {
            getAllDataEvent();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
        })
    }
    // SEARCH
    const onSearch = async (value) => {
        await getDataByParams(`admin/search-event/${value}`).then(res => {
            if (res.data.success == false) {
                setDataEvent([]);
            } else {
                setDataEvent(res.data.data)
            }
        })
    }
    const handleChangeInput = async (e) => {
        if (e.target.value.length < 1) {
            getAllDataEvent();
        }
    }

    return (
        <div>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div className="flex">
                <SideBar props={4} />
                <Layout className='min-h-svh'>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}
                    >
                        
                        <div>
                            <div className='float-right mb-10'>
                                <Search
                                    placeholder="Tìm Kiếm Sự Kiện ..."
                                    onSearch={onSearch}
                                    style={{
                                        width: 200,
                                    }}
                                    onChange={handleChangeInput}
                                />
                            </div>
                            
                            <div>
                                <div className='mb-4'>
                                    <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                            Tạo Sự Kiện
                                    </Button>
                                </div>
                                <Table columns={columns} dataSource={dataEvent}/>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setAddOpen(false)}
                >
                    <form onSubmit={handleSubmit(onAddSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="event_name" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Tiêu Đề Chính</label>
                            <input type="text" {...register('event_name')} placeholder="Tên Sự Kiện" name="event_name" id="event_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_description" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Mô Tả</label>
                            <textarea rows={4} type="text" {...register('event_description')} placeholder="Mô Tả" name="event_description" id="event_description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_location" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Địa Điểm</label>
                            <input type="text" {...register('event_location')} placeholder="Địa Điểm Diễn Ra Sự Kiện" name="event_location" id="event_location" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="club_id" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
                                Chọn Đơn Vị CLB Tổ Chức
                            </label>
                            <select onChange={handleChangeOption} name="club_id" id="club_id" className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="0">Chọn CLB</option>
                                {dataClubs && dataClubs.map((data, index) => (
                                    <option key={index} value={data.manager_Id}>CLB {data.club_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_start" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Bắt Đầu</label>
                            {/* <input type="text" {...register('event_start')} placeholder="Ngày bắt đầu" name="event_start" id="event_start" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} /> */}
                            <DatePicker onChange={onChangeStart} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_end" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Kết Thúc</label>
                            {/* <input type="text" {...register('event_start')} placeholder="Ngày bắt đầu" name="event_start" id="event_start" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} /> */}
                            <DatePicker onChange={onChangeEnd} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_image" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Hình Ảnh Sự Kiện</label>
                                <input onChange={(e) => setFile(e.target.files[0])} type="file" name="event_image" id="event_image" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
    );
}

export default EventAdmin;