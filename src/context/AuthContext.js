import React, { createContext, useState, useEffect, useContext } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 페이지 로드 시 로컬 스토리지에서 인증 정보 확인
        const checkAuth = () => {
            console.log("Checking authentication status...");
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('user');

            console.log("Token:", token);
            console.log("User data:", userData);

            if (token && userData) {
                setCurrentUser(JSON.parse(userData));
                setIsAuthenticated(true);
                console.log("User is authenticated!");
            } else {
                console.log("User is NOT authenticated!");
            }

            setLoading(false);
        };

        checkAuth();
    }, []);



    // 로그인 함수
    const login = (token, user) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    // 제공할 인증 컨텍스트 값
    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 인증 컨텍스트를 사용하기 위한 커스텀 훅
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;