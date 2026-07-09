import { query } from "@/app/lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function GET(req, { params }) {
  const {id} = await params;

  try {
    const courts = await query(
      `SELECT * FROM courts WHERE id =$1`,
      [id]
    );

    console.log(courts);

    return NextResponse.json({ courts: courts.rows });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        const formData = await req.formData();

        const name = formData.get("name");
        const address = formData.get("address");
        const price = formData.get("price");
        const status = formData.get("status");
        const image = formData.get("image");

        let imageUrl = null;

        if (image && image.size > 0) {
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

            imageUrl = uploadResult.secure_url;
        }

        if (imageUrl) {
            await query(
                `
                UPDATE courts
                SET
                    name = $1,
                    address = $2,
                    price = $3,
                    is_active = $4,
                    img_url = $5
                WHERE id = $6
                `,
                [
                    name,
                    address,
                    Number(price),
                    status === "available",
                    imageUrl,
                    id,
                ]
            );
        } else {
            await query(
                `
                UPDATE courts
                SET
                    name = $1,
                    address = $2,
                    price = $3,
                    is_active = $4
                WHERE id = $5
                `,
                [
                    name,
                    address,
                    Number(price),
                    status === "available",
                    id,
                ]
            );
        }

        return NextResponse.json({
            success: true,
            message: "Court updated successfully.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update court.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        await query(
            `
            DELETE FROM courts
            WHERE id = $1
            `,
            [id]
        );

        return NextResponse.json({
            success: true,
            message: "Court deleted successfully.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete court.",
            },
            {
                status: 500,
            }
        );
    }
}