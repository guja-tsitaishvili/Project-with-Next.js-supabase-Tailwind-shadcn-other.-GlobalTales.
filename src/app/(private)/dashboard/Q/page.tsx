export const metadata = {
  title: "About | GlobeTales",
  description:
    "Discover, share, and explore the world’s best places with GlobeTales — a social map for travelers and locals.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      {/* Page Header */}
      <h1 className="text-4xl font-bold mb-6 text-center">
        About <span className="text-blue-600">GlobeTales</span>
      </h1>

      {/* Intro */}
      <section className="space-y-4 mb-10">
        <p>
          <strong>GlobeTales</strong> is a social website built for people who love
          discovering and sharing places that matter to them. Whether it’s your favorite café
          in your hometown, a breathtaking mountain view, or a hidden alley full of culture,
          GlobeTales lets you pin your story on an interactive map for the world to see.
        </p>

        <p>
          Every user becomes an explorer, storyteller, and guide. Instead of scrolling through
          generic recommendations, you can visually explore a living world map filled with
          real experiences shared by real people. Each marker on the map represents someone’s
          favorite place and their unique memory attached to it.
        </p>

        <p>
          Our mission is simple — to build a global community that connects people through
          the places they love. From travelers seeking authentic spots to locals who want to
          show off their city’s charm, GlobeTales is for everyone who believes that the best
          places are not just locations, but stories.
        </p>
      </section>

      {/* Who it helps */}
      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Who It Helps</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Travelers</strong> — discover unique destinations recommended by real
            people, not algorithms.
          </li>
          <li>
            <strong>Locals</strong> — share the hidden gems of your city and inspire others to
            visit.
          </li>
          <li>
            <strong>Photographers & bloggers</strong> — showcase beautiful places with stories
            and build an audience who shares your curiosity.
          </li>
          <li>
            <strong>Friends & communities</strong> — create collections of favorite hangouts
            and personal memories pinned around the world.
          </li>
        </ul>

        <p>
          GlobeTales makes every post more than just a recommendation — it’s a moment frozen
          in time, a piece of someone’s journey shared with others.
        </p>
      </section>

      {/* Features */}
      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Main Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            🌍 <strong>Interactive Map</strong> — explore all posts visually; click any marker
            to see a story behind a location.
          </li>
          <li>
            📸 <strong>Photo Sharing</strong> — upload an image that captures the essence of
            your place.
          </li>
          <li>
            ✍️ <strong>Story Posts</strong> — each place can include a title, description, and
            optional coordinates.
          </li>
          <li>
            ❤️ <strong>Community</strong> — connect through shared experiences and authentic
            local knowledge.
          </li>
          <li>
            🔒 <strong>Account System</strong> — sign up, manage your posts, and customize your
            profile.
          </li>
        </ul>
      </section>

      {/* Interactive Map Tutorial */}
      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold mb-3">How to Use the Interactive Map</h2>

        <p>
          The map is the core of GlobeTales. It’s where stories come alive through markers
          representing places around the world. Here’s how to use it:
        </p>

        <ol className="list-decimal list-inside space-y-3">
          <li>
            Go to the <strong>Map</strong> page using the navigation bar at the top.
          </li>
          <li>
            Move and zoom around the map to explore posts shared by other users.
          </li>
          <li>
            Click on any <strong>marker</strong> to view a photo, title, and description of the
            place.
          </li>
          <li>
            To create your own post, <strong>click anywhere on the map</strong>. A post
            creation form will automatically open with the coordinates pre-filled.
          </li>
          <li>
            Enter your title, description, and optional photo, then click
            <strong> “Publish”</strong>.
          </li>
          <li>
            Your story will instantly appear on the map — visible to everyone visiting that
            region!
          </li>
        </ol>

        <p>
          It’s that simple — just click, write, and share. You’re not just dropping pins;
          you’re sharing experiences that could inspire someone’s next adventure.
        </p>
      </section>

      {/* Vision / Community */}
      <section className="space-y-4 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
        <p>
          We believe the world feels smaller and friendlier when people share their
          discoveries. GlobeTales isn’t about fame or followers — it’s about connection,
          curiosity, and creativity. It’s built for those who wander, explore, and cherish
          stories hidden in everyday places.
        </p>

        <p>
          Over time, we aim to turn GlobeTales into a living atlas of human experiences — a
          map where every dot is a story, and every story helps someone else see the world a
          little differently.
        </p>
      </section>

      {/* Outro */}
      <section className="text-center mt-12">
        <p className="text-lg">
          🌐 Join the adventure, share your world, and discover others’ — one story at a time.
        </p>
      </section>
    </main>
  );
}
