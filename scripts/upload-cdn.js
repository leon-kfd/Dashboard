require('dotenv').config();
const fs = require('fs')
const qiniu = require('qiniu');
const QiniuAccessKey = process.env.QINIU_ACCESS_KEY
const QinuiSecretKey = process.env.QINIU_SECRET_KEY
const mac = new qiniu.auth.digest.Mac(QiniuAccessKey, QinuiSecretKey);
const bucket = 'howdy'
const bucketManager = new qiniu.rs.BucketManager(mac)

const clearAssets = async () => {
  try {
    const assetsFileList = await new Promise((resolve, reject) => {
      bucketManager.listPrefix(bucket, {
        limit: 100,
        prefix: 'howdz/dist/assets/',
      }, function(err, respBody, respInfo) {
        if (err) {
          reject(err)
        }
        if (respInfo.statusCode === 200) {
          const list = respBody.items.map(item => item.key)
          resolve(list)
        } else {
          reject(new Error('Server error'))
        }
      });
    })
    const deleteOperations = assetsFileList.map(item => {
      return qiniu.rs.deleteOp(bucket, item)
    })
    await new Promise((resolve, reject) => {
      bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
        if (err) {
          reject(err)
        } else {
          if (parseInt(respInfo.statusCode / 100) === 2) {
            resolve(1)
          } else {
            reject(new Error('Batch delete error'))
          }
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}

const uploadFile = async (fileString, fileName) => {
  if (!fileName) {
    throw new Error('Lose filename')
  }
  const key = `howdz/dist/assets/${fileName}`
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  });
  const uploadToken = putPolicy.uploadToken(mac);
  const formUploader = new qiniu.form_up.FormUploader();
  const putExtra = new qiniu.form_up.PutExtra();
  return await new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, fileString, putExtra, function(err, ret) {
      if (!err) {
        resolve(ret)
      } else {
        reject(err)
      }
    })
  })
}

const uploadAssets = () => {
  const assetsFileList = fs.readdirSync('dist/assets')
  const task = assetsFileList.map(item => {
    return uploadFile(`dist/assets/${item}`, item)
  })
  return Promise.all(task)
}

clearAssets()
uploadAssets()
