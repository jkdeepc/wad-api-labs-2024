import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// 获取所有用户
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
}));

// 注册 / 用户认证
router.post('/', asyncHandler(async (req, res) => {
    if (req.query.action === 'register') {  // 如果 action 是 'register'，则保存用户到 DB
        const { username, password } = req.body;

        // 检查密码格式是否符合要求
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                code: 400,
                msg: 'Password must be at least 8 characters long and include at least one letter, one number, and one special character.'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ code: 400, msg: 'Username already exists' });
        }

        await User(req.body).save();
        res.status(201).json({
            code: 201,
            msg: 'Successfully created a new user.',
        });
    } else {  // 如果不是注册，进行认证
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ code: 401, msg: 'Authentication failed' });
        }

        return res.status(200).json({ code: 200, msg: 'Authentication Successful', token: 'TEMPORARY_TOKEN' });
    }
}));

// 更新用户信息
router.put('/:id', asyncHandler(async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to Update User' });
    }
}));

export default router;
