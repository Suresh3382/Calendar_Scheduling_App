import { Calendar as RBCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UContext } from "@/Utils/Context";
import { useContext, useEffect, useState } from "react";
import { callApi } from "@/Utils/AxiosConifg";
import { baseURL } from "@/baseURL";
import dayjs from "dayjs";
import { Button, Modal } from "antd";
import {
  X,
  Calendar as IconCalendar,
  Clock,
  FileText,
  MapPin,
  User,
  Eye,
} from "lucide-react";

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
  } = useContext(UContext);

  const handleSlotClick = (slotInfo: any) => {
    const clickedDate = dayjs(slotInfo.start);
    if (clickedDate.isValid()) {
      setDate(clickedDate);
      setIsModalOpen(true);
    }
  };

  const handleOk = () => setIsEventModalOpen(false);
  const handleCancel = () => setIsEventModalOpen(false);
  const onClose = () => setIsEventModalOpen(false);

  console.log("asas", currentUser);
  const LoggedUserId = localStorage.getItem("userId");

  useEffect(() => {
    callApi({
      requestEndpoint: `${baseURL}user/getEvents/${
        currentUser ? currentUser._id : LoggedUserId
      }`,
      method: "get",
    }).then((response) => {
      if (response?.data?.data) {
        const fixedEvents = response.data.data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setUserEvents(fixedEvents);
      } else {
        console.error("Failed to fetch events:", response?.message);
      }
    });
  }, [refreshEvents, currentUser]);

  return (
    <div className="h-[79vh]">
      <RBCalendar
        className="text-black"
        localizer={localizer}
        selectable
        onSelectSlot={handleSlotClick}
        onSelectEvent={(event) => {
          setCurrentEvent(event);
          setIsEventModalOpen(true);
        }}
        events={userEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
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
        <div className="bg-white rounded-sm overflow-hidden pb-2">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {currentEvent ? (
              <div>
                <h1 className="text-2xl font-bold mb-2 pr-12 leading-tight">
                  {currentEvent.title}
                </h1>
                <div className="flex items-center text-blue-100">
                  <IconCalendar className="w-4 h-4 mr-2" />
                  {dayjs(currentEvent.start).isSame(currentEvent.end, "day")
                    ? dayjs(currentEvent.start).format("DD MMM YYYY")
                    : `${dayjs(currentEvent.start).format(
                        "DD MMM YYYY"
                      )} - ${dayjs(currentEvent.end).format("DD MMM YYYY")}`}
                </div>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">Event Details</h1>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {currentEvent ? (
              <div className="space-y-6">
                {!currentEvent.allDay &&
                  (currentEvent.start || currentEvent.end) && (
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          Time
                        </span>
                        <p className="text-sm text-gray-600">
                          {dayjs(currentEvent.start).isSame(
                            currentEvent.end,
                            "minute"
                          )
                            ? `${dayjs(currentEvent.start).format("hh:mm A")}`
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
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-900">
                        Description
                      </span>
                      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        {currentEvent.description}
                      </div>
                    </div>
                  </div>
                )}

                {currentEvent.location && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        Location
                      </span>
                      <p className="text-sm text-gray-600">
                        {currentEvent.location}
                      </p>
                    </div>
                  </div>
                )}

                {currentEvent.guest && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        Guest
                      </span>
                      <p className="text-sm text-gray-600">
                        {currentEvent.guest}
                      </p>
                    </div>
                  </div>
                )}

                {currentEvent.visibility && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        Visibility
                      </span>
                      <span className="inline-flex items-center rounded-sm text-xs text-gray-800 capitalize">
                        {currentEvent.visibility}
                      </span>
                    </div>
                  </div>
                )}
              </div>
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
