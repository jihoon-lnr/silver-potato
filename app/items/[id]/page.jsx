import { createClient } from '@/utils/supabase/server'

export default async function Item({ params }) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching item:', error.message);
    return <p>Error loading item</p>;
  }

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.content}</p>
      {item.file_url && (
        <a href={item.file_url} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )}
    </div>
  );
}
