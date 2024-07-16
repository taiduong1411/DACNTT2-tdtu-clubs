import { Layout } from 'antd';
const { Content } = Layout;
import StickyBox from "react-sticky-box";
import SideBarAdmin from '../../../components/SideBar/SideBarAdmin';
import { useEffect, useState } from 'react';
import { getDataByParams } from '../../../services/service';
import { Button, Table, Tag, Modal, Avatar, Space, Input } from 'antd';
import Message from '../../../components/Popup/Message';
import './Blog.css';

import * as signalR from "@microsoft/signalr";
const { Search } = Input;
function AdminBlogs() {
    const columns = [
        {
            title: 'Tiêu Đề',
            width: 400,
            fixed: 'left',
            render: (record) => {
                return (
                    <div>
                        <Avatar size={40} src={`${record.imgUrl}`} /> <strong className='ml-2'>{record.title}</strong>
                    </div>
                )
            },
        },
        {
            title: 'Tiêu Đề Phụ',
            width: 200,
            render: (record) => {
                return <div className='line-clamp-3'>
                    {record.sub_Content}
                </div>
            }
        },
        {
            title: 'Ngày Tạo',
            render: (record) => {
                return (
                    <>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}</>
                )
            },
            width: 100
        },
        {
            title: 'Trạng Thái',
            render: (record) => {
                if (record.status === '1') {
                    return (
                        <div>
                            <Space>
                                <Button type='danger' className='bg-red-500 text-white' data-id={record.id} onClick={handelCancelNews}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
                                </Button>
                                <Button type='success' className='bg-green-500 text-white' data-id={record.id} onClick={handelAcceptNews}>
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
                                Đã Duyệt
                            </Tag>
                        </div>
                    )
                }
            },
            width: 100,
            fixed: "right"
        },
        {
            title: "Chi Tiết",
            render: (record) => {
                return (
                    <Button type='primary' onClick={handelShowNews} data-id={record.id}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path></svg>
                    </Button>
                )
            },
            width: 10,
            fixed: "right"
        }
    ];
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }


    const [allData, setAllData] = useState([]);
    useEffect(() => {
        getDataBlogs();
    }, []);


    const getDataBlogs = async () => {
        await getDataByParams('admin/all-news').then(res => {
            // console.log(res.data);
            setAllData(res.data)
        })
    }

    // Handle Change Options
    const [selectedOption, setSelectedOption] = useState('all');
    const [dataFilter, setDataFilter] = useState([]);
    useEffect(() => {
        filterData(selectedOption);
    }, [allData, selectedOption]);
    const handleChangeOptions = async (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        filterData(value);
    }
    const filterData = (value) => {
        if (value === "2") {
            const dataAwaitCheck = allData.filter(e => e.status === "1");
            setDataFilter(dataAwaitCheck);
        } else if (value === "3") {
            const dataAccept = allData.filter(e => e.status === "3");
            setDataFilter(dataAccept);
        } else if (value === "4") {
            const dataCancel = allData.filter(e => e.status === "2");
            setDataFilter(dataCancel);
        } else {
            setDataFilter(allData);
        }
    };

    // Handle News
    const handelCancelNews = async (e) => {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`admin/cancel-blog/${id}`).then(res => {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            getDataBlogs();
        })
    }
    const handelAcceptNews = async (e) => {
        const id = e.currentTarget.dataset.id;
        await getDataByParams(`admin/accept-blog/${id}`).then(res => {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            getDataBlogs();
        })
    }
    const [openContent, setOpenContent] = useState(false);
    const [blogById, setBlogById] = useState([]);
    const handelShowNews = async (e) => {
        const id = e.currentTarget.dataset.id;
        const blog = allData.filter(e => e.id == id);
        setBlogById(blog[0]);
        setOpenContent(!openContent);
    }
    // Search
    const onSearch = async (value) => {
        await getDataByParams(`admin/search-blogs/${value}`).then(res => {
            if (res.data.success == false) {
                setAllData([]);
            } else {
                setAllData(res.data.data)
            }
        })
    }
    const handleChangeInput = async (e) => {
        if (e.target.value.length < 1) {
            getDataBlogs();
        }
    }
    return (
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div className='flex'>
                <div>
                    <StickyBox>
                        <SideBarAdmin props={3} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content
                        style={{
                            margin: '24px 16px 0',
                        }}>
                        <div className='float-right mb-10'>
                            <Search
                                placeholder="Tìm Kiếm Bài Viết ..."
                                onSearch={onSearch}
                                style={{
                                    width: 200,
                                }}
                                onChange={handleChangeInput}
                            />
                        </div>
                        <div className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center' viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M21 4V6H20L15 13.5V22H9V13.5L4 6H3V4H21ZM6.4037 6L11 12.8944V20H13V12.8944L17.5963 6H6.4037Z"></path></svg>
                            <select name="filter" id="filter" className='ml-4 flex border p-2 items-center' value={selectedOption} onChange={handleChangeOptions}>
                                <option value="all">Tất Cả Tin Tức</option>
                                <option value="2">Tin Chưa Duyệt</option>
                                <option value="3">Tin Đã Duyệt</option>
                                <option value="4">Tin Không Duyệt</option>
                            </select>
                        </div>
                        <div>
                            <Table dataSource={dataFilter} columns={columns} />
                        </div>

                    </Content>
                </Layout>
            </div>
            <Modal width={2000} open={openContent} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                onCancel={() => setOpenContent(!openContent)}>
                <div>
                    <div dangerouslySetInnerHTML={{ __html: blogById.content }} className='content' />
                </div>
            </Modal>
        </>
    );
}

export default AdminBlogs;