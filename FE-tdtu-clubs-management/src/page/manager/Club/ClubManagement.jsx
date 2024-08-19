import HeaderManager from '../../../components/Header/HeaderManager';
import StickyBox from "react-sticky-box";
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout } from 'antd';
const { Content } = Layout;
import { Button, Table, Tag, Modal,Space, Input } from 'antd';
import { getDataByParams } from '../../../services/service';
import { useState, useEffect } from 'react';
import Message from '../../../components/Popup/Message';
const {Search} = Input;
function ClubManagement() {
    const columns = [
        {
            title: 'Tên Thành Viên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Mã Sinh Viên',
            dataIndex: 'student_id',
            key: 'student_id'
        },
        {
            title: "CLB",
            dataIndex: 'club_name',
            key: 'club_name'
        },
        {
            title: 'Chức Vụ',
            render: (record)=> {
                if(record.role == 'member'){
                    return (
                        <div>
                            <Tag color="blue">Thành Viên</Tag>
                        </div>
                    )
                }
            }
        },

        {
             title: 'Trạng Thái',
            render: (record) => {
                if (record.status == '1') {
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
                } else if (record.status == '2') {
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

    useEffect(()=> {
        getMember();
    }, []);
    // 
    const [allMember, setAllMember] = useState([]);
    const getMember = async ()=> {
        await getDataByParams('club/all-member').then(res=> {
            if(res.data.success == false){
                setAllMember([])
                 setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
            }else{
                setAllMember(res.data.members);
            }
        })
    }

     const [isShowModalCancelMember, setIsShowModalCancelMember] = useState(false);
    const [idMember, setIdMember] = useState();
    const handleCancel = async(e)=> {
        const id = e.currentTarget.dataset.id;
        setIsShowModalCancelMember(true);
        setIdMember(id);
    }
     const handleCancelMember = async()=> {
        await getDataByParams(`club/cancel-member/${idMember}`).then(res => {
            getMember();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            setIsShowModalCancelMember(!isShowModalCancelMember);
        })
    }
    const handleAccept = async (e)=> {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`club/accept-member/${id}`).then(res => {
            getMember();
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
        })
    }
    





    // Search
    // const onSearchSubmit = async (data) => {
    //     await getDataByParams(`news/search-news/${data['key']}`).then(res => {

    //         if (res.data.success == false) {
    //             setAllDataNews([]);
    //             setMsg({
    //                 type: res.status == 200 ? 'success' : 'error',
    //                 content: res.data.msg || res.data,
    //             });
    //             setSignal(true);
    //         } else {
    //             setAllDataNews(res.data.data)
    //         }
    //     })
    // }
    // const onInput = (e) => {
    //     if (e.target.value.length < 1) {
    //         getAllDataNews();
    //     }
    // }
    // Search
    const onSearch = async (value) => {
        await getDataByParams(`club/search-member/${value}`).then(res => {
            if (res.data.success == false) {
                setAllMember([]);
            } else {
                setAllMember(res.data.data)
            }
        })
    }
    const handleChangeInput = async (e) => {
        if (e.target.value.length < 1) {
            getMember();
        }
    }
    return ( 
        <>
        <Message signal={signal} serverMessage={serverMessage} setSignal={setSignal}/>
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={4} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content>
                        <div>
                            <HeaderManager />
                        </div>
                         <div className='float-right mb-10'>
                            <Search
                                placeholder="Tìm Kiếm Thành Viên ..."
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeInput}
                            />
                        </div>
                        <div className='mt-10 px-4'>
                            <div className=''>
                                
                                <Table columns={columns}
                                    dataSource={allMember} />
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>
            <Modal title="Từ Chối Tạo CLB" open={isShowModalCancelMember} okButtonProps={{ style: { "backgroundColor": "red" } }} onCancel={()=> setIsShowModalCancelMember(!isShowModalCancelMember)} onOk={handleCancelMember}>
                <div>
                    Thành viên sẽ không được gia nhập. Bạn có muốn tiếp tục ?
                </div>
            </Modal>
        </>
     );
}

export default ClubManagement;