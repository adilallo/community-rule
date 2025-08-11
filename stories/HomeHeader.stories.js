import HomeHeader from "../app/components/HomeHeader";

export default {
  title: "Components/HomeHeader",
  component: HomeHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const WithBackground = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <HomeHeader />
      <div className="flex items-center justify-center min-h-[calc(100vh-88px)]">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to CommunityRule</h1>
          <p className="text-xl opacity-90">
            This is the home page with the special HomeHeader component
          </p>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveView = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Home Header Component</div>
      <HomeHeader />
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          This is the special home page header with transparent background,
          HeaderTab styling, and different navigation behavior compared to the
          regular Header.
        </p>
      </div>
    </div>
  ),
};
