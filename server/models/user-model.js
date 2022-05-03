import {Schema,model} from 'mongoose'
const UserSchema=new Schema({
    email:{type:String,required:true,unique:true},
    name:{type:String,required:true,unique: true},
    password:{type:String,required:true},
    isActivated:{type:Boolean,required:true,default:false},
    activatedLink:{type:String},
})
export default model("User",UserSchema)
