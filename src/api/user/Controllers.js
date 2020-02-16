import { compare, hash } from 'bcryptjs';
import UserModel from './Models'

class User {
    static async userLogin(req, res, next) {
        try {

            const user = await UserModel.findOne({
                username: req.body.username
            });
            if (!user)
                return res.status(400).json({
                    success: false,
                    message: 'Oops! Your username or password is incorrect',
                });

            const validPassword = await compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Oops! Your username or password is incorrect',
                });
            }
            const token = user.generateAuthToken();
            res.status(200).json({
                success: true,
                message: 'login success',
                token,
            });
        } catch (error) {
            console.log(error);
        }
    }
    static async userLogout(req, res, next) {
        try {
            req.isUserAuth = false;
            req.userId = null;
            res.status(200).json({ success: true, message: 'logout success' });
        } catch (error) {
            console.log(error)

        }
    }

}

export default User;