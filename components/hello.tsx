"use client"

import React, { useEffect, useState } from "react";

interface HelloProps {
  name: string;
}

export default function Hello({ name }: HelloProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL;
        if (!url) {
          throw new Error("Supabase functions URL is not defined");
        }

        const response = await fetch(
          url + "/hello-world",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ name }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [name]);

  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 h-140px py-10">
      <h1 className="text-2xl font-bold mb-4">Supabase Edge Function Demo</h1>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : message ? (
        <p className="text-green-600">Message: {message}</p>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
