import {app} from "./settings";
import {port, runDb} from "./db/mongoDb";



const startApp=async ()=>{
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()

/*
index.js  вход в приложение

startApp() будет запускать приложение

await runDb()   соединение к базе данных

app.listen(port, () => {   Вызывается метод listen() объекта app,
 который запускает сервер на указанном порту.

    --------Общий смысл кода заключается в запуске приложения с использованием
     Express-сервера (app) на указанном порту (port) после успешного
      подключения к базе данных с помощью функции runDb().*/
