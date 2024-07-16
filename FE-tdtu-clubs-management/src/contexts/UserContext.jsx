import { createContext, useState, useEffect } from 'react';
import { getDataByParams } from '../services/service';
import { jwtDecode } from 'jwt-decode';

// Tạo Context
export const UserContext = createContext();

// Tạo Provider
export const UserProvider = ({ children }) => {
    const [studentData, setStudentData] = useState(null);
    const [isTokenValid, setIsTokenValid] = useState(false);
    var token = localStorage.getItem('accessToken');
    // var tokenDecode = jwtDecode(token);
    useEffect(() => {
        if (token) {
            try {
                var tokenDecode = jwtDecode(token);
                setIsTokenValid(true);
                // Hàm lấy thông tin user từ server
                const getAccountInfo = async () => {
                    await getDataByParams(`account/student-info/${tokenDecode.sub}`).then(res => {
                        if (res.data.img.length < 1) {
                            res.data.img = "/logo_tdtu.webp"
                        }
                        setStudentData(res.data);
                    }).catch(err => {
                        console.error("Error fetching student data", err);
                    });
                };
                getAccountInfo();
            } catch (error) {
                console.error("Invalid token", error);
                setIsTokenValid(false);
            }
        } else {
            setIsTokenValid(false);
        }
    }, [token]);

    const updateStudentData = (newData) => {
        setStudentData(newData);
    };
    return (
        <UserContext.Provider value={{ studentData, updateStudentData, isTokenValid }}>
            {children}
        </UserContext.Provider>
    );
};
