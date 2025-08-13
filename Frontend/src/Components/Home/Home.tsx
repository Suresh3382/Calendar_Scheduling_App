import {
  ChevronDown,
  ChevronRight,
  Circle,
  Clock,
  Cross,
  Mail,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Calendar,
  DatePicker,
  Flex,
  Input,
  Modal,
  Select,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import dayLocaleData from "dayjs/plugin/localeData";
import type { Dayjs } from "dayjs";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import TextArea from "antd/es/input/TextArea";
import Checkbox from "antd/es/checkbox/Checkbox";
import weekday from "dayjs/plugin/weekday";
import { callApi } from "@/Utils/AxiosConifg";
import { baseURL } from "@/baseURL";
import CalendarComponent from "../Calendar/CalendarComponent";
import { UContext } from "@/Utils/Context";
import type { EventInterface } from "./EventInterface";

dayjs.extend(weekday);
dayjs.extend(dayLocaleData);

const Home = () => {
  const {
    date,
    setDate,
    isModalOpen,
    setIsModalOpen,
    setRefreshEvents,
    currentUser,
    setCurrentUser,
  } = useContext(UContext);
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [calendarMode, setCalendarMode] = useState<"month" | "year">("month");
  const [email, setEmail] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  console.log(date, "Selected Date");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = (resetForm: () => void) => {
    resetForm();
    setDate(dayjs());
    setIsModalOpen(false);
  };

  const onPanelChange = (value: Dayjs) => {
    setCalendarValue(value);
  };

  const handleSearch = (e: any) => {
    console.log(e.target.value, "Search Input");
    if (e.key === "Enter") {
      setEmail(e.target.value);
    }
    if (e.key === "Backspace") {
      setEmail(e.target.value);
    }
    if (e.key === "Escape") {
      setEmail("");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (!email) {
        setSearchResults([]);
        return;
      }
      callApi({
        requestEndpoint: `${baseURL}user/getUser/${email}`,
        method: "get",
      })
        .then((response) => {
          console.log("User Data:", response.data.data);
          setSearchResults(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setSearchResults([]);
        });
    };

    getUser();
  }, [email]);

  const EventSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    start: Yup.string().required("Start date is required"),
    end: Yup.string().required("End date is required"),
    location: Yup.string(),
    allDay: Yup.boolean(),
    notification: Yup.boolean(),
    guest: Yup.string(),
    visibility: Yup.string().required("Visibility is required"),
  });

  return (
    <div className="flex bg-gray-100 flex-col">
      <div className="w-full py-4 bg-white rounded-lg shadow-sm flex items-center justify-between px-3 gap-3">
        <span className="text-2xl font-medium">
          {dayjs().format("dddd, MMMM DD, YYYY")}
        </span>
        <div className="flex gap-2">
          <Button onClick={showModal} variant="solid" size="large">
            <Plus size={18} />
            New Event
          </Button>

          <Formik
            enableReinitialize
            initialValues={{
              title: "",
              description: "",
              start: date,
              end: date,
              location: "",
              allDay: false,
              notification: false,
              guest: "",
              visibility: null,
            }}
            validationSchema={EventSchema}
            onSubmit={(values: EventInterface, { resetForm }) => {
              callApi({
                requestEndpoint: `${baseURL}user/addEvent`,
                method: "post",
                body: values,
              });
              setDate(dayjs());
              resetForm();
              handleOk();
              setRefreshEvents((prev) => !prev);
            }}
          >
            {({ values, errors, touched, setFieldValue, resetForm }) => {
              return (
                <Modal
                  title="Add New Event"
                  open={isModalOpen}
                  onCancel={() => handleCancel(resetForm)}
                  footer={null}
                >
                  <Form className="flex flex-col gap-4 mt-4 font-[Poppins]">
                    <div className="flex flex-col">
                      <label className="mb-1" htmlFor="title">
                        Title
                      </label>
                      <Input
                        name="title"
                        className="custom-input"
                        placeholder="Event Title"
                        style={{ width: "15rem" }}
                        value={values.title}
                        onChange={(e) => setFieldValue("title", e.target.value)}
                      />

                      {errors.title && touched.title && (
                        <span className="text-sm text-red-500">
                          {errors.title}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1" htmlFor="description">
                        Description
                      </label>
                      <TextArea
                        placeholder="Add description"
                        className="custom-input"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        value={values.description}
                        onChange={(e) =>
                          setFieldValue("description", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex gap-4">
                      {values.allDay && (
                        <div className="flex flex-col w-full">
                          <label className="mb-1">Date</label>
                          <DatePicker
                            className="custom-input w-60"
                            value={values.start ? dayjs(values.start) : null}
                            onChange={(date) => {
                              setFieldValue("start", date);
                              setFieldValue("end", date);
                            }}
                          />
                        </div>
                      )}
                      {!values.allDay && (
                        <div className="flex flex-col w-full">
                          <label className="mb-1">Date Range</label>
                          <DatePicker.RangePicker
                            showTime={{ format: "HH:mm" }}
                            format="YYYY-MM-DD HH:mm"
                            className="custom-input w-80"
                            value={
                              values.start && values.end
                                ? [dayjs(values.start), dayjs(values.end)]
                                : null
                            }
                            onChange={(dates) => {
                              setFieldValue("start", dates?.[0] || null);
                              setFieldValue("end", dates?.[1] || null);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-5">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={values.allDay}
                          onChange={(e) => {
                            setFieldValue("allDay", e.target.checked);
                            if (e.target.checked) {
                              setFieldValue("fromTime", null);
                              setFieldValue("toTime", null);
                            }
                          }}
                        />
                        <span>All Day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={values.notification}
                          onChange={(e) => {
                            setFieldValue("notification", e.target.checked);
                          }}
                        />
                        <span>Notification</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="visibility">Visibility</label>
                      <Select
                        allowClear
                        className="custom-input w-64"
                        placeholder="Select visibility"
                        value={values.visibility}
                        options={[
                          { value: "PUBLIC", label: "public" },
                          { value: "PRIVATE", label: "private" },
                        ]}
                        onChange={(value) => setFieldValue("visibility", value)}
                        suffixIcon={<ChevronDown size={16} />}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1" htmlFor="guest">
                        Guest
                      </label>
                      <Input
                        className="custom-input"
                        name="guest"
                        placeholder="Add Guest"
                        value={values.guest}
                        onChange={(e) => setFieldValue("guest", e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1" htmlFor="location">
                        Location
                      </label>
                      <Input
                        className="custom-input"
                        name="location"
                        placeholder="Location"
                        value={values.location}
                        onChange={(e) =>
                          setFieldValue("location", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                      <Button onClick={() => handleCancel(resetForm)}>
                        Cancel
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Add Event
                      </Button>
                    </div>
                  </Form>
                </Modal>
              );
            }}
          </Formik>
          <Button
            size="large"
            type={calendarMode === "month" ? "primary" : "default"}
            onClick={() => setCalendarMode("month")}
          >
            Month View
          </Button>
          <Button
            size="large"
            type={calendarMode === "year" ? "primary" : "default"}
            onClick={() => setCalendarMode("year")}
          >
            Year View
          </Button>
        </div>
      </div>
      <div className="mt-3 w-full flex gap-3">
        <div className="w-[17vw] rounded-lg">
          <div className="mb-3 flex justify-center">
            <button className="flex items-center w-full py-4 justify-center gap-2 rounded-lg !bg-white !text-[#4367EF] shadow-sm !font-medium">
              {<Clock size={22} />}
              <span className="text-xl">Book Appointment</span>
            </button>
          </div>
          <div className="shadow-sm rounded-lg">
            <Calendar
              className="bg-white"
              fullscreen={false}
              value={calendarValue}
              onSelect={setCalendarValue}
              headerRender={() => (
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ padding: 8 }}
                >
                  <span className="font-semibold text-black text-xl px-2">
                    {calendarValue.format("MMMM YYYY")}
                  </span>
                </Flex>
              )}
              onPanelChange={onPanelChange}
            />
          </div>
          <div className="bg-white p-4 mt-3 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <label className="font-medium" htmlFor="search">
                Search for Public Calendar
              </label>
              {currentUser ? (
                <span className="flex justify-between cursor-pointer bg-gray-200 rounded-2xl px-2 py-1 my-2">
                  <span className="px-2">{currentUser.email}</span>
                  <X
                    size={18}
                    className="mx-1.5"
                    onClick={() => setCurrentUser(null)}
                  />
                </span>
              ) : null}
            </div>
            <Input
              className="my-2"
              onKeyDown={(e: any) => handleSearch(e)}
              placeholder="Search People..."
              prefix={<Search className="text-gray-400" size={16} />}
            />
            {searchResults.length > 0 ? (
              <div className="mt-2">
                <p className="font-semibold mb-2">Search Results:</p>
                <ul className="cursor-pointer text-black border-b border-gray-200 rounded space-y-2">
                  {searchResults.map((user, index) => (
                    <li
                      key={index}
                      className="flex items-center group bg-gray-200 p-2 rounded"
                      onClick={() => setCurrentUser(user)}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                        <Mail className="h-3 w-3 text-white" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-md font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                          {user.username}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200 truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : email !== "" ? (
              <p className="pt-2 px-2 text-gray-500">No results found</p>
            ) : null}
          </div>
          <div className="bg-white p-4 mt-3 rounded-lg shadow-sm">
            <p className="text-xl font-medium">My Calenders</p>
            <div className="flex gap-2">
              <Circle className="text-green-600" size={18} />
              <p>Personal Task</p>
            </div>{" "}
            <div className="flex gap-2">
              <Circle className="text-blue-600" size={18} />
              <p>My Events</p>
            </div>
            <div className="flex gap-2">
              <Circle className="text-red-600" size={18} />
              <p>Team Meetings</p>
            </div>
          </div>
        </div>
        <div className="w-[83vw] h-[82vh] bg-white text-white p-4 rounded-lg shadow-sm">
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
