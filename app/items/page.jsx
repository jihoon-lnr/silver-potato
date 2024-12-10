import { createClient } from "@/utils/supabase/server"
import Link from 'next/link'

export default async function ItemList() {
  const supabase = await createClient();

  try {
    const { data: items, error } = await supabase.from('items').select('*')

    if (error) {
      console.error('Error fetching items:', error.message)
      return (
        <div>
          <h1>Item List</h1>
          <p className="text-red-500">Failed to load items. Please try again later.</p>
        </div>
      )
    }


    if (!items || items.length === 0) {
      return (
        <div>
          <h1>Item List</h1>
          <p>No items available. Add some new items to get started!</p>
        </div>
      )
    }

    return (
      <div>
        <h1>Item List</h1>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/items/${item.id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return (
      <div>
        <h1>Item List</h1>
        <p className="text-red-500">An unexpected error occurred. Please try again later.</p>
      </div>
    )
  }
}
