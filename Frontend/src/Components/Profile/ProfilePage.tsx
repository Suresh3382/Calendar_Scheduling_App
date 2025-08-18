import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button, Avatar, Upload, message, Select, DatePicker, TimePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: string;
  profilePic?: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  country: string;
  timeZone: string;
  language: string;
}

const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);

  const initialValues: UserProfile = {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    age: "25",
    profilePic: "",
    gender: "Male",
    dob: "1998-08-18",
    address: "123 Main St",
    city: "New York",
    country: "USA",
    timeZone: "GMT+5:30",
    language: "English",
  };

  const ProfileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    age: Yup.number().required("Age is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.string().required("DOB is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    timeZone: Yup.string().required("Time zone is required"),
    language: Yup.string().required("Language is required"),
  });

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">User Profile</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={ProfileSchema}
        onSubmit={(values) => {
          console.log("Updated Profile:", values);
          message.success("Profile updated successfully!");
          setEditMode(false);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <Avatar
                size={120}
                src={values.profilePic}
                className="shadow-lg"
                style={{ cursor: editMode ? "pointer" : "default" }}
              >
                {!values.profilePic && values.name.charAt(0)}
              </Avatar>
              {editMode && (
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const reader = new FileReader();
                    reader.onload = () => setFieldValue("profilePic", reader.result);
                    reader.readAsDataURL(file);
                    return false;
                  }}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              )}
            </div>

            {/* Grid of fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Name</label>
                <Input
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  disabled={!editMode}
                />
                {errors.name && touched.name && <span className="text-red-500">{errors.name}</span>}
              </div>

              <div>
                <label className="font-medium">Email</label>
                <Input
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  disabled={!editMode}
                />
                {errors.email && touched.email && <span className="text-red-500">{errors.email}</span>}
              </div>

              <div>
                <label className="font-medium">Phone</label>
                <Input
                  value={values.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  disabled={!editMode}
                />
                {errors.phone && touched.phone && <span className="text-red-500">{errors.phone}</span>}
              </div>

              <div>
                <label className="font-medium">Age</label>
                <Input
                  value={values.age}
                  onChange={(e) => setFieldValue("age", e.target.value)}
                  disabled={!editMode}
                />
                {errors.age && touched.age && <span className="text-red-500">{errors.age}</span>}
              </div>

              <div>
                <label className="font-medium">Gender</label>
                <Select
                  value={values.gender}
                  onChange={(value) => setFieldValue("gender", value)}
                  disabled={!editMode}
                  className="w-full"
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
                {errors.gender && touched.gender && <span className="text-red-500">{errors.gender}</span>}
              </div>

              <div>
                <label className="font-medium">Date of Birth</label>
                <DatePicker
                  value={dayjs(values.dob)}
                  onChange={(date) => setFieldValue("dob", date?.format("YYYY-MM-DD"))}
                  disabled={!editMode}
                  className="w-full"
                />
                {errors.dob && touched.dob && <span className="text-red-500">{errors.dob}</span>}
              </div>

              <div>
                <label className="font-medium">Address</label>
                <Input
                  value={values.address}
                  onChange={(e) => setFieldValue("address", e.target.value)}
                  disabled={!editMode}
                />
                {errors.address && touched.address && <span className="text-red-500">{errors.address}</span>}
              </div>

              <div>
                <label className="font-medium">City</label>
                <Input
                  value={values.city}
                  onChange={(e) => setFieldValue("city", e.target.value)}
                  disabled={!editMode}
                />
                {errors.city && touched.city && <span className="text-red-500">{errors.city}</span>}
              </div>

              <div>
                <label className="font-medium">Country</label>
                <Input
                  value={values.country}
                  onChange={(e) => setFieldValue("country", e.target.value)}
                  disabled={!editMode}
                />
                {errors.country && touched.country && <span className="text-red-500">{errors.country}</span>}
              </div>

              <div>
                <label className="font-medium">Time Zone</label>
                <Select
                  value={values.timeZone}
                  onChange={(value) => setFieldValue("timeZone", value)}
                  disabled={!editMode}
                  className="w-full"
                >
                  <Option value="GMT-12:00">GMT-12:00</Option>
                  <Option value="GMT-08:00">GMT-08:00</Option>
                  <Option value="GMT+00:00">GMT+00:00</Option>
                  <Option value="GMT+05:30">GMT+05:30</Option>
                  <Option value="GMT+10:00">GMT+10:00</Option>
                  <Option value="GMT+12:00">GMT+12:00</Option>
                </Select>
                {errors.timeZone && touched.timeZone && <span className="text-red-500">{errors.timeZone}</span>}
              </div>

              <div>
                <label className="font-medium">Language</label>
                <Input
                  value={values.language}
                  onChange={(e) => setFieldValue("language", e.target.value)}
                  disabled={!editMode}
                />
                {errors.language && touched.language && <span className="text-red-500">{errors.language}</span>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-4">
              {!editMode ? (
                <Button type="primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button type="default" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfilePage;
