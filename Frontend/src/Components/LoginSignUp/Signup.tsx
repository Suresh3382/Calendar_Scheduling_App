import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import {
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import * as Yup from "yup";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { baseURL } from "../../baseURL";
import type { ISignUpInterface } from "./LoginSignUpInterface";

const Signup = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const SignUpInitialValue = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const signUpSchema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    email: Yup.string().email().required("Email is required!"),
    password: Yup.string().required("Password is required!"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required!")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const handleSubmit = async (values: ISignUpInterface) => {
    setIsSubmitting(true);
    const finalSignupValues = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: "USER",
      onboardingComplete: false,
    };

    try {
      const response = await axios.post(`${baseURL}user/Signup`, finalSignupValues);
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="text-center text-white max-w-md">
          <h1 className="text-3xl font-bold mb-4">Join Our Community!</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Create an account to access your dashboard and manage your books and records.
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="/undraw_calendar_8r6s.svg"
              alt="Signup Illustration"
              width={900}
              height={900}
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Sign Up</h2>
            <p className="text-slate-600">Fill in the details to create your account</p>
          </div>

          <Formik
            initialValues={SignUpInitialValue}
            validationSchema={signUpSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
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
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`py-3 ${
                      errors.email && touched.email
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <Input.Password
                    id="password"
                    name="password"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <Input.Password
                    id="confirmPassword"
                    name="confirmPassword"
                    prefix={<LockOutlined />}
                    placeholder="Confirm your password"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`py-3 ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Log in
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
                      Signing up...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
