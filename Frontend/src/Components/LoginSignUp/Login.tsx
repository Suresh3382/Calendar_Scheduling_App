import React, { useContext } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { Form, Formik } from 'formik';
import type { ILoginInterface } from './LoginSignUpInterface';
import { baseURL } from '../../baseURL';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    const loginInitialValue = {
        username: '',
        password: ''
    }
    let schema = Yup.object().shape({
        username: Yup.string().required('Username is required!'),
        password: Yup.string().required('Password is required!')
    })

    const hanldeSubmit = async (values: ILoginInterface) => {
        try {
            const response = await axios.post(`${baseURL}user/Login`, values);
            console.log(values)
            if (response.data.result) {
                const AccessToken = response.data.result.accessToken;
                const RefreshToken = response.data.result.refreshToken;
                localStorage.setItem('AccessToken', AccessToken);
                localStorage.setItem('RefreshToken', RefreshToken);
                const UDetails = {
                    user: response?.data?.result?.user,
                    pfp: response?.data?.result?.user?.pfp || '',
                    role: response?.data?.result?.user?.role,
                };
                localStorage.setItem("UDetails", JSON.stringify(UDetails));
                console.log("-------->", response.data.result.user);
                if (response?.data?.result?.user?.onboardingComplete) {
                    navigate('/home');
                } else {
                    navigate('/onboarding');
                }
            }
        } catch (error) {
            console.log("Error :", error);
        }
    }

    return (
        <div className="w-full min-h-screen flex">
            <div className="w-1/2 flex items-center justify-center bg-[#F3F4FA]">
                <img src='src\Component\LoginSignUp\Images\ttplogin.svg' alt="Login" />
            </div>
            <div className="w-1/2 flex items-center justify-center">
                <div className='w-1/3 h-full flex flex-col justify-center gap-8'>
                    {/* <img src="src\Component\LoginSignUp\logo.png" alt="" /> */}
                    <hr />
                    <p className='text-xl text-[#223B95]'>Login into Your Account</p>
                    <div className='flex flex-col gap-5'>
                        <Formik
                            initialValues={loginInitialValue}
                            validationSchema={schema}
                            onSubmit={hanldeSubmit}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className='flex flex-col gap-3'>
                                        <div>
                                            <label htmlFor="username" className='text-[#223B95]'>Username</label>
                                            <Input placeholder="Enter Username" suffix={<UserOutlined />} className='border-none bg-[#F9FAFF]' value={values.username} onChange={(e) => { setFieldValue('username', e.target.value) }} />
                                            {errors.username && touched.username ? <span className='text-red-600'>{errors.username}</span> : null}

                                        </div>
                                        <div>
                                            <label htmlFor="password" className='text-[#223B95]'>Password</label>
                                            <Input.Password placeholder="Enter Password" iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} className='border-none bg-[#F9FAFF]' value={values.password} onChange={(e) => { setFieldValue('password', e.target.value) }} />
                                        </div>
                                        {errors.password && touched.password ? <span className='text-red-600'>{errors.password}</span> : null}
                                    </div>
                                    <p className='text-[#017AFF] cursor-pointer text-right my-6' onClick={() => navigate('/signup')}>Signup!</p>
                                    <div className='flex justify-center'>
                                        <button type='submit' className='w-1/3 text-white bg-blue-700 rounded-lg text-sm px-4 py-2'>Login</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    );
};

export default Login;