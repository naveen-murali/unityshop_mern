import bcrypt from 'bcrypt'

const users = [
  {
    name: 'Jey',
    email: 'admin@gmail.com',
    phone: 8086894243,
    password: bcrypt.hashSync('password@123', 10),
    isAdmin: true,
  },
  {
    name: 'Naveen Murali',
    phone: 8086894243,
    email: 'naveen@gmail.com',
    password: bcrypt.hashSync('password@123', 10),
  },
]

export default users
