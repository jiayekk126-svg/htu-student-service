import type { NextConfig } from "next";
import { networkInterfaces } from "os";

function getNetworkIps(): string[] {
  const ips: string[] = []
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address)
      }
    }
  }
  return ips
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getNetworkIps(),
};

export default nextConfig;
