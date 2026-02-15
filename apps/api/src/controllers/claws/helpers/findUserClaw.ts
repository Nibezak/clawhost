import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { claws } from '@/db/schema'
import isAdmin from '@/controllers/claws/helpers/isAdmin'

const findUserClaw = async (userId: string, clawId: string) => {
    const claw = await db
        .select()
        .from(claws)
        .where(eq(claws.id, clawId))
        .limit(1)

    if (!claw[0]) return null

    if (claw[0].userId !== userId && !(await isAdmin(userId))) return null

    return claw[0]
}

export default findUserClaw