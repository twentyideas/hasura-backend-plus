import { Router, Response } from "express"
import { getKey } from "./storage/utils"
import { S3_BUCKET } from "@shared/config"
import { s3 } from "@shared/s3"
import { RequestExtended } from "@shared/types"

const signedUrl = Router()

const ONE_WEEK_IN_SECONDS = 604800

signedUrl.get("/get/:filename", async (req: RequestExtended, res: Response) => {
  const key = getKey(req)
  const url = s3.getSignedUrl("getObject", {
    Bucket: S3_BUCKET as string,
    Key: key,
    Expires: ONE_WEEK_IN_SECONDS,
  })
  return res.send({ url })
})

signedUrl.get("/put/:filename", async (req: RequestExtended, res: Response) => {
  const key = getKey(req)
  const url = s3.getSignedUrl("putObject", {
    Bucket: S3_BUCKET as string,
    Key: key,
    Expires: ONE_WEEK_IN_SECONDS,
  })
  return res.send({ url })
})

signedUrl.post(
  "/createMultipartUpload",
  async (req: RequestExtended, res: Response) => {
    const key = req.body.filename
    const parts: number = req.body.parts

    const { UploadId } = await s3
      .createMultipartUpload({
        Bucket: S3_BUCKET as string,
        Key: key,
      })
      .promise()

    const urls = await Promise.all(
      Array.from({ length: parts }, (x, i) => i + 1).map(part =>
        s3.getSignedUrlPromise("uploadPart", {
          Bucket: S3_BUCKET as string,
          Key: key,
          UploadId,
          PartNumber: part + 1,
        })
      )
    )

    return res.send({ urls })
  }
)

interface Part {
  ETag: string
  PartNumber: number
}

signedUrl.post(
  "/completeMultipartUpload",
  async (req: RequestExtended, res: Response) => {
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
  }
)

export default signedUrl
