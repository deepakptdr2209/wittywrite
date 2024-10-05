
import { createBlogInput, updateBlogInput } from "@deepakptidar2209/wittywrite_zod_validation_2.0";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings :{
    DATABASE_URL : string,
    JWT_SECRET : string
    },
    Variables : {
        userId : string 
        }
}>();
  //!---------middleware -------!
 blogRouter.use('/*',async(c,next)=>{
    //get the header
    //verify the user jwt token
    //pass the result
    const authHeader = c.req.header("Authorization")|| "";
    const user = await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId",user.id as string);
        await next();
    } else{
        c.status(404);
        return c.json({
            message: "not signed in"
        })
    }
   
 })
// !----------- TO ADD THE BLOG ---------!
  blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const {success} = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const authorId = c.get("userId")
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

   try {
    const blog =  await prisma.post.create({
        data :{
            title : body.title,
            content : body.content,
            authorId : authorId
        }
        })
        return c.json({
            id : blog.id
   })
      }
      catch (error) {
      c.status(403);
      return c.json({meassage: "access denied"});
   }
});
  // !----------- TO UPDATE THE BLOG ---------!
  blogRouter.put('/', async(c) => {
    const body = await c.req.json();
    const {success} = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message: "Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

   try {
    const blog =  await prisma.post.update({
        where:{
            id : body.id
        },
        data :{
            title : body.title,
            content : body.content,
            
        }
        })
        return c.json({
            id : blog.id
   })
      }
      catch (error) {
      c.status(403);
      return c.json({meassage: "access denied"});
   }
  })
   // !----------- TO GET ALL THE BLOG ---------!
   blogRouter.get("/bulk",async (c)=>{
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const blogs = await prisma.post.findMany();
        return c.json({
            blogs
        })
    } catch (error) {
        c.status(404)
        return c.json({
            message: "no blog found"
        })
    }
   })

  // !----------- TO GET THE BLOG ----------!
  blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

   try {
    const blog =  await prisma.post.findFirst({
        where:{
            id : id
        },
        
        })
        return c.json({
             blog
        })
       }
    catch (error) {
      c.status(404);
      return c.json({meassage: "OOps nothing found"});
       }
  })
  
