import { createContext, useState, useEffect } from 'react';
import { getDataByParams } from '../services/service';
import { jwtDecode } from 'jwt-decode';

// Tạo Context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
    const [studentData, setStudentData] = useState(null);
    var token = localStorage.getItem('accessToken');
    var tokenDecode = jwtDecode(token);
    useEffect(() => {
        // Hàm lấy thông tin user từ server
        const getAccountInfo = async () => {
            await getDataByParams(`account/student-info/${tokenDecode.sub}`).then(res => {
                if (res.data.img.length < 1) {
                    res.data.img = "/logo_tdtu.webp"
                }
                setStudentData(res.data);
            })
        };
        getAccountInfo();
    }, []);

    const updateStudentData = (newData) => {
        setStudentData(newData);
    };
    return (
        <UserContext.Provider value={{ studentData, updateStudentData }}>
            {children}
        </UserContext.Provider>
    );
};
