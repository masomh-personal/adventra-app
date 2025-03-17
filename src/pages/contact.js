export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-heading text-center mb-2">Contact Us</h2>
        <hr className="border-t border-gray-300 mb-6" />

        <p className="text-lg mb-6 text-center">
          Got questions, feedback, or need support? Reach out below or email us at{' '}
          <a href="mailto:support@adventra.com" className="text-primary hover:underline">
            support@adventra.com
          </a>
          .
        </p>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-heading mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn bg-primary text-white hover:bg-secondary w-full"
            onClick={(e) => {
              e.preventDefault();
              alert('Message sent! (This is a placeholder)');
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
