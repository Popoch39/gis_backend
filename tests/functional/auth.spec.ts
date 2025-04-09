import { UserService } from "#services/user_service"
import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"

test.group('Authentication', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('can register a new user', async ({ client, assert }) => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    }

    const response = await client.post('/auth/register').json(userData)

    response.assertStatus(200)
    assert.properties(response.body(), ['token', 'user'])
    assert.equal(response.body().user.email, userData.email)
    assert.equal(response.body().user.fullName, userData.fullName)
    assert.notExists(response.body().user.password)
  })

  test('cannot register with invalid email', async ({ client, }) => {
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      fullName: 'Test User'
    }

    const response = await client.post('/auth/register').json(userData)

    response.assertStatus(422)
  })

  test('cannot register with short password', async ({ client }) => {
    const userData = {
      email: 'test@example.com',
      password: '123',
      fullName: 'Test User'
    }

    const response = await client.post('/auth/register').json(userData)

    response.assertStatus(422)
  })

  test('can login with valid credentials', async ({ client, assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'login@example.com',
      password: 'password123',
      fullName: 'Login User'
    }
    await userService.create(userData)

    const response = await client.post('/auth/login').json({
      email: userData.email,
      password: userData.password
    })

    response.assertStatus(200)
    assert.properties(response.body(), ['token', 'user'])
    assert.equal(response.body().user.email, userData.email)
  })

  test('cannot login with invalid credentials', async ({ client, }) => {
    const response = await client.post('/auth/login').json({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    })

    response.assertStatus(400)
  })

  test('can logout with valid token', async ({ client, assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'logout@example.com',
      password: 'password123',
      fullName: 'Logout User'
    }

    await userService.create(userData)

    const loginResponse = await client.post('/auth/login').json({
      email: userData.email,
      password: userData.password
    })

    loginResponse.assertStatus(200);

    assert.exists(loginResponse.body().token)

    const response = await client
      .post('/auth/logout')
      .header('Authorization', `Bearer ${loginResponse.body().token.token}`)
      .accept('application/json')

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Logout successful'
    })

    const protectedResponse = await client
      .get('/users')
      .header('Authorization', `Bearer ${loginResponse.body().token.value}`)

    protectedResponse.assertStatus(401)
  })
})

test('cannot logout without token', async ({ client, }) => {
  const response = await client.post('/auth/logout')

  response.assertStatus(401)
})

