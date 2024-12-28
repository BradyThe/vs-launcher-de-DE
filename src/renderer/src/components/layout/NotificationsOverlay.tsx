import { motion, AnimatePresence } from "motion/react"
import { PiInfoFill, PiWarningFill, PiCheckCircleFill, PiProhibitInsetFill, PiXBold } from "react-icons/pi"
import { useTranslation } from "react-i18next"

import { useNotificationsContext } from "@renderer/contexts/NotificationsContext"

const BORDER_COLOR_TYPES = {
  success: "border-lime-600",
  info: "border-vs",
  error: "border-red-800",
  warning: "border-yellow-400"
}

const FONT_COLOR_TYPES = {
  success: "text-lime-600",
  info: "text-vs",
  error: "text-red-600",
  warning: "text-yellow-400"
}

const ICON_TYPES = {
  success: <PiCheckCircleFill />,
  info: <PiInfoFill />,
  error: <PiProhibitInsetFill />,
  warning: <PiWarningFill />
}

function NotificationsOverlay(): JSX.Element {
  const { t } = useTranslation()
  const { notifications, removeNotification } = useNotificationsContext()

  return (
    <div className="w-[300px] h-fit absolute flex flex-col items-end top-0 right-0 z-[1000] p-2 gap-2">
      <AnimatePresence>
        {notifications.map(({ id, title, body, type, options }) => (
          <motion.div
            key={id}
            className={`w-[300px] flex items-center justify-between gap-2 p-2 rounded text-center bg-zinc-850 border-l-4 ${BORDER_COLOR_TYPES[type]}`}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (options?.onClick) options?.onClick()
            }}
          >
            <div className="flex items-center gap-2 text-start">
              <span className={`text-xl p-2 rounded-full border ${BORDER_COLOR_TYPES[type]} ${FONT_COLOR_TYPES[type]}`}>{ICON_TYPES[type]}</span>
              <div className="flex flex-col items-start justify-center select-none">
                <h3 className="font-bold text-sm">{title}</h3>
                <p className="text-xs text-zinc-500">{body}</p>
              </div>
            </div>
            <button
              className="p-1 text-zinc-500"
              title={t("notifications.delete")}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeNotification(id)
              }}
            >
              <PiXBold />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationsOverlay
