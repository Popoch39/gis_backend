import { UserService } from "#services/user_service"
import testUtils from "@adonisjs/core/services/test_utils"
import { test } from "@japa/runner"

test.group('User Model & Service', (group) => {

  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('can create a new user', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'anotherTestbruh@example.com',
      password: 'password123',
      fullName: 'Test User'
    }

    const user = await userService.create(userData)

    assert.exists(user.id)
    assert.equal(user.email, userData.email)
    assert.equal(user.fullName, userData.fullName)
    assert.notEqual(user.password, userData.password) // Le mot de passe doit être hashé
  })

  test('can find a user by id', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'find@example.com',
      password: 'password123',
      fullName: 'Find User'
    }

    const createdUser = await userService.create(userData)
    const foundUser = await userService.find(createdUser.id)

    assert.exists(foundUser)
    assert.equal(foundUser?.email, userData.email)
  })

  test('can update a user', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'update@example.com',
      password: 'password123',
      fullName: 'Update User'
    }

    const user = await userService.create(userData)
    const updatedData = {
      fullName: 'Updated Name'
    }

    const updatedUser = await userService.update(user.id, updatedData)

    assert.equal(updatedUser.fullName, updatedData.fullName)
    assert.equal(updatedUser.email, userData.email) // L'email ne devrait pas changer
  })

  test('can delete a user', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'delete@example.com',
      password: 'password123',
      fullName: 'Delete User'
    }

    const user = await userService.create(userData)
    await userService.delete(user.id)

    const foundUser = await userService.find(user.id)
    assert.isNull(foundUser)
  })

  test('can list all users', async ({ assert }) => {
    const userService = new UserService()
    const initalUsers = await userService.all();
    const initialCount = initalUsers.length;

    const usersData = [
      {
        email: 'user1@example.com',
        password: 'password123',
        fullName: 'User One'
      },
      {
        email: 'user2@example.com',
        password: 'password123',
        fullName: 'User Two'
      }
    ]

    await Promise.all(usersData.map(data => userService.create(data)))

    const users = await userService.all()
    assert.lengthOf(users, initialCount + 2)
  })

  test('validates email format', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'invalid-email',
      password: 'password123',
      fullName: 'Test User'
    }

    try {
      await userService.create(userData)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error)
    }
  })

  test('requires minimum password length', async ({ assert }) => {
    const userService = new UserService()
    const userData = {
      email: 'test@example.com',
      password: '12345', // Moins de 6 caractères
      fullName: 'Test User'
    }

    try {
      await userService.create(userData)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.exists(error)
    }
  })
})

