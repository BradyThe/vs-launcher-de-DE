import { AnimatePresence, motion } from "motion/react"
import { PiDownloadFill, PiFileZipFill, PiXBold } from "react-icons/pi"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"

import { useTaskContext } from "@renderer/contexts/TaskManagerContext"
import { useTranslation } from "react-i18next"

const NAME_BY_TYPE = {
  download: "components.tasksMenu.downloading",
  extract: "components.tasksMenu.extracting"
}

const FONT_COLOR_TYPES = {
  pending: "text-vs",
  "in-progress": "text-yellow-400",
  failed: "text-red-800",
  completed: "text-lime-600"
}

const ICON_TYPES = {
  download: <PiDownloadFill />,
  extract: <PiFileZipFill />
}

function TasksMenu(): JSX.Element {
  const { t } = useTranslation()
  const { tasks, removeTask } = useTaskContext()

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton className="w-7 h-7 bg-zinc-850 rounded flex items-center justify-center shadow shadow-zinc-900 hover:shadow-none">
            <PiDownloadFill />
          </PopoverButton>
          <AnimatePresence>
            {open && (
              <PopoverPanel
                static
                as={motion.div}
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                anchor="bottom"
                className="w-80 translate-y-1 translate-x-2 z-50 bg-zinc-850 rounded"
              >
                <div className="flex flex-col max-h-80">
                  <AnimatePresence>
                    {tasks.length < 1 && (
                      <div>
                        <h3 className="text-sm font-bold text-center p-2">{t("components.tasksMenu.noTasksAvailable")}</h3>
                      </div>
                    )}
                    {tasks.map((task) => (
                      <motion.div key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col">
                        <div className="w-full flex justify-between gap-2 p-1">
                          <div className="w-full flex items-center gap-2">
                            <span className={`text-xl p-2 ${FONT_COLOR_TYPES[task.status]}`}>{ICON_TYPES[task.type]}</span>
                            <div className="flex flex-col items-start justify-center select-none">
                              <h3 className="font-bold text-sm">{`${t(NAME_BY_TYPE[task.type])}`}</h3>
                              <p className="text-xs text-zinc-500">{task.desc}</p>
                              {task.status === "failed" && <p className={`text-xs ${FONT_COLOR_TYPES["failed"]}`}>{t("components.tasksMenu.error")}</p>}
                            </div>
                          </div>
                          {(task.status === "completed" || task.status === "failed") && (
                            <button className="p-1 text-zinc-500" title={t("generic.discard")} onClick={() => removeTask(task.id)}>
                              <PiXBold />
                            </button>
                          )}
                        </div>
                        {task.status === "in-progress" && (
                          <div className="w-full h-1 bg-zinc-900 rounded-full">
                            <motion.div
                              className={`h-full bg-vs rounded-full`}
                              initial={{ width: `${task.progress}%` }}
                              animate={{ width: `${task.progress}%` }}
                              transition={{ ease: "easeInOut", duration: 0.2 }}
                            ></motion.div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  )
}

export default TasksMenu
