import { createClient } from '@/utils/supabase/server'

export default async function Item({ params }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching item:', error.message);
    return <p>Error loading item</p>;
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(item.file_url);

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.content}</p>
      {item.file_url && (
        <a href={data.publicUrl} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      )}
    </div>
  );
}
