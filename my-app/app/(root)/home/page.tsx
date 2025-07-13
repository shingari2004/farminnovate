import Image from "next/image";// app/page.tsx
import FarmersSection from "../../../components/FarmersSection";
import NewsSection from "../../../components/NewsSection";

export default function HomePage() {
  return (
    <main >
      <div className="relative z-10">
        <div >
          <Image src="/icons/homepage/home-bg.jpg" alt="background" width={1920} height={800}  />
        </div>
        <div className="absolute bottom-0 right-0">
          <Image src="/icons/homepage/hometrees.png" alt="background" width={1000} height={400}  />
        </div>
        <div className="absolute bottom-0 right-0">
          <Image src="/icons/homepage/farmer.png" alt="background" width={375} height={400}  />
        </div>
        <div className="absolute bottom-0 right-100">
          <Image src="/icons/homepage/tractor.png" alt="background" width={275} height={400}  />
        </div>
      </div>
      <FarmersSection />
      <NewsSection />
     
    </main>
  );
}
