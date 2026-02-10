import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'

const isAdmin = async (userId: string): Promise<boolean> => {
    const user = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

    return user[0]?.role === 'admin'
}

export default isAdmin