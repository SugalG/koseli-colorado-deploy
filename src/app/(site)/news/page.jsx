export default async function NewsPage() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  const res = await fetch(`${base}/api/news`, { cache: "no-store" });
  const news = await res.json();

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      <section className="py-24 sm:py-20 text-center relative bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f]">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
          Latest News
        </h1>
        <div className="w-1 h-10 bg-brand-primary mx-auto mt-3 rounded"></div>
        <p className="text-gray-200 mt-4 text-base md:text-lg">
          Stay updated with the latest news and updates from Koseli Colorado.
        </p>
      </section>

      <section className="container max-w-6xl mx-auto px-6 py-24 sm:py-20">
        {news.length === 0 ? (
          <p className="text-gray-400 text-center">No news has been published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-gray-900/60 hover:bg-gray-900 transition rounded-xl overflow-hidden shadow-lg border border-gray-700"
              >
                {item.bannerUrl && (
                  <img
                    src={item.bannerUrl}
                    alt={item.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-brand-primary mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-sm mb-3">
                      {new Date(item.date || item.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-300 leading-relaxed line-clamp-5">
                      {item.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
