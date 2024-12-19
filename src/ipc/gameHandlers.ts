import { ipcMain } from "electron"
import { spawn } from "child_process"
import fse from "fs-extra"
import { join } from "path"
import os from "os"
import { logMessage } from "@src/utils/logManager"
import { IPC_CHANNELS } from "./index"

export function gameHandlerRegisterIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.GAME_MANAGER.EXECUTE_GAME, async (_event, version: InstalledGameVersionType, installation: InstallationType): Promise<boolean> => {
    logMessage("info", `[execute-game] Executing game version ${version.version}`)

    if (os.platform() === "linux") {
      logMessage("info", `[execute-game] Linux platform detected`)

      return new Promise((resolve, reject) => {
        try {
          logMessage("info", `[execute-game] Checking how to run the game`)

          const files = fse.readdirSync(version.path)

          if (files.includes("Vintagestory")) {
            logMessage("info", `[execute-game] Vintagestory detected, running with Vintagestory <args>`)

            const externalApp = spawn(join(version.path, "Vintagestory"), [`--dataPath=${installation.path}`])

            externalApp.stdout.on("data", (data) => {
              logMessage("info", `[execute-game] Game sent data: ${data}`)
            })

            externalApp.stderr.on("data", (data) => {
              logMessage("error", `[execute-game] Game sent an error: ${data}`)
            })

            externalApp.on("close", (code) => {
              logMessage("info", `[execute-game] Game closed with code: ${code}`)
              resolve(true)
            })

            externalApp.on("error", (error) => {
              logMessage("error", `[execute-game] Game error: ${error}`)
              reject(false)
            })
          } else if (files.includes("Vintagestory.exe")) {
            logMessage("info", `[execute-game] Vintagestory.exe detected, running with mono Vintagestory.exe <args>`)

            const externalApp = spawn("mono", [join(version.path, "Vintagestory.exe"), `--dataPath=${installation.path}`])

            externalApp.stdout.on("data", (data) => {
              logMessage("info", `[execute-game] Game sent data: ${data}`)
            })

            externalApp.stderr.on("data", (data) => {
              logMessage("error", `[execute-game] Game sent an error: ${data}`)
            })

            externalApp.on("close", (code) => {
              logMessage("info", `[execute-game] Game closed with code: ${code}`)
              resolve(true)
            })

            externalApp.on("error", (error) => {
              logMessage("error", `[execute-game] Game error: ${error}`)
              reject(false)
            })
          } else {
            logMessage("info", `[execute-game] Couldn't find a way to run the game, aborting...`)
            reject(false)
          }
        } catch (error) {
          reject(false)
        }
      })
    } else if (os.platform() === "win32") {
      logMessage("info", `[execute-game] Windows platform detected`)

      return new Promise((resolve, reject) => {
        try {
          logMessage("info", `[execute-game] Executing game version ${version.version} from ${version.path}\\Vintagestory.exe with data path ${installation.path}`)

          const externalApp = spawn(join(version.path, "Vintagestory.exe"), [`--dataPath=${installation.path}`])

          externalApp.stdout.on("data", (data) => {
            logMessage("info", `[execute-game] Game sent data: ${data}`)
          })

          externalApp.stderr.on("data", (data) => {
            logMessage("error", `[execute-game] Game sent an error: ${data}`)
          })

          externalApp.on("close", (code) => {
            logMessage("info", `[execute-game] Game closed with code: ${code}`)
            resolve(true)
          })

          externalApp.on("error", (error) => {
            logMessage("error", `[execute-game] Game error: ${error}`)
            reject(false)
          })
        } catch (error) {
          reject(false)
        }
      })
    } else {
      logMessage("info", `[execute-game] No platform detected`)

      return Promise.reject(false)
    }
  })
}
