import { createClient } from "@/utils/supabase/server";

export default async function Item({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching item:", error.message);
    return <p className="text-red-500">Error loading item</p>;
  }

  const { data: fileData } = supabase.storage
    .from("uploads")
    .getPublicUrl(item.file_url);

  const renderContentWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

    // Format created_at date to YYYY-MM-DD
  const formattedDate = new Date(item.created_at).toISOString().split("T")[0];

  return (
    <div className="min-w-[1000px] mx-auto p-8 bg-white shadow rounded space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">{item.title}</h1>

      {/* Author */}
      <p className="text-sm text-gray-600">
        <span className="font-medium">Author:</span> {item.author || "Unknown"}
      </p>

      {/* Created At */}
      <p className="text-sm text-gray-600">
        <span className="font-medium">Date:</span> {formattedDate}
      </p>

      {/* Content */}
      <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
        {renderContentWithLinks(item.content)}
      </div>

      {/* File Download */}
      {item.file_url && (
        <div className="mt-6">
          <span className="font-medium text-gray-700">Attachment: </span>
          <a
            href={fileData?.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {item.file_url.split("/").pop()}
          </a>
        </div>
      )}
    </div>
  );
}
