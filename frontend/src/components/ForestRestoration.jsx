import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaTwitter, FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";

export default function ForestRestoration() {
  return (
    <div className="w-full bg-green-50 text-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="\images\gbt_Logo.avif"
              alt="Logo"
              className="h-10 w-30 object-contain"
            />
            <h1 className="font-bold text-lg">
              Chief Minister's Plant for <span className="text-green-700">Pakistan</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-500">
                <span>WHAT WE DO</span>
                <span className="text-xs">â–¼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-500">
                <span>WHO WE HELP</span>
                <span className="text-xs">â–¼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-500">
                <span>WHO WE ARE</span>
                <span className="text-xs">â–¼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-500">
                <span>HOW WE DELIVER</span>
                <span className="text-xs">â–¼</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-green-500">
                <span>JOIN INITIATIVE</span>
                <span className="text-xs">â–¼</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-green-700"
              >
                View Our Tree Map
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-green-600" />
              <a
                href="mailto:pdcmp@gmail.com?subject=Reached&body=You have reached here"
                className="hover:underline text-green-700"
              >
                muhammadaliq81@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-600" />
              <a href="tel:+9242993326645" className="hover:underline text-green-700">
                (042) 993 326645
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Video Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <video 
            className="w-full h-full object-cover"
            autoPlay 
            loop 
            muted
            playsInline
          >
            <source src="/videos/Recording 2025-08-20 002733.mp4" type="video/mp4" />
          </video>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-start px-20">
          <div className="text-white max-w-2xl">
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Drive Tomorrow's
              <br />
              Possibilities
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              We help companies redefine the future
              <br />
              through technology
            </p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium">
              Get in Touch
            </button>
          </div>
        </div>

        {/* Side Button */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <button className="bg-green-500 text-white px-4 py-8 writing-mode-vertical text-sm font-medium hover:bg-green-600 transform -rotate-90">
            Let's Talk Business
          </button>
        </div>

        {/* Bottom Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <div className="w-3 h-3 bg-white bg-opacity-50 rounded-full"></div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative w-full grid md:grid-cols-2 items-center bg-green-100">
        <div className="p-10 space-y-6">
          <span className="text-sm font-semibold border px-3 py-1 rounded-full border-green-400 text-green-700 bg-green-50">
            Heading Towards a Greener Tomorrow
          </span>
          <h2 className="text-4xl font-extrabold leading-snug text-green-800">
            Plant For Pakistan
          </h2>
          <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 shadow-md">
            Get Involved Now
          </button>
        </div>

        <div className="relative h-full w-full">
          <img
            src="\images\slider-left-bg.png"
            alt="Tree Planting"
            className="h-full w-full object-cover"
          />
          <button className="absolute top-4 right-4 bg-green-700 hover:bg-green-800 text-white rounded-full px-6 py-2 shadow-md">
            Plant a Tree
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-green-50 shadow-inner">
        <button 
          onClick={() => window.location.href = '/plantation-drives'}
          className="text-center p-4 shadow rounded-lg bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <p className="text-2xl font-bold text-green-600">52,392,114</p>
          <p className="text-gray-700">Plantation</p>
        </button>
        
        <button 
          onClick={() => window.location.href = '/art-gallery'}
          className="text-center p-4 shadow rounded-lg bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <p className="text-2xl font-bold text-green-600">32,744</p>
          <p className="text-gray-700">Art Gallery</p>
        </button>
        
        <button 
          onClick={() => window.location.href = '/photography'}
          className="text-center p-4 shadow rounded-lg bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <p className="text-2xl font-bold text-green-600">96,240</p>
          <p className="text-gray-700">Photography</p>
        </button>
        
        <button 
          onClick={() => window.location.href = '/essay-writing'}
          className="text-center p-4 shadow rounded-lg bg-white hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <p className="text-2xl font-bold text-green-600">3,818</p>
          <p className="text-gray-700">Essay writing</p>
        </button>
      </section>

      {/* App Download Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/images/section-bg.jpg" 
            alt="Forest Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="\images\departments-image.png" 
                alt="Plant for Pakistan App" 
                className="h-80 w-auto"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <span className="inline-block bg-green-500 text-green-100 px-4 py-2 rounded-full text-sm font-semibold">
              GET THE APP - PLANT THE FUTURE
            </span>
            
            <h2 className="text-4xl font-bold leading-tight">
              Download the App and<br />
              Join the Movement!
            </h2>
            
            <p className="text-green-100 text-lg leading-relaxed">
              Take action for the environment. With the 'Plant for Pakistan' App, you can stay updated and actively contribute to our mission of reforesting the nation. Download App now to track your impact, join plantation events, and make every tree count.
            </p>
            
            <div className="flex gap-4">
              <img 
                src="/images/google-playstore.png" 
                alt="Get it on Google Play" 
                className="h-12 cursor-pointer hover:scale-105 transition-transform"
              />
              <img 
                src="\images\images (1).png" 
                alt="Download on App Store" 
                className="h-12 cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Initiative Categories */}
      <section className="py-12 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12">
            <button className="bg-green-500 text-white p-6 rounded-lg hover:bg-green-600 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">ðŸŒ±</div>
                <h3 className="font-semibold text-sm">CM's Plant for Pakistan Initiative</h3>
              </div>
            </button>
            
            <button className="bg-gray-200 text-gray-700 p-6 rounded-lg hover:bg-gray-300 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">ðŸŒ¿</div>
                <h3 className="font-semibold text-sm">CM's Initiative for Agroforestry</h3>
              </div>
            </button>
            
            <button className="bg-gray-200 text-gray-700 p-6 rounded-lg hover:bg-gray-300 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">ðŸŒ²</div>
                <h3 className="font-semibold text-sm">Other Forestry Projects</h3>
              </div>
            </button>
            
            <button className="bg-gray-200 text-gray-700 p-6 rounded-lg hover:bg-gray-300 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">ðŸƒ</div>
                <h3 className="font-semibold text-sm">Plantation by Other Departments</h3>
              </div>
            </button>
            
            <button className="bg-gray-200 text-gray-700 p-6 rounded-lg hover:bg-gray-300 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">ðŸ‘¥</div>
                <h3 className="font-semibold text-sm">Community Engagement for Plantation</h3>
              </div>
            </button>
          </div>
          
          {/* Initiative Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  CM's "Plant For Pakistan" Initiative
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                  The Chief Minister's Plan for Pakistan aims to address climate change and environmental degradation through large-scale tree planting efforts. By promoting afforestation and reforestation, the initiative seeks to restore the country's ecosystem and support sustainable development. The Chief Minister's Plan for Pakistan aims to address climate change and environmental degradation through large-scale tree planting efforts.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <div className="text-white text-xl">ðŸ“</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">50,869</div>
                    <div className="text-sm text-gray-500">ACRES<br />TOTAL AREA</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <div className="text-white text-xl">ðŸ’°</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">8,000</div>
                    <div className="text-sm text-gray-500">MILLION<br />TOTAL COST</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <div className="text-white text-xl">ðŸŒ³</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">42.5</div>
                    <div className="text-sm text-gray-500">MILLION<br />NO. OF PLANTS</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <div className="text-white text-xl">ðŸ“…</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">51</div>
                    <div className="text-sm text-gray-500">MONTHS<br />GESTATION PERIOD</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <img 
                  src="\images\departments-image.png" 
                  alt="Mountain Forest" 
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">OBJECTIVES:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Enhance Forest Cover
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Meet SDG (No.15) - Life on Earth
                   </li>
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                     Carbon Sequestration
                   </li>
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                     Conserve Eco-systems
                   </li>
                 </ul>
               </div>
             </div>
           </div>
         </div>
       </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Video 1 */}
            <div className="relative">
              <video 
                className="w-[800px] h-[450px] object-contain"
                autoPlay 
                loop 
                muted
                playsInline
              >
                <source src="/videos/Recording 2025-08-20 004517.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video 2 */}
            <div className="relative">
              <video 
                className="w-[800px] h-[450px] object-contain"
                autoPlay 
                loop 
                muted
                playsInline
              >
                <source src="/videos/Recording 2025-08-20 005418.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-bold text-teal-600 leading-tight mb-6">
                  Stories of our transformations <span className="text-green-600">across</span><br />
                  services and Industries
                </h2>
                <p className="text-xl text-gray-600 mb-8">From Concept to Completion</p>
                <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                  Explore More
                </button>
              </div>
            </div>

            {/* Right Content - Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Large Cards */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white min-h-48 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Case Study</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-bold text-lg leading-tight">
                      Enabling Seamless Resale Operations Across E-Commerce
                    </h3>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-6 text-white min-h-48 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-4 left-4">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Blogs</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-bold text-lg leading-tight">
                      How Cloud Computing Can Transform Small Businesses
                    </h3>
                  </div>
                </div>
              </div>

              {/* Medium Cards */}
              <div className="space-y-4">
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">BLOGS</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      Custom Web Application Development Everything You Need to Know
                    </h4>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Blogs</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      Trends of Mobile Design: What's Next for Your Business?
                    </h4>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Blogs</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      How Generative AI is Transforming Business Operations
                    </h4>
                  </div>
                </div>
              </div>

              {/* Right Cards */}
              <div className="space-y-4">
                <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Case Study</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      Automated Financial Accuracy
                    </h4>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Case Study</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      KUDO's Journey to Bridging Global Communications
                    </h4>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-4 text-white min-h-32 hover:scale-105 transition-transform cursor-pointer">
                  <div className="absolute top-3 left-3">
                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Case Study</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h4 className="font-semibold text-sm leading-tight">
                      Automating Financial Insights for Smarter Business Decisions
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Contact & Footer Section */}
<footer className="bg-white border-t-2 border-gray-200">
  <div className="bg-gray-50 py-16">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Contact Us</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold text-gray-800">Address:</p>
              <p className="text-gray-600 mt-1">Office of the Project Director, PNU CMPP, Forest Colony 104-Ravi Road, Lahore.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold text-gray-800">Email:</p>
              <p className="text-gray-600 mt-1">pdcmpp@gmail.com</p>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com/plantforpakistan" target="_blank" rel="noreferrer"
                 className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-gray-200"
                 style={{ backgroundColor: "#1DA1F2" }}>
                <FaTwitter className="text-white" />
              </a>
              
              <a href="https://facebook.com/plantforpakistan" target="_blank" rel="noreferrer"
                 className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-gray-200"
                 style={{ backgroundColor: "#1877F2" }}>
                <FaFacebookF className="text-white" />
              </a>
              
              <a href="https://pinterest.com/plantforpakistan" target="_blank" rel="noreferrer"
                 className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-gray-200"
                 style={{ backgroundColor: "#E60023" }}>
                <FaPinterestP className="text-white" />
              </a>
              
              <a href="https://instagram.com/plantforpakistan" target="_blank" rel="noreferrer"
                 className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md border border-gray-200"
                 style={{ background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" }}>
                <FaInstagram className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">Our Media Gallery</h3>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="aspect-square bg-green-100 rounded-lg border-2 border-green-200 flex items-center justify-center hover:border-green-400 transition-colors cursor-pointer">
              <span className="text-green-600 text-2xl">ðŸŒ±</span>
            </div>
            <div className="aspect-square bg-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
              <span className="text-blue-600 text-2xl">ðŸŒ³</span>
            </div>
            <div className="aspect-square bg-yellow-100 rounded-lg border-2 border-yellow-200 flex items-center justify-center hover:border-yellow-400 transition-colors cursor-pointer">
              <span className="text-yellow-600 text-2xl">ðŸŒ»</span>
            </div>
            <div className="aspect-square bg-purple-100 rounded-lg border-2 border-purple-200 flex items-center justify-center hover:border-purple-400 transition-colors cursor-pointer">
              <span className="text-purple-600 text-2xl">ðŸŒº</span>
            </div>
            <div className="aspect-square bg-red-100 rounded-lg border-2 border-red-200 flex items-center justify-center hover:border-red-400 transition-colors cursor-pointer">
              <span className="text-red-600 text-2xl">ðŸŒ¹</span>
            </div>
            <div className="aspect-square bg-indigo-100 rounded-lg border-2 border-indigo-200 flex items-center justify-center hover:border-indigo-400 transition-colors cursor-pointer">
              <span className="text-indigo-600 text-2xl">ðŸª´</span>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => window.open('/gallery', '_blank')}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md border border-green-600 font-semibold"
            >
              Explore Our Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright Section */}
  <div className="bg-gray-800 text-white py-6 border-t-4 border-green-500">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="border border-gray-600 rounded-lg py-4 px-6 bg-gray-700">
        <p className="text-sm">
          Copyright Â© 2025 <strong className="text-green-400">All Rights Reserved by Plantify Organization</strong>. 
          Powered By <strong className="text-blue-400">Air University</strong>. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}