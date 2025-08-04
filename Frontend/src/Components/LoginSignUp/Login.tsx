import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Input } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import type { ILoginInterface } from "./LoginSignUpInterface";
import { baseURL } from "../../baseURL";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginInitialValue = {
    username: "",
    password: "",
  };

  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    password: Yup.string().required("Password is required!"),
  });

  const handleSubmit = async (values: ILoginInterface) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${baseURL}user/Login`, values);
      if (response.data.result) {
        const { accessToken, refreshToken, user } = response.data.result;
        localStorage.setItem("AccessToken", accessToken);
        localStorage.setItem("RefreshToken", refreshToken);
        localStorage.setItem(
          "UDetails",
          JSON.stringify({
            user,
            pfp: user?.pfp || "",
            role: user?.role,
          })
        );

        if (user?.onboardingComplete) {
          navigate("/home");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="text-center text-white max-w-md gap">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Log in to access your dashboard and manage your account with ease.
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="/undraw_calendar_8r6s.svg"
              alt=""
              width={900}
              height={900}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Log In</h2>
            <p className="text-slate-600">
              Enter your credentials to login to your account
            </p>
          </div>

          <Formik
            initialValues={loginInitialValue}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    prefix={<UserOutlined />}
                    placeholder="Enter your username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`py-3 ${
                      errors.username && touched.username
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  />
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <Input.Password
                    id="password"
                    name="password"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`py-3 ${
                      errors.password && touched.password
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={() => navigate("/signup")}
                  >
                    Don't have an account? Sign up
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-[0.98]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Log In"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              By logging in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
