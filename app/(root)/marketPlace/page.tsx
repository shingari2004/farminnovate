import ContentSlider from "@/components/ImageSlider";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductsContainer from "@/components/ProductsContainer";

const slides = [
  {
    id: "1",
    image: "/icons/market/product1.png",
    title: "Buy Delicious produce Enjoy free shipping",
  },
  {
    id: "2",
    image: "/icons/market/product2.png",
    title: "Buy Delicious produce Enjoy free shipping",
  },
  {
    id: "3",
    image: "/icons/market/product3.png",
    title: "Buy Delicious produce Enjoy free shipping",
  },
];

export default function ProductsPage() {
  return (
    <div className="relative z-10 h-screen w-full">
      <ContentSlider slides={slides} />
      <CategoryCarousel />
      <ProductsContainer />
    </div>
  );
}
