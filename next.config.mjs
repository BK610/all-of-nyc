/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for Supabase ESM modules in Next.js 15
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Fix for Supabase module resolution - ensure proper ESM handling
    config.module.rules.push({
      test: /node_modules\/@supabase\/supabase-js\/.*\.mjs$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  // Transpile Supabase packages to handle ESM properly
  transpilePackages: ["@supabase/supabase-js"],
};

export default nextConfig;
