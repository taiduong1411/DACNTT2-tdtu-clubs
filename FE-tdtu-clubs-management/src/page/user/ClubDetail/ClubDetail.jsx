import { useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import Header from "../../../components/Header/Header";
import { UserContext } from "../../../contexts/UserContext";
import { useState, useEffect, useContext } from "react";
import Footer from "../../../components/Footer/Footer";
import { getDataByParams, postDataByParams } from "../../../services/service";
import { Button, Divider } from "antd";
import Message from '../../../components/Popup/Message';

const secretKey = 'tdtu_clubs'; // Thay thế bằng khóa bí mật của bạn
const decrypt = (ciphertext) => {
    const base64Decoded = ciphertext.replace(/_/g, '/').replace(/-/g, '+').replace(/\./g, '=');
    const bytes = CryptoJS.AES.decrypt(atob(base64Decoded), secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
function ClubDetail() {
    const {id} = useParams();
    const { studentData } = useContext(UserContext);
    const [decryptedId, setDecryptedId] = useState('');

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
        if (id) {
            const decrypted = decrypt(id);
            setDecryptedId(decrypted);
        }
    },[id]);
    useEffect(()=> {
        if (decryptedId) {
            getDataClub();
        }
    },[decryptedId]);
    const [dataClub, setDataClub] = useState([]);
    const [isJoin, setIsJoin] = useState();
    const getDataClub = async()=> {
        await getDataByParams(`student/club-detail/${decryptedId}`).then(res=> {
            setDataClub(res.data.club);
            setIsJoin(res.data.isJoin);
        })
    }
    const handleJoinClub = async()=> {
        const data = {
            club_Id: decryptedId,
            student_Id: studentData.student_Id
        }
        await postDataByParams('student/join-club', data).then(res=> {
            setMsg({
                type: res.status == 200 ? 'success' : 'error',
                content: res.data.msg || res.data,
            });
            setSignal(true);
        })
    }
    return ( 
        <>
            <Message serverMessage={serverMessage} signal={signal} setSignal={setSignal} />
            <div>
                <Header/>
            </div>
            <div className="container mx-auto">
                <div className="min-h-svh">
                    <div>
                        <div className="flex justify-center items-center">
                            <img src={dataClub.imgUrl} alt="" />
                        </div>
                    <div>
                    <div>
                        <Divider className="pt-10">
                            <p className="text-3xl font-bold text-center">Thông Tin Câu Lạc Bộ</p>
                        </Divider>
                    </div>
                    <div>
                        <p className="text-xl font-bold">Tên CLB: </p>
                        <h1>{dataClub.club_name}</h1>
                    </div>
                    
                    </div>
                        <p className="text-xl font-bold mt-10">Mô Tả: </p>
                        <h1>{dataClub.club_description}</h1>
                    </div>
                    <div className="mt-10 mb-10 float-right">
                        {isJoin == 'true'
                            ?
                            <Button size="large" type="primary" disabled>Đã Tham Gia</Button>
                            :
                            <Button type="primary" size="large" onClick={handleJoinClub}>Tham Gia</Button>
                        }
                    </div>
                </div>
            </div>
            <div>
                <Footer/>
            </div>
        </>
     );
}

export default ClubDetail;