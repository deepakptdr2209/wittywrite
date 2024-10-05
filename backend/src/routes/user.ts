import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signInInput, signUpInput } from "@deepakptidar2209/wittywrite_zod_validation_2.0";


export const userRouter = new Hono<{
    Bindings :{
    DATABASE_URL : string,
    JWT_SECRET : string
    }
}>();

// !----- signup route  -----!
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({  
    datasourceUrl: c.env?.DATABASE_URL,
}).$extends(withAccelerate())


  const body = await c.req.json();
  const {success} = signUpInput.safeParse(body); 
  if(!success){
    c.status(411);
    return c.json({
      error: "inputs are not correct"
    })
  }
  
    try {
          const user = await prisma.user.create({
              data: {
                  email: body.email,
                  password: body.password
              }
          });
        const jwt = await sign({id:user.id},c.env.JWT_SECRET);
          return c.json({jwt});
      } catch(e) {
          c.status(403);
      return c.json({ error: "error while signing up" });
      }
  
  });
  
  // !------- signin Route -------!
  
  userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const {success} = signInInput.safeParse(body); 
    if(!success){
      c.status(411);
      return c.json({
        message: "inputs are not correct"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  
  
   try {
    const user = await prisma.user.findUnique({
      where : {
        email : body.email,
        password : body.password
      }
    });
     if(!user) {
          c.status(403);
          return c.json({ error: "user not found" });
      }
  
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
   } 
   catch (error) {
      c.status(403);
      return c.json({ error: "error while signing in" });
   }
  })