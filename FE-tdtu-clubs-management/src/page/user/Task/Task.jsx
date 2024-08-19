import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { Table, Tag, Button, Modal,Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { getDataByParams, postDataByParams } from "../../../services/service";
import { useForm } from "react-hook-form";
import upload from "../../../services/upload";
import Message from "../../../components/Popup/Message";


function Task() {
    const columns = [
        {
            title: 'Nội dung công việc',
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
                                <div className="flex">
                                    <Tag color="orange" className='flex items-center w-fit'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                                        Chưa hoàn thành
                                    </Tag>
                                    <Button type='success' className='bg-green-500 text-white' data-id={record.id} onClick={handleDoneTask}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>
                                    </Button>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className='flex'>
                                    <Tag color="green" className='flex items-center w-fit'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path></svg>
                                        Đã hoàn thành
                                    </Tag>
                                </div>
                            )
                        }
                    },
                    width: 100,
                    fixed: "right"
                }
    ]

    useEffect(() => {
        getTaskData();
    }, []);
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataTask, setDataTask] = useState([]);
    const getTaskData = async () => {
        await getDataByParams('club/my-task').then(res => {
            // console.log(res.data);
            setDataTask(res.data);
        })
    }
    const [isShowModalDoneTask, setIsShowModalDoneTask] = useState(false);
    const [taskId, setTaskId] = useState();
    const handleDoneTask = async (e) => {
        const id = e.currentTarget.dataset.id;
        setTaskId(id);
        setIsShowModalDoneTask(!isShowModalDoneTask);
        
    }
    const [uploadProgress, setUploadProgress] = useState(0);
    const [file, setFile] = useState('');
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    const onDoneSubmit = async (data) => {
        if (file) {
            const cloud = await upload(file, 'tdtu_clubs/task_report', setUploadProgress);
            var allData = {
            ...data,
            imgUrl: cloud.url ? cloud.url : '',
            imgId: cloud.public_id ? cloud.public_id : '',
            task_Id: taskId
            }
        } else {
            allData = {
                ...data,
                imgUrl: ' ',
                imgId: ' ',
                task_Id: taskId
            } 
        }
        await postDataByParams('club/report-task', allData).then(res => {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                 setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
                setIsShowModalDoneTask(!isShowModalDoneTask);
            }, 2000);
            getTaskData();
        })
        
    }
    return ( 
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal}/>
            <div>
                <Header/>
            </div>
            <div className="min-h-svh">
                <Table columns={columns} dataSource={dataTask}/>
            </div>
            <div>
                <Footer/>
            </div>
            <Modal width={1000} title="Báo cáo hoàn thành công việc" open={isShowModalDoneTask} okButtonProps={{ style: { "display": "none" } }} cancelButtonProps={{ style: { "display": "none" } }} onCancel={()=> setIsShowModalDoneTask(!isShowModalDoneTask)}>
                <div>
                    <form onSubmit={handleSubmit(onDoneSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="task_report" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Báo Cáo</label>
                            <textarea rows={8} type="text" {...register('task_report')} placeholder="Ghi Chú Báo Cáo" name="task_report" id="task_report" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="task_percent" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">% Hoàn thành</label>
                            <input type="text" {...register('task_percent')} placeholder="Đánh giá mức độ hoàn thành" name="task_percent" id="task_percent" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <input onChange={(e) => setFile(e.target.files[0])} type="file" name="cover" id="cover" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
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
                </div>
            </Modal>
        </>
     );
}

export default Task;