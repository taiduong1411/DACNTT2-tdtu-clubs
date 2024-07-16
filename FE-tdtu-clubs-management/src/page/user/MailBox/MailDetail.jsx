import { useEffect, useState, useContext } from "react";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { getDataByParams } from "../../../services/service";
import { Avatar } from "antd";
import { UserContext } from "../../../contexts/UserContext";


const secretKey = 'tdtu_clubs'; // Thay thế bằng khóa bí mật của bạn

const decrypt = (ciphertext) => {
    // Khôi phục các ký tự đã thay thế
    const base64Decoded = ciphertext.replace(/_/g, '/').replace(/-/g, '+').replace(/\./g, '=');
    const bytes = CryptoJS.AES.decrypt(atob(base64Decoded), secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
function MailDetail() {
    const { encryptedId, type } = useParams();
    const nav = useNavigate();
    const [decryptedId, setDecryptedId] = useState('');
    // const { studentData } = useContext(UserContext);
    useEffect(() => {
        if (encryptedId) {
            const decrypted = decrypt(encryptedId);
            setDecryptedId(decrypted);
        }
    }, [encryptedId]);
    useEffect(() => {
        if (decryptedId) {
            getMailDetail();
        }
    }, [decryptedId]);

    const [mailDetail, setMailDetail] = useState([]);

    const getMailDetail = async () => {
        await getDataByParams(`mail/mail-detail/${decryptedId}`).then(res => {
            console.log(res.data.response.data.senderImg);
            setMailDetail(res.data.response.data)
        })
    }
    return (
        <>
            <div>
                <Header />
            </div>
            <div className="min-h-svh container m-auto mt-10 px-2">
                <div className="bg-white mt-8 rounded-2xl mb-20 min-h-svh overflow-hidden">
                    <div className="flex py-4 px-4 justify-between">
                        <div className="flex cursor-pointer" onClick={() => nav('/student/mailbox', { state: { type: type } })}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg>
                            Quay lại
                        </div>
                    </div>
                    <div className="px-12">
                        <div className="mt-4">
                            <h1 className="font-bold text-2xl">{mailDetail.mail?.subject}</h1>
                        </div>
                        <div className="mt-4 flex items-center">
                            <Avatar size={64} src={type == 'sent' ? (mailDetail?.senderImg) : (mailDetail?.senderImg == "" ? '/logo_tdtu.webp' : mailDetail?.senderImg)} className="mr-4" />
                            <div className="flex flex-col justify-center">
                                <strong className="text-sm">{mailDetail.mail?.sender_Id}</strong>
                                <strong className="text-sm">đến  {`<`}{mailDetail.mail?.receiver_Id}{`>`}</strong>
                            </div>
                        </div>
                        <div className="mt-4 mb-10">
                            <h1 className="">{mailDetail.mail?.content}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default MailDetail;