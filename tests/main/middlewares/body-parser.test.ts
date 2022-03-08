import request from 'supertest'
import app from '@/main/config/app'

describe('Body parser middleware', () => {
  test('should parse body as JSON', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Any name' })
      .expect({ name: 'Any name' })
  })
})
