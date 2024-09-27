import { Hono } from "hono";

export const blogRouter = new Hono<{
    Bindings :{
    DATABASE_URL : string,
    JWT_SECRET : string
    }
}>();


  blogRouter.post('/', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.put('/', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/api/v1/blog/:id', (c) => {
    return c.text('Hello Hono!')
  })
  
