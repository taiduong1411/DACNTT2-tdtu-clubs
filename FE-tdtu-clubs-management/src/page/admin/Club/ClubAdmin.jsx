import { Layout, Button, Table, Tag, Avatar, Space, Input, Modal } from "antd";
const { Content } = Layout;
import StickyBox from "react-sticky-box";
import SideBarAdmin from "../../../components/SideBar/SideBarAdmin";
import { useEffect, useState } from "react";
import { getDataByParams, postDataByParams } from "../../../services/service";
import Message from "../../../components/Popup/Message";
import { useForm } from "react-hook-form";
import upload from "../../../services/upload";
const { Search } = Input;

function ClubAdmin() {
    const columns = [
        {
            title: "Tên CLB",
            key: 'club_name',
            render: (record) => {
                return (
                    <div>
                        <Avatar size={40} src={`${record.imgUrl}`} /> <strong className='ml-2'>CLB {record.club_name}</strong>
                    </div>
                )
            }
        },
        {
            title: "Mô tả",
            key: 'club_description',
            width: 600,
            render: (record) => {
                return <div>{record.club_description}</div>
            }
        },
        {
            title: "MSSV Quản Lý",
            key: 'manager_Id',
            render: (record) => {
                return <div>{record.manager_Id}</div>
            }
        },
        {
            title: 'Trạng Thái',
            render: (record) => {
                if (record.status === '1') {
                    return (
                        <div>
                            <Space>
                                <Button type='danger' className='bg-red-500 text-white' data-id={record.id} onClick={handleCancel}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                                </Button>
                                <Button type='success' className='bg-green-500 text-white' data-id={record.id} onClick={handleAccept}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path></svg>
                                </Button>
                            </Space>
                        </div>
                    )
                } else if (record.status === "2") {
                    return (
                        <div className='flex'>
                            <Tag color="red" className='flex items-center w-fit'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                                Không Duyệt
                            </Tag>
                        </div>
                    )
                } else if (record.status === "3") {
                    return (
                        <div className='flex'>
                            <Tag color="green" className='flex items-center w-fit'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(56,159,27,1)"><path d="M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z"></path></svg>
                                Đã Tạo
                            </Tag>
                        </div>
                    )
                }
            },
        }
    ]

    useEffect(() => {
        getDataClubs();
    }, []);

    const [dataClubs, setDataClubs] = useState([]);
    const getDataClubs = async () => {
        await getDataByParams('admin/all-clubs').then(res => {
            setDataClubs(res.data);
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

    const [isShowModalCancelClub, setIsShowModalCancelClub] = useState(false);
    const [idClub, setIdClub] = useState();
    const handleCancel = (e) => {
        const id = e.currentTarget.dataset.id;
        setIsShowModalCancelClub(true);
        setIdClub(id);
    }
    const handleCancelCreateClub = async()=> {
        await getDataByParams(`admin/cancel-club/${idClub}`).then(res => {
            getDataClubs();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            setIsShowModalCancelClub(!isShowModalCancelClub);
        })
    }
    const handleAccept = async (e) => {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`admin/accept-club/${id}`).then(res => {
            getDataClubs();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
        })

    }
    // Search
    const onSearch = async (value) => {
        await getDataByParams(`admin/search-club/${value}`).then(res => {
            if (res.data.success == false) {
                setDataClubs([]);
            } else {
                setDataClubs(res.data.data)
            }
        })
    }
    const handleChangeInput = async (e) => {
        if (e.target.value.length < 1) {
            getDataClubs();
        }
    }
    // ADD
    const [addOpen, setAddOpen] = useState(false);
    const {register, handleSubmit} = useForm();
    const [studentID, setStudentID] = useState('');
    const [error, setError] = useState('');
    const [studentInfo, setStudentInfo] = useState([]);
    const [file, setFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    useEffect(()=> {
        getStudent();
    },[studentID])
    const getStudent = async()=> {
        await getDataByParams(`account/student-info/${studentID}`).then(res=> {
            if (res.status == 200) {
                if (res.data.role == '2') return setError('Người dùng đang quản lý một CLB khác !')
                setStudentInfo(res.data);
                setError('');
            } else {
                setError('Không tìm thấy dữ liệu !')
                setStudentInfo([]);
            }
        })
    }
    const handleInputChange = (e) => {
        setStudentID(e.target.value);
    }

    const onCreateSubmit = async(data) => {
        const cloud = await upload(file, 'tdtu_clubs/clubs', setUploadProgress)
        const all_data = {
            club_name: data['club_name'],
            club_description: data['club_description'],
            imgUrl: cloud.url,
            public_Id: cloud.public_id,
            manager_Id: data['student_Id'],
            status: '3'
        }
        // console.log(all_data);
        await postDataByParams('admin/create-club', all_data).then(res=> {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            setAddOpen(false);
            getDataClubs();
        })
    }
    return (
        <>
            <Message signal={signal} serverMessage={serverMessage} setSignal={setSignal} />
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBarAdmin props={2} />
                    </StickyBox>
                </div>
                <Layout className="min-h-svh">
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}>
                        <div className='float-right mb-10'>
                            <Search
                                placeholder="Tìm Kiếm CLB ..."
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeInput}
                            />
                        </div>
                        {/* <div className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center' viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21 4V6H20L15 13.5V22H9V13.5L4 6H3V4H21ZM6.4037 6L11 12.8944V20H13V12.8944L17.5963 6H6.4037Z"></path></svg>
                            <select name="filter" id="filter" className='ml-4 flex border p-2 items-center'>
                                <option value="all">Tất Cả Tin Tức</option>
                                <option value="2">Tin Chưa Duyệt</option>
                                <option value="3">Tin Đã Duyệt</option>
                                <option value="4">Tin Không Duyệt</option>
                            </select>
                        </div> */}
                        <div className="">
                            <div className=''>
                                <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                        Tạo CLB
                                </Button>
                            </div>
                            <Table dataSource={dataClubs} columns={columns} />
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal title="Từ Chối Tạo CLB" open={isShowModalCancelClub} okButtonProps={{ style: { "backgroundColor": "red" } }} onCancel={()=> setIsShowModalCancelClub(!isShowModalCancelClub)} onOk={handleCancelCreateClub}>
                <div>
                    CLB sẽ không được tạo mới. Bạn có muốn tiếp tục ?
                </div>
            </Modal>
            <Modal title= "Tạo Câu Lạc Bộ" width={1000} open={addOpen} onCancel={()=> setAddOpen(false)} okButtonProps={{style: {"display": "none"}}} cancelButtonProps={{style: {"display": "none"}}}>
            <form onSubmit={handleSubmit(onCreateSubmit)}>
                        <div className="mt-10 px-8">
                            <div className="mb-6">
                                <label htmlFor="club_name" className="block mb-2 text-gray-900 font-bold">Tên CLB</label>
                                <input type="text" id="club_name" {...register('club_name')} className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" required />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="club_description" className="block mb-2 text-gray-900 font-bold">Mô Tả CLB</label>
                                <textarea rows={8} type="text" id="club_description" {...register('club_description')} className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" required />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="student_Id" className="block mb-2 text-gray-900 font-bold">Người Quản Lý</label>
                                <input type="text" id="student_Id" {...register('student_Id')} onChange={handleInputChange} className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" required />
                            </div>
                            <div className="mb-6">
                                <strong className="text-sm py-2">Thông tin người quản lý CLB: </strong>
                                {studentInfo.length < 1
                                    ?
                                    <div></div>
                                    :
                                    <div>
                                        <p className="text-sm py-2"><strong>Họ và tên: </strong>{studentInfo.full_name ? studentInfo.full_name : 'Chưa cập nhật'}</p>
                                        <p className="text-sm py-2"><strong>Email:</strong> {studentInfo.email ? studentInfo.email : 'Chưa cập nhật'}</p>
                                        <p className="text-sm py-2"><strong>Số điện thoại:</strong> {studentInfo.phone ? studentInfo.phone : 'Chưa cập nhật'}</p>
                                        <p className="text-sm py-2"><strong>Địa chỉ:</strong> {studentInfo.address ? studentInfo.address : 'Chưa cập nhật'}</p>
                                    </div>
                                }
                            </div>
                            <div className="mb-6">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                            <div className="mb-6">
                                <label htmlFor="club_img" className="block mb-2 text-gray-900 font-bold">Hình Ảnh CLB</label>
                                <input type="file" onChange={(e) => setFile(e.target.files[0])} id="club_img" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="border px-3 py-2 rounded-lg bg-green-700 text-white flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>
                                    Xác Nhận 
                                </button>
                            </div>
                        </div>
                    </form>
            </Modal>
        </>
    );
}

export default ClubAdmin;