import { useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import HeaderManager from '../../../components/Header/HeaderManager';
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout, Table, Button, Modal, DatePicker, Tag } from 'antd';
import { getDataByParams, postDataByParams } from "../../../services/service";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import Message from '../../../components/Popup/Message';
import StickyBox from "react-sticky-box";
const { Content } = Layout;

function EventTask() {
    const columns = [
        {
            title: 'MSSV',
            key: 'student_Id',
            dataIndex: 'student_Id'
        },
        {
            title: 'Mô tả',
            key: 'task_Description',
            dataIndex: 'task_Description'
        },
        {
            title: 'Thời Hạn',
            render: (record) => {
                return (
                    <div><strong>{record.task_Start}</strong> đến <strong>{record.task_End}</strong></div>
                )
            }
        },
        {
                    title: 'Trạng Thái',
                    render: (record) => {
                        if (record.task_Status == '1') {
                            return (
                                <div>
                                    <Tag color="orange" className='flex items-center w-fit'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                                        Chưa báo cáo
                                    </Tag>
                                </div>
                            )
                        }
                        // else if (record.task_status == '2') {
                        //     return (
                        //         <div>
                        //             <Tag color="red" className='flex items-center w-fit'>
                        //                 <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                        //                 Không duyệt
                        //             </Tag>
                        //         </div>
                        //     )
                        // }
                        else {
                            return (
                                <div className='flex'>
                                    <Tag color="green" className='flex items-center w-fit'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path></svg>
                                        Đã báo cáo
                                    </Tag>
                                    <Button type='primary' data-id={record.id} onClick={handleReview}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path></svg>
                                    </Button>
                                </div>
                            )
                        }
                    },
                    width: 100,
                    fixed: "right"
                }
    ]
    const secretKey = 'tdtu_clubs'; // Thay thế bằng khóa bí mật của bạn
    const decrypt = (ciphertext) => {
        const base64Decoded = ciphertext.replace(/_/g, '/').replace(/-/g, '+').replace(/\./g, '=');
        const bytes = CryptoJS.AES.decrypt(atob(base64Decoded), secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };
    const {id} = useParams();
    const decryptedId = decrypt(id);
    useEffect(()=> {
        getEventById();
        getAllMember();
        getAllDataTask();
    },[]);
    const [dataEvent, setDataEvent]= useState([]);
    const getEventById = async()=> {
        await getDataByParams(`club/event/${decryptedId}`).then(res=> {
            // console.log(res.data);
            setDataEvent(res.data);
        })
    }
    const [allMember, setAllMember] = useState([]);
    const getAllMember = async()=> {
        await getDataByParams(`club/club-member/${decryptedId}`).then(res=> {
            // console.log(res.data);
            setAllMember(res.data);
        })
    }
    const [allDataTask, setAllDataTask] = useState([]);
    const getAllDataTask = async () => {
        await getDataByParams(`club/tasks-by-event/${decryptedId}`).then(res => {
            // console.log(res.data);
            setAllDataTask(res.data.tasks);
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
    const [reviewId, setReviewId] = useState();
    const [reviewOpen, setReviewOpen] = useState(false);
    const [dataReport, setDataReport] = useState([]);
    const handleReview = async (e) => {
        const id = e.currentTarget.dataset.id;
        // console.log(id);
        await getDataByParams(`club/review-task/${id}`).then(res => {
            console.log(res.data.report[0]);
            setDataReport(res.data.report[0]);
        })
        setReviewId(id);
        setReviewOpen(!reviewOpen)
    }
    // MODAL
    const {register, handleSubmit} = useForm();
    const [addOpen, setAddOpen]= useState(false);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const onChangeStart = (date, dateString) => {
        setDateStart(dateString);
    };
    const onChangeEnd = (date, dateString) => {
        setDateEnd(dateString);
    };
    const [studentId, setStudentId] = useState();
    const handleChangeOption = (e)=> {
        setStudentId(e.target.value);
    }
    const onAddSubmit = async(data)=> {
        const allData = {
            student_Id: studentId,
            task_start: dateStart,
            task_end: dateEnd,
            task_description: data['task_description'],
            status: '1',
            event_id: decryptedId
        }
        await postDataByParams('club/create-task', allData).then(res=> {
            setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
            setSignal(true);
            setAddOpen(!addOpen);
            getAllDataTask();
        })
    }
    return ( 
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={3} />
                    </StickyBox>
                </div>
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
                            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">Thông Tin Sự Kiện</h1>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center">
                                            <span className="font-bold text-gray-700 w-40">Tên Sự Kiện:</span>
                                            <span className="text-gray-600 flex-1">{dataEvent.event_name}</span>
                                        </div>
                                        <div className="flex flex-wrap items-start">
                                            <span className="font-bold text-gray-700 w-40">Mô Tả:</span>
                                            <span className="text-gray-600 flex-1">{dataEvent.event_description}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center">
                                            <span className="font-bold text-gray-700 w-40">Địa Điểm Tổ Chức:</span>
                                            <span className="text-gray-600 flex-1">{dataEvent.event_location}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center">
                                            <span className="font-bold text-gray-700 w-40">Ngày Bắt Đầu:</span>
                                            <span className="text-gray-600 flex-1">{dataEvent.event_start}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center">
                                            <span className="font-bold text-gray-700 w-40">Ngày Kết Thúc:</span>
                                            <span className="text-gray-600 flex-1">{dataEvent.event_end}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>

                            </div>
                            <div className="mt-10">
                                <div className="mb-10 float-right">
                                    <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(true)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                            Thêm Task
                                    </Button>
                                </div>
                                <Table columns={columns} dataSource={allDataTask}/>
                            </div>
                        </div>
                    </Content>
                </Layout>
                <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setAddOpen(false)}
                >
                    <form onSubmit={handleSubmit(onAddSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="club_id" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
                                Chọn Thành Viên
                            </label>
                            <select onChange={handleChangeOption} name="student_id" id="student_id" className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <option value="0">Chọn Thành Viên</option>
                                {allMember && allMember.map((data, index) => (
                                    <option key={index} value={data.student_id}>{data.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_start" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Bắt Đầu</label>                            
                            <DatePicker onChange={onChangeStart} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="event_end" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ngày Kết Thúc</label>
                            <DatePicker onChange={onChangeEnd} needConfirm />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="task_description" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Mô Tả</label>
                            <textarea rows={4} type="text" {...register('task_description')} placeholder="Mô Tả" name="task_description" id="task_description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size='large'
                            className="w-full text-white"
                        >Gửi</Button>
                    </form>
                </Modal>
                <Modal width={1000} open={reviewOpen} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setReviewOpen(!reviewOpen)}>
                    <div>
                        <p className="text-lg leading-6 font-medium text-gray-900">Báo cáo :</p>
                        <p>{dataReport.task_Report}</p>
                        <p className="text-lg leading-6 font-medium text-gray-900">Mức độ hoàn thành :</p>
                        <p>{dataReport.task_Percent}</p>
                        <p className="text-lg leading-6 font-medium text-gray-900">Hình ảnh minh chứng :</p>
                        {dataReport?.imgUrl?.length > 1
                            ?
                                <img src={dataReport.imgUrl} alt="Hình ảnh minh chứng" />
                            :
                            <p className="text-red-500">Chưa có hình ảnh minh chứng</p>
                        }
                    </div>
                </Modal>
            </div>
        </>    
    );
}

export default EventTask;