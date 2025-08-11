import Footer from "../app/components/Footer";

export default {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const WithContent = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Page Content</h1>
          <p className="text-gray-600 mb-4">
            This is sample page content to show how the footer appears at the
            bottom.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded">
              <h2 className="font-semibold mb-2">Section 1</h2>
              <p>Example content here...</p>
            </div>
            <div className="p-4 bg-gray-100 rounded">
              <h2 className="font-semibold mb-2">Section 2</h2>
              <p>Additional content here...</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ),
};

export const ResponsiveView = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Footer Component</div>
      <Footer />
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          This footer includes responsive logo sizing, contact information,
          social media links, navigation, and legal links.
        </p>
      </div>
    </div>
  ),
};
