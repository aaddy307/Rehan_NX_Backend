import Settings from '../models/Settings.js'

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne()

    if (!settings) {
      settings = await Settings.create({})
    }

    res.json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}

export const updateSettings = async (req, res, next) => {
  try {
    const updateData = {
      storeName: req.body.storeName,
      address: req.body.address,
      phone1: req.body.phone1,
      phone2: req.body.phone2,
      whatsapp: req.body.whatsapp,
      email: req.body.email,
      mapUrl: req.body.mapUrl,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
    }

    const settings = await Settings.findOneAndUpdate({}, updateData, {
      new: true,
      runValidators: true,
      upsert: true,
    })

    res.json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}