import { Router, Response } from "express"
import { getKey } from "./storage/utils"
import { S3_BUCKET } from "@shared/config"
import { s3 } from "@shared/s3"
import { RequestExtended } from "@shared/types"

const signedUrl = Router()

const ONE_WEEK_IN_SECONDS = 604800

signedUrl.get("/get/:filename", async (req: RequestExtended, res: Response) => {
  try {
    const key = getKey(req)
    const url = s3.getSignedUrl("getObject", {
      Bucket: S3_BUCKET as string,
      Key: key,
      Expires: ONE_WEEK_IN_SECONDS,
    })
    return res.send({ url })
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
})

signedUrl.get("/put/:filename", async (req: RequestExtended, res: Response) => {
  try {
    const key = getKey(req)
    const url = s3.getSignedUrl("putObject", {
      Bucket: S3_BUCKET as string,
      Key: key,
      Expires: ONE_WEEK_IN_SECONDS,
    })
    return res.send({ url })
  } catch (error) {
    console.error(error)
    return res.status(500).send()
  }
})

signedUrl.post(
  "/createMultipartUpload",
  async (req: RequestExtended, res: Response) => {
    try {
      const key = req.body.filename

      const { UploadId } = await s3
        .createMultipartUpload({
          Bucket: S3_BUCKET as string,
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
      Bucket: S3_BUCKET as string,
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
          Bucket: S3_BUCKET as string,
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
          Bucket: S3_BUCKET as string,
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
