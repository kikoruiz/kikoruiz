import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import {DOWNLOAD_TYPE} from 'config/store'

// Long enough for a slow connection on a 5 MB file, short enough that a link
// pasted somewhere public is dead by the time anyone finds it. Reloading the
// success page mints a new one, so nobody gets locked out.
const SIGNED_URL_MAX_AGE = 3600

export const R2_BUCKET = process.env.R2_BUCKET

export function getR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  })
}

// Tiers sharing a resolution share the file, so the commercial licence does not
// store a second copy of the very same pixels.
export function getDownloadKey({
  pictureId,
  longestSide
}: {
  pictureId: string
  longestSide: number | null
}) {
  return `${DOWNLOAD_TYPE}s/${pictureId}/${longestSide ?? 'original'}.jpg`
}

export function getSignedDownloadUrl({
  key,
  fileName
}: {
  key: string
  fileName: string
}) {
  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`
    }),
    {expiresIn: SIGNED_URL_MAX_AGE}
  )
}
