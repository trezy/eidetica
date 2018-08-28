// Module imports
/* eslint-disable import/no-extraneous-dependencies */
import {
  app,
  nativeImage,
  Tray,
} from 'electron'
/* eslint-enable */
import path from 'path'
import sharp from 'sharp'





// Component imports
import { getAssetPath } from '../common'





// Component constants
const fillPad = 4
const size = 45





const updateIcon = async (state = 1) => {
  const assetPath = getAssetPath()
  const fillHeight = Math.floor(state * (size - (fillPad * 2))) + fillPad
  const overlayPath = path.resolve(assetPath, 'tray-icon.overlay.png')

  // Create the fill as a plain white image with the appropriate dimensions
  const fill = sharp({
    create: {
      background: {
        r: 255,
        b: 255,
        g: 255,
        alpha: 1,
      },
      channels: 4,
      height: fillHeight,
      width: size,
    },
  })

  // Set the fill's background to transparent for the embed process
  fill.background({
    r: 0,
    g: 0,
    b: 0,
    alpha: 0,
  })

  // Extend the image to the full icon by padding the top with the remainder of the image height
  fill.extend({
    bottom: 0,
    left: 0,
    right: 0,
    top: size - fillHeight,
  })

  // Convert the fill to PONG format, otherwise the overlay process won't work
  fill.png()

  // Use the overlay to cut the fill to the appropriate shape
  fill.overlayWith(overlayPath, { cutout: true })

  const iconAsNativeImage = nativeImage.createEmpty()
  const outline = sharp(path.resolve(assetPath, 'tray-icon.outline.png'))

  outline.overlayWith(await fill.toBuffer())

  const imageBuffer = await outline.toBuffer()

  iconAsNativeImage.addRepresentation({
    buffer: imageBuffer,
    height: size,
    scaleFactor: 2,
    width: size,
  })

  // iconAsNativeImage.addRepresentation({
  //   buffer: imageBuffer,
  //   height: 22,
  //   scaleFactor: 1,
  //   width: 22,
  // })

  iconAsNativeImage.setTemplateImage(true)

  if (!app.tray) {
    app.tray = new Tray(iconAsNativeImage)
  } else {
    app.tray.setImage(iconAsNativeImage)
  }
}





export { updateIcon }
