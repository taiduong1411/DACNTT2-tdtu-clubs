import { useForm } from "react-hook-form";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { } from "antd";
import { useEffect, useState } from "react";
import { getDataByParams, postDataByParams } from "../../../services/service";
import upload from "../../../services/upload";
import Message from "../../../components/Popup/Message";
function AddClub() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [studentID, setStudentID] = useState('');
    const [studentInfo, setStudentInfo] = useState([]);
    const [file, setFile] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    // Handle message when server response
    const [signal, setSignal] = useState(false);
    const [msg, setMsg] = useState({
        type: '',
        content: '',
    });
    const serverMessage = {
        msg,
    }
    useEffect(() => {
        getStudentInfo();
    }, [studentID])

    const getStudentInfo = async () => {
        await getDataByParams(`account/student-info/${studentID}`).then(res => {
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
    const onCreateSubmit = async (data) => {
        const cloud = await upload(file, 'tdtu_clubs/clubs', setUploadProgress);
        const all_data = {
            club_name: data['club_name'],
            club_description: data['club_description'],
            imgUrl: cloud.url,
            public_Id: cloud.public_id,
            manager_Id: data['student_Id'],
            status: '1'
        }
        await postDataByParams('student/create-club', all_data).then(res => {
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
                <Header />
            </div>
            <div className="container m-auto">
                <div className="border min-h-svh mt-8 mb-8 rounded-xl">
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
                                    Gửi Yêu Cầu
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default AddClub;