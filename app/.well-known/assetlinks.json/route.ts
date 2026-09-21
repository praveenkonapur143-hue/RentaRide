import { NextResponse } from 'next/server';

/**
 * Digital Asset Links configuration for Google Play Store Trusted Web Activity (TWA).
 * This establishes proof of ownership between the RentaRide domain and your Google Play Android App,
 * allowing the Android application to run in full-screen standalone mode without any browser address bar.
 */
export async function GET() {
  const assetLinks = [
    {
      relation: [
        'delegate_permission/common.handle_all_urls'
      ],
      target: {
        namespace: 'android_app',
        package_name: 'in.rentaride.app',
        sha256_cert_fingerprints: [
          // Replace with your SHA-256 fingerprint from Google Play Console (App Signing > App signing key certificate)
          'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C'
        ]
      }
    }
  ];

  return NextResponse.json(assetLinks, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, must-revalidate',
    },
  });
}
