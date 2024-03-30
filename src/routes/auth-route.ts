import {Response, Router} from "express";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {STATUS_CODE} from "../common/constant-status-code";
import {loginAndEmailValidationAuth} from "../middlewares/authMiddleware/loginAndEmailValidationAuth";
import {passwordValidationAuth} from "../middlewares/authMiddleware/passwordValidationAuth";
import {AuthCodeConfirmationModel, AuthEmailModel, AuthModel, AuthRegistrationModel} from "../allTypes/authTypes";
import {authService} from "../servisces/auth-service";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {userMaperForMeRequest} from "../mapers/userMaperForMeRequest";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {codeConfirmationValidation} from "../middlewares/authMiddleware/codeConfirmationValidation";
import {isConfirmedFlagValidation} from "../middlewares/authMiddleware/isConfirmedFlagValidation";
import {isExistLoginValidator} from "../middlewares/authMiddleware/isExistLoginValidator";
import {isExistEmailValidation} from "../middlewares/authMiddleware/isExistEmailValidation";
import {visitLimitMiddleware} from "../middlewares/commonMiddlewares/visitLimitMiddleware";
import {loginService} from "../servisces/login-service";
import {AccessAndRefreshToken} from "../allTypes/usersDevicesTypes";
import {updateRefreshTokenService} from "../servisces/update-refreshToken-service";
import {logoutService} from "../servisces/logout-service";


export const authRoute = Router({})

const postValidationAuth = () => [loginAndEmailValidationAuth, passwordValidationAuth]

const postValidationForRegistration = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers,isExistLoginValidator,isExistEmailValidation]




authRoute.post('/login',visitLimitMiddleware, postValidationAuth(), errorValidationBlogs, async (req: RequestWithBody<AuthModel>, res: Response) => {

    try {

        const  result:AccessAndRefreshToken|null =await loginService.loginUser(req)

        if (result) {
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,})
            res.status(STATUS_CODE.SUCCESS_200).send({"accessToken": result.accessToken})
        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }

    } catch (error) {
        console.log('auth-routes.ts /login' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})


authRoute.post('/refresh-token',async (req: any, res: Response) => {
    try{
        const refreshToken = req.cookies.refreshToken

        const result = await updateRefreshTokenService.updateRefreshToken(refreshToken)

        if (result) {
            res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,})
            res.status(STATUS_CODE.SUCCESS_200).send({"accessToken": result.accessToken})
        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }
    } catch (error) {
        console.log('auth-routes.ts /refresh-token' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

}),


authRoute.get('/me', authTokenMiddleware, async (req: any, res: Response) => {
    try {

        const userModel = await userMaperForMeRequest(req.userIdLoginEmail)
        res.status(STATUS_CODE.SUCCESS_200).send(userModel)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /me' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})


authRoute.post('/registration',visitLimitMiddleware, postValidationForRegistration(), errorValidationBlogs, async (req: RequestWithBody<AuthRegistrationModel>, res: Response) => {
    try {
        await authService.registerUser(req.body.login,req.body.email,req.body.password)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})




authRoute.post('/registration-confirmation',visitLimitMiddleware, codeConfirmationValidation,errorValidationBlogs,async (req: RequestWithBody<AuthCodeConfirmationModel>, res: Response) => {
    try {
        await authService.updateConfirmationCode(req.body.code)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration-confirmation' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})



authRoute.post('/registration-email-resending',visitLimitMiddleware,emailValidationUsers,isConfirmedFlagValidation,errorValidationBlogs,async (req: RequestWithBody<AuthEmailModel>, res: Response) => {
    try {
        await authService.updateCodeConfirmationAndExpirationDate(req.body.email)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration-email-resending' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})




authRoute.post('/logout',async (req: any, res: any) => {
    try{
        const refreshToken = req.cookies.refreshToken

        const isLogout = await  logoutService.logout(refreshToken)


        if (isLogout) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)

        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }


    } catch (error) {
        console.log('auth-routes.ts /logout' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})


