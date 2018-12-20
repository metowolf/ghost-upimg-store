'use strict'

const Promise = require('bluebird')
const BaseAdapter = require('ghost-storage-base')
const upimg = require('upimg')

class UpimgAdapter extends BaseAdapter {
  constructor(options) {
    super(options)
    this.options = options || {}
  }

  /**
   * Saves the image to storage (sm.ms)
   * - image is the express image object
   * - returns a promise which ultimately returns the full url to the uploaded image
   *
   * @param image
   * @param targetDir
   * @returns {Promise}
   */
  save(image, targetDir) {

    if (!['alibaba', 'jd', 'qihoo', 'smms', 'sogou'].includes(this.options.server)) {
      return Promise.reject('ghost-upimg is not configured')
    }

    let api = upimg[this.options.server]

    return new Promise((resolve, reject) => {
      api.upload(image.path)
        .then(result => {
          resolve(result.url)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * @Overwrite
   * Ghost requires this function to be defined
   */
  exists(filename, targetDir) {
    return new Promise((resolve, reject) => {
      resolve(false)
    })
  }

  /**
   * @Overwrite
   * Ghost requires this function to be defined
   */
  serve() {
    return (req, res, next) => {
      next()
    }
  }

  /**
   * Not implemented.
   * May be implemented later.
   *
   * @returns {Promise.<*>}
   */
  delete() {
    return Promise.reject('not implemented')
  }

  /**
   * @Overwrite
   * Absolute url are already used to link to the images
   */
  read(options) {}

}

module.exports = UpimgAdapter
