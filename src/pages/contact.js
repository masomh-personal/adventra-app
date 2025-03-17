export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 font-body">
      <h1 className="text-3xl font-heading mb-4">Contact Us</h1>

      <p className="text-lg mb-6">
        Got questions, feedback, or need support? We'd love to hear from you. Reach out using the
        form below or email us at{' '}
        <a href="mailto:support@adventra.com" className="text-primary hover:underline">
          support@adventra.com
        </a>
        .
      </p>

      <form className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="name" className="block font-heading mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-heading mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block font-heading mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="How can we help you?"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn bg-primary text-white hover:bg-secondary"
          onClick={(e) => {
            e.preventDefault();
            alert('Message sent! (This is a placeholder)');
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
