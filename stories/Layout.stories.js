import Header from "../app/components/Header";
import HomeHeader from "../app/components/HomeHeader";
import Footer from "../app/components/Footer";

export default {
  title: "Layout/Complete Pages",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const RegularPage = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Regular Page Layout</h1>
          <p className="text-gray-600 mb-4">
            This demonstrates a typical page layout using the regular Header
            component.
          </p>
          <div className="space-y-6">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Content Section 1</h2>
              <p>This is where example page content would go.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Content Section 2</h2>
              <p>Additional content sections can be added here.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ),
};

export const HomePage = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-1 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
          <div className="text-center text-white max-w-4xl mx-auto px-8">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to CommunityRule
            </h1>
            <p className="text-xl opacity-90 mb-8">
              This demonstrates the home page layout using the special
              HomeHeader component with a dark gradient background.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-3">Feature 1</h2>
                <p>Description of the first main feature.</p>
              </div>
              <div className="p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-3">Feature 2</h2>
                <p>Description of the second main feature.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ),
};

export const ComponentComparison = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Header vs HomeHeader Comparison
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Regular Header</h3>
            <div className="border rounded-lg overflow-hidden">
              <Header />
              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Used throughout the app with solid background and standard
                  navigation.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Home Header</h3>
            <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
              <HomeHeader />
              <div className="p-4 bg-white/10">
                <p className="text-sm text-white">
                  Special header for home page with transparent background and
                  HeaderTab styling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
