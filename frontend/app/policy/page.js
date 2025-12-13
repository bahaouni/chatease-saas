export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
        <p className="mb-4">
          ChatEase ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our WhatsApp Automation Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">2. Information We Collect</h2>
        <p className="mb-4">We collect the following types of information to provide our services:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Account Information:</strong> Your name, email address, and basic profile information from Facebook/Meta when you log in.</li>
          <li><strong>WhatsApp Data:</strong> We access your WhatsApp Business Account ID, Phone Number ID, and message content solely for the purpose of automating replies as configured by you.</li>
          <li><strong>Usage Data:</strong> Logs of commands and interactions to help you analyze bot performance.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
        <p className="mb-4">We use your information to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide, operate, and maintain the ChatEase chatbot service.</li>
          <li>Process and generate AI responses to incoming WhatsApp messages.</li>
          <li>Authenticate your identity via Facebook Login.</li>
          <li>Improve our services and develop new features.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">4. Data Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not sell your personal data to third parties. We may share data with trusted third-party service providers (like OpenAI or Cloud Hosting providers) only as necessary to perform the services (e.g., generating AI replies).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">5. Data Removal</h2>
        <p className="mb-4">
          You have the right to request deletion of your data. You can disconnect your WhatsApp account at any time from the dashboard, which stops our access. To request full account deletion, please contact us at support@chatease.online.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at support@chatease.online.
        </p>
      </section>
    </div>
  );
}
