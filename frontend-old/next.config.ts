/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import path from "path";

// TODO: fix missing secret
// Load the .env file from the root directory
dotenv.config({ path: path.resolve("../.env") });

interface NextConfig {
  env: {
    NEXT_PUBLIC_TEZOS_RPC_URL: string;
    NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT: string;
    NEXTAUTH_URL: string;
    AUTH_SECRET: string;
    BACKEND_API_URL: string;
  };
  serverExternalPackages?: string[];
}

const nextConfig: NextConfig & { experimental: any; webpack: any } = {
  env: {
    NEXT_PUBLIC_TEZOS_RPC_URL: process.env.NEXT_PUBLIC_TEZOS_RPC_URL as string,
    NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT: process.env
      .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string,
    AUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
    BACKEND_API_URL: process.env.BACKEND_API_URL as string,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
    // Add more env variables here
  },

  // adapted from https://github.com/olliejames-xtz/beacon-nextjs/blob/c367a94b566bb89203419cc958e47f1241bdb502/next.config.mjs
  serverExternalPackages: ["@airgap/beacon-ui"],
  experimental: {},
  webpack: (
    config: any,
    { isServer, dev }: { isServer: boolean; dev: boolean },
  ) => {
    // Used for connectkit to work with nextjs
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Used for didkit-wasm to work with nextjs
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    config.watchOptions = {
      ...config.watchOptions,
      ignored: "**/node_modules",
      poll: 1000,
      aggregateTimeout: 500,
    };

    // Fallback for 'fs/promises' and other Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        // ... add any other Node.js modules you want to stub out for the browser here
      };
    }

    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }

    return config;
  },
  /* config options here */
};

class WasmChunksFixPlugin {
  apply(compiler: {
    hooks: {
      thisCompilation: {
        tap: (arg0: string, arg1: (compilation: any) => void) => void;
      };
    };
  }) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets: { [s: string]: unknown } | ArrayLike<unknown>) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          }),
      );
    });
  }
}

export default nextConfig;
