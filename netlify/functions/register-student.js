import { Client } from 'pg'
import bcrypt from 'bcryptjs'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    const data = JSON.parse(event.body)

    await client.connect()

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    const query = `
      INSERT INTO students
      (name, dob, gender, address, phone, email, courses, password_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `

    const values = [
      data.name,
      data.dob,
      data.gender,
      data.address,
      data.telephone,
      data.email,
      data.courses,
      passwordHash
    ]

    const result = await client.query(query, values)

    await client.end()

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        studentId: result.rows[0].id
      })
    }

  } catch (err) {
    await client.end()
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    }
  }
}
