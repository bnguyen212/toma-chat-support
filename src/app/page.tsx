import Link from "next/link";
import Script from "next/script";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-[url('/hero-car.jpg')] bg-cover bg-center opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Premium Auto Sales
          </h1>
          <p className="text-xl text-white mb-8">
            Your trusted partner in finding the perfect vehicle
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors w-fit">
            Browse Inventory
          </button>
        </div>
      </div>

      {/* Featured Cars Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((car) => (
            <div key={car} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {car === 1 ? "2024 BMW X5" : car === 2 ? "2023 Mercedes C-Class" : "2024 Audi Q7"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {car === 1
                    ? "Luxury SUV with premium features"
                    : car === 2
                    ? "Elegant sedan with advanced technology"
                    : "Spacious SUV with exceptional comfort"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${car === 1 ? "65,000" : car === 2 ? "45,000" : "58,000"}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "New Cars", desc: "Latest models from top manufacturers" },
              { title: "Used Cars", desc: "Quality pre-owned vehicles" },
              { title: "Financing", desc: "Competitive rates and flexible terms" },
              { title: "Service", desc: "Expert maintenance and repairs" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Premium Auto Sales</h3>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect vehicle since 1995.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white">Inventory</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Financing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Auto Drive</li>
                <li>Car City, CA 90210</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@premiumauto.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 9am - 8pm</li>
                <li>Saturday: 10am - 6pm</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <Script src="/chat-widget.js" strategy="afterInteractive" />
    </main>
  );
}
