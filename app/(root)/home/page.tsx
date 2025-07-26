import Image from "next/image";
// app/page.tsx 
import FarmersSection from "../../../components/FarmersSection"; 
import NewsSection from "../../../components/NewsSection";  

export default function HomePage() {   
  return (     
    <main className="w-full overflow-hidden">       
      <div className="relative min-h-screen w-full">         
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">           
          <Image 
            src="/icons/homepage/home-bg.jpg" 
            alt="background" 
            fill
            className="object-cover object-center"
            priority
          />         
        </div>         
        
        {/* Trees - Hidden on very small screens, visible from sm up */}
        <div className="absolute bottom-0 right-0 hidden sm:block">           
          <Image 
            src="/icons/homepage/hometrees.png" 
            alt="trees" 
            width={1000} 
            height={400}
            className=""
          />         
        </div>         
        
        {/* Farmer */}
        <div className="absolute bottom-0 right-0 z-10">           
          <Image 
            src="/icons/homepage/farmer.png" 
            alt="farmer" 
            width={375} 
            height={200}
            className=""
          />         
        </div>         
        
        {/* Tractor */}
        <div className="absolute bottom-0 right-[25vw]  z-5">           
          <Image 
            src="/icons/homepage/tractor.png" 
            alt="tractor" 
            width={275} 
            height={400}
            className=""
          />         
        </div>
        
        {/* Hero Content Overlay (optional - add your hero text here) */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start z-20">
          <div className="text-center md:text-left px-4 sm:px-6 lg:px-8 max-w-lg lg:max-w-xl xl:max-w-2xl md:ml-8 lg:ml-16">
            {/* Add your hero content here if needed */}
          </div>
        </div>
      </div>       
      
      <FarmersSection />       
      <NewsSection />           
    </main>   
  ); 
}