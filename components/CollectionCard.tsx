interface CollectionCardProps {
  id: string;
  title: string;
  description: string;
}

export default function CollectionCard({
  id,
  title,
  description,
}: CollectionCardProps) {
  return (
    <div className="collection-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
