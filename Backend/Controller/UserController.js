const User = require('../Models/UserModel');
const { generateToken } = require('../MiddleWare/AuthMiddleWare');

const CreateUser = async (req, res) => {
    try {
        const { mobile, username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { mobile } });
        if (existingUser) {
            return res.status(400).json({ error: "User with this mobile number already exists" });
        }
        const newuser = await User.create({ mobile, password, username, email });
        const token = generateToken(newuser);
        res.status(201).json({ ...newuser.toJSON(), token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
// This is a universal code can be use anywhere to send whole code body

//const CreareUser = async (req,res)=> {
//  try {
//    const newuser = await User.Create(req.body);
//  res.status(201).json(newspaper);
//  }
//  catch (error){
//    res.status(500).json({error :error.message});
// }
//}


const GetAllUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

};

const LoginUser = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User.findOne({ where: { mobile } })
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        else if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' })
        }
        else {
            const token = generateToken(user);
            res.status(200).json({ message: 'Login successfully', user: { ...user.toJSON(), token } });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


const GetUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const UpdateUser = async (req, res) => {
    try {
        const { username, email, mobile, password } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ username, email, mobile, password });
            res.status(200).json({ message: 'User updated successfully', user });
        }
        else {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


module.exports = { CreateUser, GetAllUser, DeleteUser, LoginUser, GetUserById, UpdateUser };