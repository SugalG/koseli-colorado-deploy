export const metadata = {
  title: "About Us | Koseli Colorado",
  description:
    "Learn more about Koseli Colorado — promoting Nepali cinema, music, and culture across North America through films, concerts, and community events.",
};

export default async function AboutPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${base}/api/about`, { cache: "no-store" });
  const data = await res.json();

  const fallback = `
Koseli Colorado LLC USA, located at 1255 Bistre Street, Longmont, CO 80501, is a Colorado-based entertainment company dedicated to promoting and celebrating the vibrant arts of Nepali cinema and music within the United States. Serving as a cultural bridge, we actively engage audiences with the richness of Nepali culture through the mediums of cinema and music.

Committed to fostering cultural exchange and creating memorable experiences for our community, Koseli Colorado USA aims to lead in introducing Nepali cinema and music to audiences in the U.S. and Canada. Our mission is to showcase diverse narratives and artistic expressions that authentically capture the essence of Nepal while collaborating with local profit and nonprofit organizations to support and promote their endeavors.

With official distribution rights for Nepali films, we proudly present these cinematic creations across the U.S. and Canada, sharing compelling stories that resonate with people from all walks of life. In addition to our cinematic endeavors, Koseli Colorado USA is renowned for hosting exceptional musical concerts featuring top artists like Melina Rai, Nhyoo Bajracharya, Kali Prasad Baskota, Indira Joshi, Vten, Mantra Band, and Sajjan Raj Vaidya. We have also distributed blockbuster movies such as “Mahajatra,” “Boksi ko Ghar,” and “Pujar Sarki,” delivering unforgettable moments to our audience.

As a cultural catalyst, we facilitate connections and promote unity within the Nepali community in Colorado, providing a platform for individuals to come together and appreciate the diverse beauty of Nepali arts. We invite you to embark on this enriching cultural journey with us — experiencing the enchanting world of Nepali cinema, captivating musical performances, and engaging with a community that values and cherishes the richness of Nepali arts.
`;

  const content = (data?.content || fallback).trim();

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* 🔹 Header */}
      <section className="text-center py-20 bg-white border-b border-gray-200">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-brand-primary">
          About <span className="text-gray-900">Koseli Colorado</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Promoting Nepali cinema, music, and culture across North America.
        </p>
      </section>

      {/* 🔹 Detailed Company Description */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-gray-700 leading-relaxed whitespace-pre-line">
        <article className="space-y-8 text-lg">
          {content.split("\n\n").map((para, i) => (
            <p key={i} className="max-w-4xl mx-auto">
              {para.trim()}
            </p>
          ))}
        </article>
      </section>

      {/* 🔹 Mission & Vision */}
      <section className="bg-white py-20 px-6 md:px-12 text-center border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="p-8 bg-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To showcase Nepali cinema and music as a global art form — fostering unity, pride, and collaboration across communities in North America.
            </p>
          </div>

          <div className="p-8 bg-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To become a leading platform that connects Nepali artists and audiences worldwide — preserving cultural heritage through creativity and performance.
            </p>
          </div>
        </div>
      </section>

      {/* 🔹 Community Highlights */}
      <section className="py-24 px-6 md:px-12 text-center bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Our <span className="text-brand-primary">Community</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed mb-12">
            From concerts and film screenings to charity events, Koseli Colorado
            brings Nepali voices to the global stage through creativity and collaboration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎤",
                title: "Live Concerts",
                desc: "Hosting unforgettable performances by leading Nepali artists.",
              },
              {
                icon: "🎬",
                title: "Film Distribution",
                desc: "Official distributor of blockbuster Nepali films across the U.S. and Canada.",
              },
              {
                icon: "🤝",
                title: "Cultural Exchange",
                desc: "Collaborating with organizations to promote unity and community development.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-2xl font-semibold mb-3 text-brand-primary">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
