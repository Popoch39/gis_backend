import vine from '@vinejs/vine'

export const createLayerValidator = vine.compile(
  vine.object({
    name: vine.string(),
    description: vine.string().optional(),
    z_index: vine.number().optional(),
    is_active: vine.boolean().optional(),
    user_id: vine.number()
  })
)
