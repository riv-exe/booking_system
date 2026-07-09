import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function GET(req) {
  try {
    const courts = await query(
      `SELECT * FROM courts WHERE is_active = true`
    );

    return NextResponse.json({ courts: courts.rows });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const address = formData.get("address");
        const price = formData.get("price");
        const status = formData.get("status");
        const image = formData.get("image");

        if (!name || !address || !price || !status || !image) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                {
                    status: 400,
                }
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only JPG, PNG, and WebP images are allowed.",
                },
                {
                    status: 400,
                }
            );
        }

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise(function (resolve, reject) {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "courts",
                    },
                    function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(result);
                    }
                )
                .end(buffer);
        });

        await query(
            `
            INSERT INTO courts
            (
                name,
                address,
                price,
                img_url,
                is_active
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5
            )
            `,
            [
                name,
                address,
                Number(price),
                uploadResult.secure_url,
                status === "available",
            ]
        );

        return NextResponse.json({
            success: true,
            message: "Court added successfully.",
            imageUrl: uploadResult.secure_url,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add court.",
            },
            {
                status: 500,
            }
        );
    }
}