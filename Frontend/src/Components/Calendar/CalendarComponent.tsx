import { Calendar as RBCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UContext } from "@/Utils/Context";
import { useContext, useEffect, useState } from "react";
import { callApi } from "@/Utils/AxiosConifg";
import { baseURL } from "@/baseURL";
import dayjs from "dayjs";
import {
  X,
  Calendar as IconCalendar,
  Clock,
  FileText,
  MapPin,
  User,
  Eye,
  Trash2,
} from "lucide-react";
import type { EventInterface } from "../Home/EventInterface";
import { Modal, Spin } from "antd";
import toast from "react-hot-toast";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const {
    userEvents,
    setUserEvents,
    setDate,
    setIsModalOpen,
    refreshEvents,
    setCurrentEvent,
    currentEvent,
    currentUser,
    view,
    setView,
    setCalendarDate,
    calendarDate,
    loader,
    setLoader,
    email,
    searchedTerm,
  } = useContext(UContext);

  const LoggedUserId = localStorage.getItem("userId");

  const handleSlotClick = (slotInfo: any) => {
    if (!currentUser) {
      const clickedDate = dayjs(slotInfo.start);
      if (clickedDate.isValid()) {
        setDate(clickedDate);
        setIsModalOpen(true);
      }
    }
  };

  const handleOk = () => setIsEventModalOpen(false);
  const handleCancel = () => setIsEventModalOpen(false);
  const onClose = () => setIsEventModalOpen(false);

  const fetchEvents = async () => {
    try {
      if (email) {
        setLoader(true);
      }
      const response = await callApi({
        requestEndpoint: `${baseURL}user/getEvents`,
        method: "post",
        body: {
          requestedUserId: currentUser ? currentUser._id : LoggedUserId,
        },
      });

      if (response?.data?.data) {
        const fixedEvents = response.data.data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setUserEvents(fixedEvents);
      } else {
        console.error("Failed to fetch events:", response?.message);
        setUserEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setUserEvents([]);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshEvents, currentUser]);

  const eventStyleGetter = (event: EventInterface) => {
    let backgroundColor = currentUser
      ? "linear-gradient(135deg, #f97316, #ffb347)"
      : event?.visibility === "PUBLIC"
      ? "linear-gradient(135deg, #2196F3, #6dd5fa)"
      : "linear-gradient(135deg, #32CD32, #a8e063)";

    return {
      style: {
        background: backgroundColor,
        color: "#fff",
        borderRadius: "10px",
        fontSize: "14px",
        padding: "6px 8px",
        fontWeight: 500,
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
      },
    };
  };

  const handleDelete = async (currentEvent: EventInterface) => {
    try {
      setLoader(true);
      const res = await callApi({
        requestEndpoint: `${baseURL}user/deleteEvent/${currentEvent._id}`,
        method: "post",
      });

      const { success, message } = res.data;
      if (success) {
        toast.success(message);
        setIsEventModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="relative h-[79vh]">
      {loader && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
          <Spin size="default" />
        </div>
      )}

      <RBCalendar
        className="text-black"
        date={calendarDate}
        localizer={localizer}
        selectable
        toolbar={false}
        view={view}
        onView={(newView) => setView(newView)}
        onSelectSlot={handleSlotClick}
        onNavigate={(newDate) => setCalendarDate(newDate)}
        onSelectEvent={(event) => {
          setCurrentEvent(event);
          setIsEventModalOpen(true);
        }}
        eventPropGetter={eventStyleGetter}
        events={loader ? [] : userEvents}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        style={{ height: "100%" }}
      />

      <Modal
        closable={false}
        open={isEventModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="my-event-modal font-[Poppins]"
        footer={null}
      >
        <div className="rounded-lg shadow-lg overflow-hidden">
          <div
            className={`relative px-6 py-8 text-white ${
              currentUser
                ? "bg-orange-500"
                : currentEvent?.visibility === "PUBLIC"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          >
            {!currentUser && (
              <button
                onClick={() => handleDelete(currentEvent as EventInterface)}
                className="absolute top-4 right-15 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {currentEvent ? (
              <>
                <h1 className="text-2xl font-semibold mb-2 pr-12 leading-tight">
                  {currentEvent.title}
                </h1>
                <div className="flex items-center text-gray-300 text-sm">
                  <IconCalendar className="w-4 h-4 mr-2" />
                  {dayjs(currentEvent.start).isSame(currentEvent.end, "day")
                    ? dayjs(currentEvent.start).format("DD MMM YYYY")
                    : `${dayjs(currentEvent.start).format(
                        "DD MMM YYYY"
                      )} - ${dayjs(currentEvent.end).format("DD MMM YYYY")}`}
                </div>
              </>
            ) : (
              <h1 className="text-2xl font-semibold">Event Details</h1>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
            {currentEvent ? (
              <>
                {!currentEvent.allDay &&
                  (currentEvent.start || currentEvent.end) && (
                    <div className="flex items-start space-x-4">
                      <Clock className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          Time
                        </span>
                        <p className="text-sm text-gray-600">
                          {dayjs(currentEvent.start).isSame(
                            currentEvent.end,
                            "date"
                          )
                            ? dayjs(currentEvent.start).hour() === 0 &&
                              dayjs(currentEvent.start).minute() === 0 &&
                              dayjs(currentEvent.end).hour() === 23 &&
                              dayjs(currentEvent.end).minute() === 59
                              ? `${dayjs(currentEvent.start).format(
                                  "DD MMM YYYY"
                                )}`
                              : `${dayjs(currentEvent.start).format(
                                  "DD MMM YYYY, hh:mm A"
                                )} - ${dayjs(currentEvent.end).format(
                                  "hh:mm A"
                                )}`
                            : dayjs(currentEvent.start).hour() === 0 &&
                              dayjs(currentEvent.start).minute() === 0 &&
                              dayjs(currentEvent.end).hour() === 23 &&
                              dayjs(currentEvent.end).minute() === 59
                            ? `${dayjs(currentEvent.start).format(
                                "DD MMM YYYY"
                              )} - ${dayjs(currentEvent.end).format(
                                "DD MMM YYYY"
                              )}`
                            : `${dayjs(currentEvent.start).format(
                                "DD MMM YYYY, hh:mm A"
                              )} - ${dayjs(currentEvent.end).format(
                                "DD MMM YYYY, hh:mm A"
                              )}`}
                        </p>
                      </div>
                    </div>
                  )}

                {currentEvent.description && (
                  <div className="flex items-start space-x-4">
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Description
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {currentEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {currentEvent.location && (
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Location
                      </span>
                      <p className="text-sm text-gray-600">
                        {currentEvent.location}
                      </p>
                    </div>
                  </div>
                )}

                {currentEvent.guest && (
                  <div className="flex items-start space-x-4">
                    <User className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Guest
                      </span>
                      <p className="text-sm text-gray-600">
                        {currentEvent.guest}
                      </p>
                    </div>
                  </div>
                )}

                {currentEvent.visibility && (
                  <div className="flex items-start space-x-4">
                    <Eye className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Visibility
                      </span>
                      <p className="text-sm text-gray-600 capitalize">
                        {currentEvent.visibility === "PUBLIC"
                          ? "Public"
                          : "Private"}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconCalendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No event selected</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
