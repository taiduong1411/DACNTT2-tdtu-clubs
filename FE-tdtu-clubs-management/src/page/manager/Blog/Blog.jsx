import HeaderManager from '../../../components/Header/HeaderManager';
import SideBar from '../../../components/SideBar/SideBarManager';
import { Layout } from 'antd';
const { Content } = Layout;
import { Button, Table, Tag, Modal, Radio, Avatar, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import StickyBox from "react-sticky-box";
import { getDataByParams, postDataByParams } from '../../../services/service';
import Message from '../../../components/Popup/Message';
import { useForm } from 'react-hook-form';
import upload from "../../../services/upload";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const columns = [
    {
        title: 'Tiêu Đề',
        width: 400,
        fixed: 'left',
        render: (record) => {
            return (
                <div>
                    <Link to={`/manager/blog-management/blog-detail/${record.slug}`}>
                        <Avatar size={40} src={`${record.imgUrl}`} /> <strong className='ml-2'>{record.title}</strong>
                    </Link>
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
    // {
    //     title: 'Nội Dung Chính',
    //     render: (record) => {
    //         return (
    //             <div dangerouslySetInnerHTML={{ __html: record.content }} className='line-clamp-3' />
    //         )
    //     },
    //     width: 200
    // },
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
            if (record.status == '1') {
                return (
                    <div>
                        <Tag color="orange" className='flex items-center w-fit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                            Đợi duyệt
                        </Tag>
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
    },
    // {
    //     title: '',
    //     render: (record) => {
    //         return (
    //             <Space size="small">
    //                 <Button type="danger" className='bg-red-500 text-white' data-id={record.id} data-title={record.title}>Xoá</Button>
    //                 <Button type="success" className='bg-green-800 text-white' data-id={record._id}>Cập Nhật</Button>
    //             </Space>
    //         )
    //     },
    //     fixed: "right",
    //     width: 100
    // }
];
const columnsDelItems = [
    {
        title: 'Tiêu Đề',
        width: 200,
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
    },
    {
        title: 'Trạng Thái',
        render: (record) => {
            if (record.status == false) {
                return (
                    <div>
                        <Tag color="red" className='flex items-center w-fit'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='mr-1' viewBox="0 0 24 24" width="12" height="12" fill="rgba(234,46,46,1)"><path d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z"></path></svg>
                            Đợi duyệt
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
        width: 100
    }
];

function Blog() {
    const { studentData } = useContext(UserContext);
    const [allDataNews, setAllDataNews] = useState([]);
    useEffect(() => {
        getAllDataNews();

    }, [])
    const getAllDataNews = async () => {
        await getDataByParams('news/all-news-table').then(res => {
            let data = res.data;
            // Sử dụng map() để tạo một mảng mới với các thuộc tính cần thiết
            let formattedData = data.map(e => {
                return {
                    key: e.id,
                    title: e.title,
                    sub_Content: e.sub_Content,
                    content: e.content,
                    createdAt: e.createdAt,
                    status: e.status,
                    id: e.id,
                    imgUrl: e.imgUrl,
                    slug: e.slug
                };
            });
            setAllDataNews(formattedData);
        })
    }
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };
    const onSelectChange = (newSelectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    // Hanlde Modal Delete Many
    const [isOpenDelItems, setIsOpenDelItems] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [dataDelItems, setDataDelItems] = useState([]);
    const handleDelSelected = async () => {
        showModal();
    }
    const showModal = () => {
        setIsOpenDelItems(true);
        let data = allDataNews.filter(item => selectedRowKeys.includes(item.key));
        setDataDelItems(data);
    };
    const handleOk = async () => {
        setLoading(true);
        await postDataByParams("news/delete-many-news", selectedRowKeys).then(res => {
            setTimeout(() => {
                setIsOpenDelItems(false);
                setConfirmLoading(false);
                setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
                setSelectedRowKeys([]);
            }, 2000);
            getAllDataNews();
        });
    };
    // Handle Modal Delete One
    // Handle Modal Add News
    // handle Radio input
    const [value, setValue] = useState(1);
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const [content, setContent] = useState('');
    const handleContentChange = (newContent) => {
        setContent(newContent);
    };
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
        ],
    };
    const { register, handleSubmit } = useForm();
    const [addOpen, setAddOpen] = useState(false);
    const [file, setFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    // Handle HashTag
    const [inputValue, setInputValue] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleAddHashtag = (event) => {
        event.preventDefault();
        setHashtags([...hashtags, inputValue]);
        setInputValue('');
    };
    const removeData = (index) => {
        setHashtags(hashtags.filter((el, i) => i !== index));
    }
    const onAddSubmit = async (data) => {
        setIsLoading(true);
        if (value == 1) {
            const cloud = await upload(file, 'tdtu_clubs/news', setUploadProgress);
            var allData = {
                ...data,
                content: content,
                status: '1',
                hashtag: hashtags,
                imgUrl: cloud ? cloud.url : '/logo_tdtu.webp',
                public_Id: cloud ? cloud.public_id : "",
                author: studentData.student_Id
            }
        } else {
            allData = {
                ...data,
                content: content,
                status: '1',
                hashtag: hashtags,
                imgUrl: data['img_url'],
                public_Id: "",
                author: studentData.student_Id
            }
        }

        await postDataByParams('news/add', allData).then(res => {
            console.log(res.data);
            setTimeout(() => {
                setAddOpen(false);
                setIsOpenDelItems(false);
                setConfirmLoading(false);
                setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
                setSelectedRowKeys([]);
                setIsLoading(false)
            }, 2000);
            getAllDataNews();
        })
    }
    // Search
    const onSearchSubmit = async (data) => {
        await getDataByParams(`news/search-news/${data['key']}`).then(res => {

            if (res.data.success == false) {
                setAllDataNews([]);
                setMsg({
                    type: res.status == 200 ? 'success' : 'error',
                    content: res.data.msg || res.data,
                });
                setSignal(true);
            } else {
                setAllDataNews(res.data.data)
            }
        })
    }
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getAllDataNews();
        }
    }
    return (
        <div>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div className="flex">
                <div>
                    <StickyBox>
                        <SideBar props={2} />
                    </StickyBox>
                </div>
                <Layout className='min-h-svh'>
                    <Content>
                        <div>
                            <HeaderManager />
                        </div>
                        <div className='mt-10 px-4'>
                            <div>
                                <form onSubmit={handleSubmit(onSearchSubmit)}>
                                    <div className="relative mb-8">
                                        <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm tin tức ..." required />
                                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className=''>
                                <div className='mb-4'>
                                    {hasSelected
                                        ?
                                        <div className='flex justify-between'>
                                            <div className='flex'>
                                                <div>
                                                    <Button size='medium' onClick={start} disabled={!hasSelected} loading={loading} danger>
                                                        Huỷ Chọn {selectedRowKeys.length} mục
                                                    </Button>
                                                </div>
                                                <div className='ml-2'>
                                                    <Button type="primary" size='medium' danger onClick={handleDelSelected}>
                                                        Xoá Tất Cả
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='ml-auto'>
                                                <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(true)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                                    Tạo Tin Tức
                                                </Button>
                                            </div>
                                        </div>
                                        :
                                        <div className='float-right mb-4'>
                                            <Button className='bg-blue-500 text-white flex justify-center items-center' type="primary" size='large' onClick={() => setAddOpen(true)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className='mr-2' viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                                                Tạo Tin Tức
                                            </Button>
                                        </div>
                                    }
                                </div>
                                <Table rowSelection={rowSelection} columns={columns}
                                    dataSource={allDataNews} />
                            </div>
                        </div>
                    </Content>
                </Layout>
                <Modal
                    title={`Xoá ${selectedRowKeys.length} Mục Đã Chọn`}
                    open={isOpenDelItems}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={() => setIsOpenDelItems(false)}
                    okButtonProps={{ style: { backgroundColor: 'red' } }}
                    width={1000}
                >
                    <div className='mt-4'>
                        <Table columns={columnsDelItems} dataSource={dataDelItems} />
                    </div>
                </Modal>
                <Modal open={addOpen} width={1000} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setAddOpen(false)}
                >
                    <form onSubmit={handleSubmit(onAddSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Tiêu Đề Chính</label>
                            <textarea rows={4} type="text" {...register('title')} placeholder="Tiêu Đề Chính" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="sub_content" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Mô tả ngắn</label>
                            <textarea rows={4} type="text" {...register('sub_content')} placeholder="Tiêu Đề Phụ" name="sub_content" id="sub_content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="cover" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Ảnh Đại Diện</label>
                            <Radio.Group onChange={onChange} value={value} className='mb-4'>
                                <Radio value={1}>Chọn ảnh từ thiết bị</Radio>
                                <Radio value={2}>Link</Radio>
                            </Radio.Group>
                            {value && value == 1
                                ?
                                <input onChange={(e) => setFile(e.target.files[0])} type="file" name="cover" id="cover" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                :
                                <input type="text" {...register('img_url')} placeholder="Nhập URL Ảnh" name="img_url" id="img_url" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                            }
                        </div>
                        {/* Hashtag */}
                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Hash Tag"

                                />
                                <button
                                    onClick={handleAddHashtag}
                                    className="bg-blue-500 text-white rounded-r-lg transition duration-300 hover:bg-blue-600 px-4 py-2"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="ml-2">
                                {hashtags.map((tag, index) => (
                                    <span key={index} onClick={() => removeData(index)} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className='mb-6'>
                            <label htmlFor="sub_content" className="block mb-4 text-sm font-bold text-gray-900 dark:text-black">Nội Dung</label>
                            <ReactQuill modules={modules} value={content} onChange={handleContentChange} />
                        </div>
                        {/* <div className='mb-6'>
                            <label htmlFor="sub_content" className="block mb-2 text-sm text-gray-900 dark:text-black font-bold">Trạng Thái</label>
                            <Radio.Group onChange={onChangeStatus} value={valueStatus} className='mb-4'>
                                <Radio value={false}>Private</Radio>
                                <Radio value={true}>Public</Radio>
                            </Radio.Group>
                        </div> */}
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
        </div>
    );
}

export default Blog;