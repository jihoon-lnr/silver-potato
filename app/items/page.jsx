import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ItemList() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    const { data: items, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching items:", error.message);
      return (
        <div>
          <h1>Item List</h1>
          <p className="text-red-500">
            Failed to load items. Please try again later.
          </p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div>
          <h1>Item List</h1>
          <p>No items available. Add some new items to get started!</p>
          <Link href="/items/new">
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              New Item
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <h1 className="text-xl font-bold mb-4">Item List</h1>
        <Link href="/items/new">
          <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            New Item
          </button>
        </Link>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 min-w-[400px]">Title</th>
              <th className="border border-gray-300 px-4 py-2">Author</th>
              <th className="border border-gray-300 px-4 py-2">File Name</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const { data } = supabase.storage
                .from("uploads")
                .getPublicUrl(item.file_url);
              const publicUrl = data?.publicUrl;

              return (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Title */}
                  <td className="border border-gray-300 px-4 py-2 min-w-[400px]">
                    <Link href={`/items/${item.id}`} className="text-blue-600 hover:underline">
                      {item.title}
                    </Link>
                  </td>

                  {/* Author */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.author || item.email || "Unknown"}
                  </td>

                  {/* File Name */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {publicUrl ? (
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.file_name || item.file_url?.split("/").pop()}
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>

                  {/* Created At */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(item.created_at).toISOString().split("T")[0]}
                  </td>

                  {/* Actions */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return (
      <div>
        <h1>Item List</h1>
        <p className="text-red-500">
          An unexpected error occurred. Please try again later.
        </p>
      </div>
    );
  }
}
