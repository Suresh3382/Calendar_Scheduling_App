import { ChevronDown, Circle, Plus } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Calendar,
  DatePicker,
  Flex,
  Input,
  Modal,
  Space,
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

dayjs.extend(dayLocaleData);

const Home = () => {
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [calendarMode, setCalendarMode] = useState<"month" | "year">("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allDay, setAllDay] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onPanelChange = (value: Dayjs) => {
    setCalendarValue(value);
  };

  const EventSchema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string(),
    date: Yup.string().required(),
    from: Yup.string().required(),
    to: Yup.string().required(),
    location: Yup.string(),
    allDay: Yup.boolean(),
  });

  return (
    <div className="flex bg-gray-100 flex-col p-3">
      <div className="w-full py-4 bg-white rounded-lg flex items-center justify-between px-3 gap-5">
        <DatePicker
          allowClear={false}
          defaultValue={dayjs()}
          onChange={(e) => {
            console.log("Selected Date:", e?.format("YYYY-MM-DD"));
          }}
          format={"dddd, MMMM DD, YYYY"}
          className="my-first-datepicker flex justify-center border-0 font-[Poppins]"
          suffixIcon={<ChevronDown className="text-black" size={18} />}
        />
        <div className="flex gap-2">
          <Button
            onClick={showModal}
            color="geekblue"
            variant="solid"
            size="large"
          >
            <Plus size={18} />
            New Event
          </Button>
          <Modal
            title="Add New Event"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Formik
              initialValues={{
                title: "",
                description: "",
                from: "",
                to: "",
                date: calendarValue ? calendarValue : "",
                location: "",
                allDay: false,
              }}
              validationSchema={EventSchema}
              onSubmit={(values, { resetForm }) => {
                console.log("Event submitted:", values);
                resetForm();
                handleOk();
              }}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="title" className="text-sm font-medium mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Event Title"
                      value={values.title}
                      onChange={(e) => setFieldValue("title", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium mb-1"
                    >
                      Description
                    </label>
                    <TextArea
                      rows={3}
                      placeholder="Optional details..."
                      value={values.description}
                      onChange={(e) =>
                        setFieldValue("description", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="date" className="text-sm font-medium mb-1">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      className="custom-picker w-full"
                      format="YYYY-MM-DD"
                      value={
                        values.date ? dayjs(values.date, "YYYY-MM-DD") : null
                      }
                      onChange={(date) =>
                        setFieldValue(
                          "date",
                          date ? date.format("YYYY-MM-DD") : ""
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="from"
                        className="text-sm font-medium mb-1"
                      >
                        From <span className="text-red-500">*</span>
                      </label>
                      <TimePicker
                        className="custom-picker w-full"
                        format="HH:mm"
                        disabled={allDay}
                        value={values.from ? dayjs(values.from, "HH:mm") : null}
                        onChange={(time) =>
                          setFieldValue(
                            "from",
                            time ? time.format("HH:mm") : ""
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="to" className="text-sm font-medium mb-1">
                        To <span className="text-red-500">*</span>
                      </label>
                      <TimePicker
                        className="custom-picker w-full"
                        format="HH:mm"
                        disabled={allDay}
                        value={values.to ? dayjs(values.to, "HH:mm") : null}
                        onChange={(time) =>
                          setFieldValue("to", time ? time.format("HH:mm") : "")
                        }
                      />
                    </div>
                  </div>

                  <div className="flex">
                    <Checkbox
                      checked={values.allDay}
                      onChange={(e) => {
                        setFieldValue("allDay", e.target.checked);
                        setAllDay(e.target.checked);
                      }}
                    >
                      All Day Event
                    </Checkbox>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium mb-1"
                    >
                      Location
                    </label>
                    <Input
                      placeholder="Enter location"
                      value={values.location}
                      onChange={(e) =>
                        setFieldValue("location", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button htmlType="submit" type="primary">
                      Save
                    </Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
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

      <div className="mt-4 w-full flex gap-4">
        <div className="w-[17vw] rounded-lg">
          <div className="shadow-xs rounded-lg">
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
          <div className="bg-white p-4 mt-3 rounded-lg shadow-xs">
            <p className="text-xl font-semibold">My Calenders</p>
            <div className="flex gap-2">
              <Circle className="text-green-600" size={18} />
              <p>Personal Task</p>
            </div>            <div className="flex gap-2">
              <Circle className="text-blue-600" size={18} />
              <p>My Events</p>
            </div>
            <div className="flex gap-2">
              <Circle className="text-red-600" size={18} />
              <p>Team Meetings</p>
            </div>
          </div>
        </div>
        <div className="w-[80vw] bg-white text-white p-4 rounded-lg shadow-xs">
          <Calendar
            className="p-4"
            value={calendarValue}
            mode={calendarMode}
            onSelect={setCalendarValue}
            onPanelChange={onPanelChange}
            headerRender={() => null}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
