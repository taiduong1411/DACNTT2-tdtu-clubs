import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { Switch, Checkbox, Button, Modal, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import './Mailbox.css';
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDataByParams, postDataByParams } from "../../../services/service";
import Message from "../../../components/Popup/Message";
import { UserContext } from "../../../contexts/UserContext";
import { useForm } from "react-hook-form";
import CryptoJS from 'crypto-js';



function MailBox() {
    const secretKey = 'tdtu_clubs';
    const encrypt = (text) => {
        const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
        const base64Encoded = btoa(ciphertext);
        // Thay thế các ký tự để an toàn cho URL
        return base64Encoded.replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '.');
    };

    // Lay du lieu tu trang mail detail gui qua
    const location = useLocation();
    const { type } = location.state || {};
    // 



    const { studentData } = useContext(UserContext);
    const nav = useNavigate();
    const [isSent, setIsSent] = useState(type == "sent" ? true : false);
    const [dataMail, setDataMail] = useState([]);
    // set message
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    useEffect(() => {
        setSelectedIds([]);
        getAllMail();
    }, [isSent, studentData]);
    const getAllMail = async () => {
        await getDataByParams('mail/all-mail').then(res => {
            const allData = res.data;
            if (isSent) {
                const data = allData.filter(e => e.sender_Id === studentData.student_Id && e.isSenderHidden == false);
                setDataMail(data);
            } else {
                const data = allData.filter(e => e.receiver_Id === studentData.student_Id && e.isReceiverHidden == false);
                setDataMail(data);
            }
            setSignal(false);
        });
    }
    // Handle CheckBox
    const [selectedIds, setSelectedIds] = useState([]);
    const onChange = (checked) => {
        setIsSent(checked);
    };

    const handleCheckbox = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter((item) => item !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = dataMail.map((data) => data.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    }
    // Delete Mail
    const handleDelete = async () => {
        await postDataByParams('mail/delete-many-mails', selectedIds).then(res => {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            getAllMail();
        })
    }
    // Handle Create Mail
    const [createOpen, setCreateOpen] = useState(false);
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [receiver, setReceiver] = useState('');
    const showCreateMailModal = () => {
        setCreateOpen(!createOpen);
    }
    const handleReceiver = (e) => {
        setReceiver(e.target.value);
    }
    const onCreateSubmit = async (data) => {
        setIsLoading(!isLoading);
        const allData = {
            ...data,
            sender_Id: studentData.student_Id,
            receiver_Id: receiver
        }
        await postDataByParams('mail/create', allData).then(res => {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
            getAllMail();
            setCreateOpen(!createOpen);
        })

    }
    return (
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div>
                <Header />
            </div>
            <div className="min-h-svh container m-auto mt-10 px-2">
                <div className="bg-white mt-8 rounded-2xl mb-20 h-svh overflow-hidden">
                    <div className="flex py-6 px-4 justify-between">
                        <div className="flex">
                            <Switch defaultChecked={type == "sent" ? true : false} onChange={onChange} />
                            {isSent
                                ?
                                <span className="ml-4 font-bold flex max-[1200px]:text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex items-center mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"></path></svg>
                                    Hộp Thư Đi
                                </span>
                                :
                                <span className="ml-4 font-bold flex max-[1200px]:text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex items-center mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z"></path></svg>
                                    Hộp Thư Đến
                                </span>
                            }
                        </div>
                        <div className="">
                            <Button type="primary" className="flex justify-center" onClick={showCreateMailModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="flex items-center mr-1" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>
                                Soạn thư
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <div className="p-4 border-b flex justify-between">
                            <div>
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={selectedIds.length === dataMail.length}
                                    indeterminate={selectedIds.length > 0 && selectedIds.length < dataMail.length}
                                >
                                    Chọn tất cả
                                </Checkbox>
                            </div>
                            <div className={`${selectedIds.length > 0 ? 'block' : 'hidden'} mr-4`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="24" fill="red" onClick={handleDelete}>
                                    <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                                </svg>
                            </div>
                        </div>
                        <ul>
                            {dataMail.map((data) => (
                                <li
                                    key={data.id}
                                    className={`flex items-center p-4 border-b hover:shadow-md hover:scale-100 cursor-pointer ${data.isReading ? "bg-gray-100" : "bg-white"}`}
                                >
                                    <div className="flex items-center w-2/12">
                                        <Checkbox
                                            onChange={() => handleCheckbox(data.id)}
                                            checked={selectedIds.includes(data.id)}
                                        />
                                        <span className={`${data.isReading ? "text-gray-400" : "text-black"} text-sm pl-2`}>
                                            {isSent
                                                ?
                                                <p>{data.receiver_Id}</p>
                                                :
                                                <p>{data.sender_Id}</p>
                                            }
                                        </span>
                                    </div>
                                    <div className="w-9/12 text-sm truncate">
                                        <span className={`${data.isReading ? "text-gray-400" : "text-black"} mr-2 font-bold`}
                                            onClick={async () => {
                                                const encryptedId = await encrypt(data.id.toString());
                                                return nav(`/student/mailbox/${isSent ? "sent" : "inbox"}/${encryptedId}`)
                                            }}
                                        >

                                            {data.subject}
                                        </span>
                                        <span className={`${data.isReading ? "text-gray-400" : "text-black"}`}
                                            onClick={async () => {
                                                const encryptedId = await encrypt(data.id.toString());
                                                return nav(`/student/mailbox/${isSent ? "sent" : "inbox"}/${encryptedId}`)
                                            }}
                                        >
                                            - {data.content}
                                        </span>
                                    </div>
                                    <div className="w-1/12 text-sm text-center">
                                        <span className={`${data.isReading ? "text-gray-400" : "text-black"}`}

                                        >
                                            {new Date(data.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
            <Modal width={1000} open={createOpen} onCancel={() => setCreateOpen(!createOpen)} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }}>
                <form onSubmit={handleSubmit(onCreateSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="receiver" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Chọn nơi gửi</label>
                        <select name="receiver" id="receiver" onChange={handleReceiver}>
                            <option value="0">Chọn người nhận thư</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="subject" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Subject</label>
                        <textarea rows={4} type="text" {...register('subject')} placeholder="Subject" name="subject" id="subject" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="content" className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">Content</label>
                        <textarea rows={4} type="text" {...register('content')} placeholder="Content" name="content" id="content" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
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
        </>
    );
}

export default MailBox;