import z from 'zod'

export const singnUpInput = z.object({
    username : z.string().email(),
    password : z.string().min(6),
    name : z.string().optional()
})
export const singnInInput = z.object({
    username : z.string().email(),
    password : z.string().min(6),
    
})
export const createBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    
})
export const updateBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    id : z.string(),
})



export type SignUpInput = z.infer<typeof singnUpInput>
export type SignInInput = z.infer<typeof singnInInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>