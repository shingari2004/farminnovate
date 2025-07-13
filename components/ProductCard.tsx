interface Props {
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductCard({ title, description, price, image }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-lg transition">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
      <h3 className="mt-2 font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="mt-2 font-bold text-green-600">${price.toFixed(2)}</div>
      <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add to Cart
      </button>
    </div>
  );
}
