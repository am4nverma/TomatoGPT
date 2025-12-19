export default function DemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    TomatoGPT Widget Demo
                </h1>
                <p className="text-gray-600 mb-8">
                    This page shows how to embed the TomatoGPT restaurant widget in your website.
                </p>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Live Widget Preview</h2>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                            src="/embed"
                            className="w-full h-[400px]"
                            title="TomatoGPT Widget"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
                    <p className="text-gray-600 mb-4">
                        Copy and paste this code into your website:
                    </p>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        {`<iframe
  src="https://your-domain.com/embed"
  width="100%"
  height="400"
  frameborder="0"
  title="TomatoGPT Widget"
></iframe>`}
                    </pre>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Using with ngrok</h2>
                    <p className="text-gray-600 mb-4">
                        Your current ngrok URL:
                    </p>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                        {`<iframe
  src="https://chasmal-cytotropic-skye.ngrok-free.dev/embed"
  width="100%"
  height="400"
  frameborder="0"
  title="TomatoGPT Widget"
></iframe>`}
                    </pre>
                    <p className="text-sm text-gray-500">
                        ⚠️ Note: ngrok URL changes when you restart the tunnel
                    </p>
                </div>
            </div>
        </div>
    );
}
