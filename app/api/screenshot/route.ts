import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const S3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "key",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "secret_key",
  },
  region: "us-east-2",
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
      try {
        const chromium = await import("chrome-aws-lambda").then(
          (m) => m.default
        );

        browser = await chromium.puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();

        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 2,
        });

        await page.goto(url, { waitUntil: "networkidle0" });

        const element = await page.$(selector);

        if (element) {
          const imageBuffer = (await element.screenshot()) as string;

          const filename = "uploaded_on_" + Date.now() + ".jpg";

          const params = {
            Bucket: "visual-birds",
            Key: filename,
            Body: imageBuffer,
          };

          await new Promise<void>((resolve, reject) => {
            S3.upload(params, (error: Error | null) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                const signedUrlParams = {
                  Bucket: "visual-birds",
                  Key: filename,
                  Expires: 60,
                };

                const downloadUrl = S3.getSignedUrl(
                  "getObject",
                  signedUrlParams
                );
                result = { downloadUrl };

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
    } else {
      try {
        const puppeteer = await import("puppeteer").then((m) => m.default);
        browser = await puppeteer.launch();

        const page = await browser.newPage();

        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 2,
        });

        await page.goto(url, { waitUntil: "networkidle0" });

        const element = await page.$(selector);

        if (element) {
          const imageBuffer = await element.screenshot();

          const filename = "uploaded_on_" + Date.now() + ".jpg";

          const params = {
            Bucket: "visual-birds",
            Key: filename,
            Body: imageBuffer,
          };

          await new Promise<void>((resolve, reject) => {
            S3.upload(params, (error: Error | null) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                const signedUrlParams = {
                  Bucket: "visual-birds",
                  Key: filename,
                  Expires: 60,
                };

                const downloadUrl = S3.getSignedUrl(
                  "getObject",
                  signedUrlParams
                );
                result = { downloadUrl };

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
    }

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
