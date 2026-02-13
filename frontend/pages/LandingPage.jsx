export default function LandingPage() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold">Fleetiva Logistics SaaS</h1>
      <p className="mt-4 text-gray-500">
        Smart truck booking & fleet management platform.
      </p>
      <a href="/login">
        <button className="mt-6 px-6 py-2 bg-black text-white rounded">
          Get Started
        </button>
      </a>
    </div>
  );
}
