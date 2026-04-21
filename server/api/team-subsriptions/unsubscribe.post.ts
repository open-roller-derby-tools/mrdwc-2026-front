import { getDb } from '../../utils/dbClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { user_id, team_id } = body

  if (!user_id || !team_id) {
    throw createError({ statusCode: 400, statusMessage: "Missing user_id or team_id" })
  }

  const db = getDb()
  await db.connect()

  // Delete the team subscription
  await db.query(
    `
    DELETE FROM team_subscriptions
    WHERE user_id = $1 AND team_id = $2
    `,
    [user_id, team_id]
  )

  // Also unsubscribe the user from all channels related to the team
  await db.query(
    `
    DELETE FROM subscriptions
    WHERE user_id = $1
    AND channel_id IN (
      SELECT id FROM channels
      WHERE team_id_1 = $2 OR team_id_2 = $2
    )
    `,
    [user_id, team_id]
  )

  return { success: true }
})
