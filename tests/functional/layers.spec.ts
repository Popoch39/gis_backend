import { test } from '@japa/runner'
import { LayerService } from '#services/layer_service'
import User from '#models/user'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Layer Service & Model', (group) => {
  let user: User
  let layerService: LayerService

  group.setup(async () => {
    await testUtils.db().withGlobalTransaction()
    user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    })
    layerService = new LayerService()
  })

  test('creates a layer using service with required fields', async ({ assert }) => {
    const payload = {
      name: 'Test Layer',
      user_id: user.id
    }

    const layer = await layerService.create(payload)

    assert.exists(layer.id)
    assert.equal(layer.name, payload.name)
    assert.equal(layer.userId, payload.user_id)
    assert.isTrue(layer.isActive)
    assert.instanceOf(layer.createdAt, DateTime)
    assert.instanceOf(layer.updatedAt, DateTime)
  })

  test('creates a layer using service with all fields', async ({ assert }) => {
    const payload = {
      name: 'Complete Layer',
      description: 'Test Description',
      z_index: 1,
      is_active: false,
      user_id: user.id
    }

    const layer = await layerService.create(payload)

    assert.exists(layer.id)
    assert.equal(layer.name, payload.name)
    assert.equal(layer.description, payload.description)
    assert.equal(layer.zIndex, payload.z_index)
    assert.isFalse(layer.isActive)
    assert.equal(layer.userId, payload.user_id)
  })

  test('retrieves all layers', async ({ assert }) => {
    const initialLayers = await layerService.all()
    assert.isArray(initialLayers)
    const initialCount = initialLayers.length

    // Créer quelques layers
    await layerService.create({ name: 'Layer 1', user_id: user.id })
    await layerService.create({ name: 'Layer 2', user_id: user.id })

    const layers = await layerService.all()

    assert.isArray(layers)
    assert.lengthOf(layers, 2 + initialCount)
  })

  test('shows a specific layer', async ({ assert }) => {
    const createdLayer = await layerService.create({
      name: 'Test Layer',
      user_id: user.id
    })

    const layer = await layerService.show(createdLayer.id)

    assert.equal(layer.id, createdLayer.id)
    assert.equal(layer.name, createdLayer.name)
  })

  test('counts layers by user ID', async ({ assert }) => {
    const initialCountLayerById = await layerService.countByUserId(user.id)

    await layerService.create({ name: 'Layer 1', user_id: user.id })
    await layerService.create({ name: 'Layer 2', user_id: user.id })
    await layerService.create({ name: 'Layer 3', user_id: user.id })

    const finalCountLayerById = await layerService.countByUserId(user.id)

    assert.equal(finalCountLayerById, 3 + initialCountLayerById)
  })

  test('returns 0 count when user has no layers', async ({ assert }) => {
    const newUser = await User.create({
      email: 'another@example.com',
      password: 'password123',
      fullName: 'Another User'
    })

    const count = await layerService.countByUserId(newUser.id)

    assert.equal(count, 0)
  })

  test('throws error when showing non-existent layer', async ({ assert }) => {
    await assert.rejects(
      () => layerService.show(999),
      'Row not found'
    )
  })

  test('belongs to a user relationship', async ({ assert }) => {
    const layer = await layerService.create({
      name: 'User Layer',
      user_id: user.id
    })

    await layer.load('user')
    assert.exists(layer.user)
    assert.equal(layer.user.id, user.id)
    assert.equal(layer.user.email, 'test@example.com')
  })

  //test('has many features relationship', async ({ assert }) => {
  //  const layer = await layerService.create({
  //    name: 'Features Layer',
  //    user_id: user.id
  //  })
  //
  //  await layer.load('features')
  //  assert.exists(layer.features)
  //  assert.isArray(layer.features)
  //})
})

