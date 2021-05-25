import { Router, Response } from "express"
import { STORAGE } from "@shared/config"
import { s3 } from "@shared/s3"
import { RequestExtended } from "@shared/types"

const signedUrl = Router()

const ONE_WEEK_IN_SECONDS = 604800

signedUrl.post("/get", async (req: RequestExtended, res: Response) => {
  const key = req.body.filename
  const url = s3.getSignedUrl("getObject", {
    Bucket: STORAGE.S3_BUCKET,
    Key: key,
    Expires: ONE_WEEK_IN_SECONDS,
  })
  return res.send({ url })
})

signedUrl.post("/put", async (req: RequestExtended, res: Response) => {
  const key = req.body.filename
  const url = s3.getSignedUrl("putObject", {
    Bucket: STORAGE.S3_BUCKET,
    Key: key,
    Expires: ONE_WEEK_IN_SECONDS,
  })
  return res.send({ url })
})

signedUrl.post(
  "/createMultipartUpload",
  async (req: RequestExtended, res: Response) => {
    try {
      const key = req.body.filename

      const { UploadId } = await s3
        .createMultipartUpload({
          Bucket: STORAGE.S3_BUCKET,
          Key: key,
        })
        .promise()

      return res.send(UploadId)
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  }
)

signedUrl.post("/getPartUrl", async (req: RequestExtended, res: Response) => {
  try {
    const key = req.body.filename
    const UploadId = req.body.uploadId
    const PartNumber = req.body.partNumber

    const url = await s3.getSignedUrlPromise("uploadPart", {
      Bucket: STORAGE.S3_BUCKET,
      Key: key,
      UploadId,
      PartNumber,
      Expires: ONE_WEEK_IN_SECONDS,
    })

    return res.send(url)
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
})

signedUrl.post(
  "/abortMultipartUpload",
  async (req: RequestExtended, res: Response) => {
    try {
      const key = req.body.filename
      const UploadId = req.body.uploadId

      await s3
        .abortMultipartUpload({
          Bucket: STORAGE.S3_BUCKET,
          Key: key,
          UploadId,
        })
        .promise()

      return res.send()
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  }
)

interface Part {
  ETag: string
  PartNumber: number
}

signedUrl.post(
  "/completeMultipartUpload",
  async (req: RequestExtended, res: Response) => {
    try {
      const key = req.body.filename
      const UploadId = req.body.uploadId
      const Parts: Part[] = req.body.parts

      await s3
        .completeMultipartUpload({
          Bucket: STORAGE.S3_BUCKET,
          Key: key,
          UploadId,
          MultipartUpload: { Parts },
        })
        .promise()

      return res.send()
    } catch (error) {
      console.error(error)
      return res.status(500).send()
    }
  }
)

export default signedUrl
