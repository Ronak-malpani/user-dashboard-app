import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//logic for registering user
export const RegisterUser = async (req, res) => {
    const { name, email, password } = req.body; 

    if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required!"});
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if(err) return res.status(500).json({message: err.message});
        if(result.length > 0) return res.status(400).json({message: "Email already registered!"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, email, hashedPassword, "USER"], (err) => { // Always USER
            if(err) return res.status(500).json({message: err.message});
            return res.status(201).json({message: "User registered successfully"});
        });
    });
};



//logic for login user
export const LoginUser =(req,res) =>{
    const {email,password} = req.body;

    //to check if user has typed all fields
    if(!email || !password){
        return res.status(400).json({message:" Both Email and Password are required!"});
    }
    //to check if user is already exist or not
    db.query("SELECT * FROM users WHERE email =?",[email], async (err,result)=>{
        if(err){
            return res.status(500).json({message:err.message});
        }
        if(result.length === 0){
            return res.status(400).json({message:"Invalid email or password"});       
        }

        const user=result[0];
        //compare the password
        const IsPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!IsPasswordCorrect){
            return res.status(400).json({message:"Invalid Password"});
        }

        //jwt token generation
        
        const token = jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn :"1d"});
            
        return res.status(200).json({message:"User Login successfully",token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    });

}


