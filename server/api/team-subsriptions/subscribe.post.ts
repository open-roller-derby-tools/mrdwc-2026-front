import { getDb } from '../../utils/dbClient'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { user_id, team_id } = body

  if (!user_id || !team_id) {
    throw createError({ statusCode: 400, statusMessage: "Missing user_id or team_id" })
  }

  const db = getDb()
  await db.connect()

  // Add the team subscription
  await db.query(
    `
    INSERT INTO team_subscriptions (user_id, team_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [user_id, team_id]
  )

  // Also subscribe the user to all channels related to the team
  await db.query(
    `
    INSERT INTO subscriptions (user_id, channel_id)
    SELECT $1, id
    FROM channels
    WHERE team_id_1 = $2 OR team_id_2 = $2
    ON CONFLICT DO NOTHING
    `,
    [user_id, team_id]
  )

  return { success: true }
})
