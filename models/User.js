const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Ensure password is hashed before saving
    role: {
      type: String,
      enum: ['admin', 'employee'], 
      default : "employee"
    },
    address : { type : String },
    about : { type : String },
    contact : { type : Number },
    department: { type: String },
    position: { type: String },
    joining_date: { type: Date },
    salary: { type: Number, default : 0 },
    profile_pic: { type: String },  // Optional: path to the profile picture
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index email for quick lookup
userSchema.index({ email: 1 });

// password hashing
userSchema.pre("save", async function(next){
  if( !this.isModified("password")){
      return next();
  }
   this.password = await bcrypt.hash(this.password, 10)
});

// compare password
userSchema.methods.comparePassword = async function(oldPassword){
  let isPasswordMatch = await bcrypt.compare(oldPassword, this.password);

  return isPasswordMatch
}

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;
