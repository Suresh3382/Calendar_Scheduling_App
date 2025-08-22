import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Plus,
  Search,
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
  Radio,
  Select,
  Skeleton,
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
import toast from "react-hot-toast";

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
    view,
    setView,
    calendarDate,
    setCalendarDate,
    email,
    setEmail,
    setLoader,
    userEvents,
    searchedTerm,
    setSearchedTerm,
    loggedUser,
  } = useContext(UContext);
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchEventsResults, setSearchEventsResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

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
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setSearchedTerm(e.target.value);
      console.log(searchedTerm);
    }
  };

  const handlePrev = () => {
    const newDate =
      view === "month"
        ? dayjs(calendarDate).subtract(1, "month").toDate()
        : view === "week"
        ? dayjs(calendarDate).subtract(1, "week").toDate()
        : dayjs(calendarDate).subtract(1, "day").toDate();
    setCalendarDate(newDate);
  };

  const handleNext = () => {
    const newDate =
      view === "month"
        ? dayjs(calendarDate).add(1, "month").toDate()
        : view === "week"
        ? dayjs(calendarDate).add(1, "week").toDate()
        : dayjs(calendarDate).add(1, "day").toDate();
    setCalendarDate(newDate);
  };

  const handleToday = () => {
    setCalendarDate(new Date());
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

  useEffect(() => {
    const getSearchedEvents = async () => {
      if (!searchedTerm) {
        setSearchEventsResults([]);
        return;
      }
      setLoadingSearch(true);
      callApi({
        requestEndpoint: `${baseURL}user/getSearchTermEvents`,
        method: "post",
        body: {
          searchTerm: searchedTerm,
          userId: currentUser ? currentUser._id : loggedUser,
        },
      })
        .then((response) => {
          setSearchEventsResults(response.data.data);
        })
        .catch(() => {
          setSearchEventsResults([]);
        })
        .finally(() => setLoadingSearch(false));
    };

    getSearchedEvents();
  }, [searchedTerm]);

  const EventSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    location: Yup.string(),
    allDay: Yup.boolean(),
    notification: Yup.boolean(),
    guest: Yup.string(),
    visibility: Yup.string().required("Visibility is required"),
  });

  const getFormattedDate = () => {
    if (view === "month") {
      return dayjs(calendarDate).format("MMMM YYYY");
    }
    if (view === "week") {
      const start = dayjs(calendarDate).startOf("week").format("MMM DD");
      const end = dayjs(calendarDate).endOf("week").format("MMM DD, YYYY");
      return `${start} - ${end}`;
    }
    if (view === "day") {
      return dayjs(calendarDate).format("dddd, MMMM DD, YYYY");
    }
    return "";
  };

  return (
    <div className="flex bg-gray-100 flex-col">
      <div className="w-full py-4 bg-white rounded-lg shadow-sm flex items-center justify-between px-4 gap-3">
        <span className="flex  gap-6 text-2xl font-medium">
          {getFormattedDate()}
          <div className="flex gap-4 text-lg items-center">
            <ChevronLeft className="cursor-pointer" onClick={handlePrev} />
            <ChevronRight className="cursor-pointer" onClick={handleNext} />
          </div>
        </span>
        <div className="flex gap-2">
          <div className="w-96 relative">
            <Input
              onKeyDown={(e: any) => handleKeyDown(e)}
              onChange={(e: any) => {
                e.target.value === "" && setSearchedTerm("");
              }}
              placeholder="Search Events..."
              prefix={<Search size={18} className="text-gray-400" />}
              allowClear
              className="rounded-xl border border-gray-200 shadow-sm hover:border-blue-400 focus:border-blue-500 transition-all duration-200"
            />
            {searchedTerm && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-lg h-[200px] overflow-y-auto z-50 animate-slideDown">
                {loadingSearch ? (
                  <div className="flex flex-col gap-2 p-2">
                    {[1, 2, 3].map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        <Skeleton.Avatar active size={50} shape="circle" />
                        <div className="w-full flex flex-col gap-1">
                          <Skeleton.Input
                            active
                            size="small"
                            style={{
                              width: "40%",
                              height: 16,
                              borderRadius: 4,
                            }}
                          />
                          <Skeleton.Input
                            active
                            size="small"
                            style={{
                              width: "100%",
                              height: 15,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchEventsResults.length > 0 ? (
                  searchEventsResults.map((event: EventInterface, idx) => (
                    <div
                      key={event._id || idx}
                      onClick={() =>
                        setCalendarDate(dayjs(event.start).toDate())
                      }
                      className="flex items-center p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-all duration-200"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-300 text-white rounded-full font-bold">
                        <span className="w-12 h-12 flex items-center justify-center">
                          {event.title.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {event.description && (
                            <span className="pe-2">{event.description},</span>
                          )}
                          {event.start === event.end
                            ? dayjs(event.start).format("DD MMM YYYY")
                            : `${dayjs(event.start).format(
                                "DD MMM YYYY"
                              )} - ${dayjs(event.end).format("DD MMM YYYY")}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  searchedTerm && (
                    <span className="flex justify-center items-center py-4 text-gray-500 text-center">
                      No events found
                    </span>
                  )
                )}
              </div>
            )}
          </div>
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
              end: dayjs(date).hour(23).minute(59).second(59).millisecond(999),
              location: "",
              allDay: false,
              notification: false,
              guest: "",
              recurrence: null,
              visibility: null,
            }}
            validationSchema={EventSchema}
            onSubmit={async (values: EventInterface, { resetForm }) => {
              try {
                const finalValues = {
                  ...values,
                  recurrence: values.recurrence || "NO",
                };
                setLoader(true);
                const res = await callApi({
                  requestEndpoint: `${baseURL}user/addEvent`,
                  method: "post",
                  body: finalValues,
                });
                if (res.data.success) {
                  setDate(dayjs());
                  resetForm();
                  handleOk();
                  setRefreshEvents((prev) => !prev);
                }
              } catch (err) {
                console.error("Error adding event:", err);
                toast.error("Failed to add event");
              } finally {
                setLoader(false);
              }
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
                        Title <span className="text-red-500">*</span>
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
                          <label className="mb-1">
                            Date <span className="text-red-500">*</span>
                          </label>
                          <DatePicker.RangePicker
                            className="custom-input w-64"
                            value={[
                              values.start ? dayjs(values.start) : null,
                              values.end ? dayjs(values.end) : null,
                            ]}
                            onChange={(dates) => {
                              if (!dates) return;

                              let [startDate, endDate] = dates;

                              if (values.allDay) {
                                startDate = startDate?.startOf("day") ?? null;
                                endDate = endDate?.endOf("day") ?? null;
                              }

                              setFieldValue("start", startDate);
                              setFieldValue("end", endDate);
                            }}
                          />
                        </div>
                      )}

                      {!values.allDay && (
                        <div className="flex flex-col w-full">
                          <label className="mb-1">
                            Date <span className="text-red-500">*</span>
                          </label>
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
                          defaultChecked
                          checked={values.allDay}
                          onChange={(e) => {
                            setFieldValue("allDay", e.target.checked);
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
                    <div className="flex flex-col gap-2">
                      <label>Repeat</label>
                      <Select
                        placeholder="Does not repeat"
                        allowClear
                        className="w-64"
                        value={values.recurrence}
                        onChange={(value) => setFieldValue("recurrence", value)}
                        options={[
                          { label: "Daily", value: "DAILY" },
                          { label: "Weekly", value: "WEEKLY" },
                        ]}
                      />
                    </div>
                    {values.start === (values.end)}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="visibility">
                        Visibility <span className="text-red-500">*</span>
                      </label>
                      <Select
                        allowClear
                        className="custom-input w-64"
                        placeholder="Select visibility"
                        value={values.visibility}
                        options={[
                          { value: "PUBLIC", label: "Public" },
                          { value: "PRIVATE", label: "Private" },
                        ]}
                        onChange={(value) => setFieldValue("visibility", value)}
                        suffixIcon={<ChevronDown size={16} />}
                      />
                      {errors.visibility && touched.visibility && (
                        <span className="text-sm text-red-500">
                          {errors.visibility}
                        </span>
                      )}
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
          <Radio.Group
            value={view}
            onChange={(e) => setView(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="month">Month</Radio.Button>
            <Radio.Button value="week">Week</Radio.Button>
            <Radio.Button value="day">Day</Radio.Button>
          </Radio.Group>

          <Button size="large" onClick={handleToday}>
            Today
          </Button>
        </div>
      </div>
      <div className="mt-3 w-full flex gap-3">
        <div className="w-[17vw] rounded-lg">
          {/* <div className="mb-3 flex justify-center">
            <button className="flex items-center w-full py-4 justify-center gap-2 rounded-lg !bg-white !text-[#4367EF] shadow-sm !font-medium">
              {<Clock size={22} />}
              <span className="text-xl">Book Appointment</span>
            </button>
          </div> */}
          <div className="bg-white p-4 mb-3 rounded-lg shadow-sm">
            <div className="flex flex-col">
              <label className="font-medium my-1" htmlFor="search">
                Search for Public Calendar
              </label>
              {currentUser ? (
                <span className="flex justify-between cursor-pointer bg-gray-200 rounded-2xl px-2 py-1.5 my-2">
                  <span className="px-3">{currentUser.email}</span>
                  <X
                    size={18}
                    className="mx-1.5"
                    onClick={() => {
                      setCurrentUser(null);
                      setLoader(true);
                    }}
                  />
                </span>
              ) : null}
            </div>
            <Input
              className="my-2"
              onKeyDown={(e: any) => handleSearch(e)}
              onChange={(e: any) => {
                e.target.value === "" && setEmail("");
              }}
              placeholder="Search People..."
              prefix={<Search className="text-gray-400" size={16} />}
              allowClear
            />
            {searchResults.length > 0 ? (
              <div className="mt-2">
                <p className="font-semibold mb-2">Search Results:</p>
                <ul className="cursor-pointer text-black border-b border-gray-200 rounded space-y-2">
                  {searchResults.map((user, index) => (
                    <li
                      key={index}
                      className="flex items-center group bg-gray-200 p-2 rounded"
                      onClick={() => {
                        setCurrentUser(user);
                        setLoader(true);
                      }}
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-300 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
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
          <div className="shadow-sm rounded-lg mt-2">
            <Calendar
              className="bg-white"
              fullscreen={false}
              value={dayjs(calendarDate)}
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
            <p className="text-xl font-medium">My Calendars</p>

            <div className="flex gap-2 my-2 items-center py-0.5">
              <span className="w-4 h-4 bg-[#32CD32] rounded-full"></span>
              <span>Personal Events</span>
            </div>

            <div className="flex gap-2 my-2 items-center py-0.5">
              <span className="w-4 h-4 bg-[#2196F3] rounded-full"></span>
              <span>Public Events</span>
            </div>

            <div className="flex gap-2 my-2 items-center py-0.5">
              <span className="w-4 h-4 bg-[#f97316] rounded-full"></span>
              <span>Others Event</span>
            </div>
          </div>
          <div className="mt-3">
            {!currentUser && (
              <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col gap-0.5">
                <p className="text-lg font-medium">Monthly Overview</p>

                <div className="flex justify-between py-0.5">
                  <span>Events Today :</span>
                  <span className="font-medium">
                    {userEvents?.filter((e) =>
                      dayjs(e.start).isSame(dayjs(), "day")
                    ).length || 0}
                  </span>
                </div>

                <div className="flex justify-between py-0.5">
                  <span>Events This Week :</span>
                  <span className="font-medium">
                    {userEvents?.filter((e) =>
                      dayjs(e.start).isSame(dayjs(), "week")
                    ).length || 0}
                  </span>
                </div>

                <div className="flex justify-between pb-1 pt-0.5">
                  <span>Events This Month :</span>
                  <span className="font-medium">
                    {userEvents?.filter((e) =>
                      dayjs(e.start).isSame(dayjs(), "month")
                    ).length || 0}
                  </span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span>Total Events :</span>
                  <span className="font-medium">{userEvents?.length || 0}</span>
                </div>
              </div>
            )}
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
