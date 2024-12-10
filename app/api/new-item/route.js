import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = await createClient();

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      console.error("Invalid content type:", contentType);
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("file");

    if (!title || !content) {
      console.error("Missing title or content:", { title, content });
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let fileUrl = null;

    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: fileData, error: fileError } = await supabase.storage
          .from("uploads")
          .upload(`files/${file.name}`, buffer, {
            contentType: file.type,
          });

        if (fileError) {
          console.error("File upload error:", fileError.message);
          throw new Error(fileError.message);
        }

        fileUrl = fileData.path;
      } catch (uploadError) {
        console.error("Error during file upload:", uploadError);
        throw new Error("Failed to upload file");
      }
    }

    const { error: insertError } = await supabase.from("items").insert([
      { title, content, file_url: fileUrl },
    ]);

    if (insertError) {
      console.error("Database insert error:", insertError.message);
      throw new Error(insertError.message);
    }

    return NextResponse.json({ message: "Item created successfully" });
  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
