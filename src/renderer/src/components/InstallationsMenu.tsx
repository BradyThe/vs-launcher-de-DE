import { useContext, useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa6"
import { InstallationContext } from "@renderer/contexts/InstallationContext"
import { InstallationsContext } from "@renderer/contexts/InstallationsContext"
import { useTranslation } from "react-i18next"

function InstallationsMenu({ className }: { className?: string }): JSX.Element {
  const { installations } = useContext(InstallationsContext)
  const { installation, setInstallation } = useContext(InstallationContext)
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`min-h-16 max-h-48 flex flex-col font-bold bg-zinc-800 rounded ${className}`}>
      {installations.length === 0 ? (
        <div className="w-full h-fit p-2 flex flex-col justify-center items-center rounded text-center">
          <p>{t("component-installationsMenu-noInstallationsAvailable")}</p>
          <p className="text-zinc-400 text-xs">{t("component-installationsMenu-noInstallationsAvailableSub")}</p>
        </div>
      ) : (
        <>
          {isOpen && (
            <div className="w-full max-h-64 overflow-y-scroll">
              {installations.map(
                (current) =>
                  current.id != installation?.id && (
                    <button
                      key={current.id}
                      onClick={() => {
                        setInstallation(current)
                        window.localStorage.setItem("installation", current.id)
                        setIsOpen(false)
                      }}
                      className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0"
                    >
                      <div className="flex flex-col items-start justify-center">
                        <span>{current.name}</span>
                        <span className="text-sm text-zinc-400">
                          {current.version}
                          {current.mods.length > 0 && ` (${t("component-installationsMenu-modsCount", { count: current.mods.length })})`}
                        </span>
                      </div>
                    </button>
                  )
              )}
            </div>
          )}
          {!installation ? (
            <button
              title={isOpen ? t("component-general-closeMenu") : t("component-general-openMenu")}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
            >
              <div className="flex flex-col items-start justify-center">
                <span>{t("component-installationsMenu-noInstallationSelected")}</span>
                <span className="text-sm text-zinc-400">X.X.X</span>
              </div>
              {isOpen ? <FaAngleDown /> : <FaAngleUp />}
            </button>
          ) : (
            <>
              {installations.map(
                (current) =>
                  current.id === installation.id && (
                    <button
                      title={isOpen ? t("component-general-closeMenu") : t("component-general-openMenu")}
                      key={current.id}
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full h-16 px-4 py-2 flex justify-between items-center rounded shrink-0 shadow-md shadow-zinc-950 hover:shadow-sm hover:shadow-zinc-950 active:shadow-inner active:shadow-zinc-950"
                    >
                      <div className="flex flex-col items-start justify-center">
                        <span>{current.name}</span>
                        <span className="text-sm text-zinc-400">
                          {current.version}
                          {current.mods.length > 0 && ` (${t("component-installationsMenu-modsCount", { count: current.mods.length })})`}
                        </span>
                      </div>
                      {isOpen ? <FaAngleDown /> : <FaAngleUp />}
                    </button>
                  )
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default InstallationsMenu
