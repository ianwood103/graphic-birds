import archiver from "archiver";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable, PassThrough } from "stream";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const maxDuration = 60;

// Initialize the S3 client with your credentials and region
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "your-access-key",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "your-secret-key",
  },
  region: process.env.AWS_REGION || "your-aws-region",
});

async function createZipAndUploadToS3(
  bucket: string,
  keys: string[],
  zipKey: string
): Promise<void> {
  // Create a PassThrough stream to handle streaming data to S3
  const passThrough = new PassThrough();

  // Initialize the upload using @aws-sdk/lib-storage's Upload class
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: zipKey,
      Body: passThrough,
      ContentType: "application/zip",
    },
    // Optional: Configure part size and queue size for multipart upload
    // partSize: 5 * 1024 * 1024, // 5 MB
    // queueSize: 4, // Concurrent parts
  });

  // Optional: Monitor upload progress
  upload.on("httpUploadProgress", (progress) => {
    console.log(`Uploaded ${progress.loaded} / ${progress.total} bytes`);
  });

  // Initialize archiver with ZIP format and maximum compression
  const archive = archiver("zip", { zlib: { level: 9 } });

  // Handle archiver errors
  archive.on("error", (err) => {
    throw err;
  });

  // Pipe the archiver's output to the PassThrough stream
  archive.pipe(passThrough);

  // Iterate over each S3 object key and append it to the archive
  for (const key of keys) {
    try {
      // Fetch the object from S3
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const response = await s3Client.send(command);
      const stream = response.Body as Readable;

      // Append the stream to the archive with the desired name
      archive.append(stream, { name: key });
      console.log(`Appended ${key} to archive.`);
    } catch (err) {
      console.error(`Error fetching ${key} from S3:`, err);
      // Abort the archiving process and the upload
      archive.abort();
      throw err;
    }
  }

  // Finalize the archive (no more files will be appended)
  archive.finalize();

  try {
    // Await the completion of the upload
    await upload.done();
    console.log(`ZIP archive "${zipKey}" uploaded successfully.`);
  } catch (uploadErr) {
    console.error("Error uploading ZIP archive:", uploadErr);
    throw uploadErr;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const requestUrl = `${process.env.NEXT_PUBLIC_URL}/api/screenshot`;
  const graphics = [
    "seasonrecap",
    "seasontotal",
    "seasonspeciesbreakdown",
    "seasongeorgia",
    "seasonmapview",
    "seasonrecapv2",
    "seasontotalv2",
    "seasonspeciesbreakdownv2",
    "seasongeorgiav2",
    "seasonmapviewv2",
    "seasonbanner",
  ];

  const requestBody = await request.json();
  const { id, season, year } = requestBody;

  const objectKeys = await Promise.all(
    graphics.map(async (graphic) => {
      const requestBody = {
        url: `${process.env.NEXT_PUBLIC_URL}/${graphic}/${id}?season=${season}&year=${year}`,
        selector: `#${graphic}`,
      };
      const response = await fetch(requestUrl, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();
      if (json) {
        return json.key;
      } else {
        return null;
      }
    })
  );

  // Define your S3 bucket and the object keys you want to include in the ZIP
  const bucketName = process.env.S3_BUCKET || "your-s3-bucket-name";

  // Generate a unique name for the ZIP file, e.g., using a timestamp
  const zipFileName = `archive_${Date.now()}.zip`;

  try {
    // Create the ZIP archive and upload it to S3
    await createZipAndUploadToS3(bucketName, objectKeys, zipFileName);
  } catch (error) {
    console.error("Error creating and uploading ZIP archive:", error);
    return NextResponse.json(
      { error: "Failed to create and upload ZIP archive." },
      { status: 500 }
    );
  }

  try {
    // Generate a signed URL for downloading the ZIP file
    const downloadSignedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: zipFileName,
      }),
      { expiresIn: 3600 } // URL valid for 1 hour (3600 seconds)
    );

    // Return the signed URL in the response
    return NextResponse.json({ url: downloadSignedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL." },
      { status: 500 }
    );
  }
}
