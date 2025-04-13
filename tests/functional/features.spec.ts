import { test } from '@japa/runner'
import { FeatureService } from '#services/feature_service'
import User from '#models/user'
import Layer from '#models/layer'
import testUtils from '@adonisjs/core/services/test_utils'
import { GeometryType } from '../../app/types/postgisTypes.js'

test.group('Feature Service & Model', (group) => {
  let user: User
  let layer: Layer
  let featureService: FeatureService

  group.setup(async () => {
    await testUtils.db().withGlobalTransaction()

    // Create test user
    user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    })

    // Create test layer
    layer = await Layer.create({
      name: 'Test Layer',
      userId: user.id
    })

    featureService = new FeatureService()
  })

  test('creates a feature with valid Point geometry', async ({ assert }) => {
    const payload = {
      name: 'Test Point Feature',
      geometry: JSON.stringify({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {}
      }),
      layer_id: layer.id
    }

    const feature = await featureService.create(payload)

    assert.exists(feature.id)
    assert.equal(feature.name, payload.name)
    assert.equal(feature.layerId, payload.layer_id)
    assert.equal(feature.geometryType, GeometryType.POINT)
  })

  test('creates a feature with valid Polygon geometry', async ({ assert }) => {
    const payload = {
      name: 'Test Polygon Feature',
      geometry: JSON.stringify({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
        },
        properties: {}
      }),
      layer_id: layer.id
    }

    const feature = await featureService.create(payload)

    assert.exists(feature.id)
    assert.equal(feature.geometryType, GeometryType.POLYGON)
  })

  test('fails with invalid GeoJSON structure', async ({ assert }) => {
    const payload = {
      name: 'Invalid Feature',
      geometry: JSON.stringify({
        type: 'Invalid',
        coordinates: [0, 0]
      }),
      layer_id: layer.id
    }

    await assert.rejects(
      () => featureService.create(payload),
      'Invalid GeoJSON'
    )
  })

  test('fails with malformed JSON geometry', async ({ assert }) => {
    const payload = {
      name: 'Malformed JSON',
      geometry: 'not a json string',
      layer_id: layer.id
    }

    await assert.rejects(
      () => featureService.create(payload),
      /JSON/
    )
  })

  test('fails with missing geometry type', async ({ assert }) => {
    const payload = {
      name: 'Missing Type',
      geometry: JSON.stringify({
        coordinates: [0, 0]
      }),
      layer_id: layer.id
    }

    await assert.rejects(
      () => featureService.create(payload),
      'Invalid GeoJSON'
    )
  })

  test('fails with invalid coordinates structure', async ({ assert }) => {
    const payload = {
      name: 'Invalid Coordinates',
      geometry: JSON.stringify({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: 'invalid'
        },
        properties: {}
      }),
      layer_id: layer.id
    }

    await assert.rejects(
      () => featureService.create(payload)
    )
  })

  test('fails with non-existent layer_id', async ({ assert }) => {
    const payload = {
      name: 'Test Feature',
      geometry: JSON.stringify({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {}
      }),
      layer_id: 99999
    }

    await assert.rejects(
      () => featureService.create(payload)
    )
  })
})

