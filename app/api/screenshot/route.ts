import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";
import chromium from "@sparticuz/chromium-min";

export const maxDuration = 30;

const S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "key",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "secret_key",
  },
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const isProduction = process.env.NODE_ENV === "production";

  try {
    const body = await request.json();
    const { url, selector } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let result = null;
    let browser = null;

    if (isProduction) {
      const puppeteer = await import("puppeteer-core").then((m) => m.default);

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          "https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar"
        ),
        headless: chromium.headless,
      });
    } else {
      const puppeteer = await import("puppeteer").then((m) => m.default);
      browser = await puppeteer.launch();
    }

    try {
      const page = await browser.newPage();

      await page.setViewport({
        width: 1920,
        height: 1440,
        deviceScaleFactor: 2,
      });

      await page.goto(url, { waitUntil: "networkidle0" });

      const element = await page.$(selector);

      if (element) {
        const imageBuffer = await element.screenshot();

        const graphic = selector.slice(1);

        const filename = `${graphic}_${Date.now()}.jpg`;

        const params = {
          Bucket: process.env.S3_BUCKET || "bucket_name",
          Key: filename,
          Body: imageBuffer,
        };

        await new Promise<void>((resolve, reject) => {
          S3.upload(params, (error: Error | null) => {
            if (error) {
              reject(new Error(error.message));
            } else {
              const signedUrlParams = {
                Bucket: process.env.S3_BUCKET,
                Key: filename,
                Expires: 60,
              };

              const downloadUrl = S3.getSignedUrl("getObject", signedUrlParams);
              result = { downloadUrl, key: filename };

              resolve();
            }
          });
        });
      } else {
        console.log("Element not found for selector:", selector);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error }, { status: 400 });
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
