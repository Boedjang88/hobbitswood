"use client";

import { useEffect, useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { MapPin, Star, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

export default function LocationAndReviews() {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 200) {
          setError(data.error || 'Gagal memuat ulasan');
        } else {
          setReviewsData(data);
        }
      })
      .catch(() => setError('Terjadi kesalahan jaringan'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 md:py-32 px-6 lg:px-12 bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll direction="up" className="text-center mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold mb-3">Kunjungi Kami</p>
          <h2 className="text-3xl md:text-5xl font-serif text-brand-dark dark:text-brand-light">
            Lokasi & Ulasan
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Map Side */}
          <AnimateOnScroll direction="left" className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-sm overflow-hidden shadow-xl border border-brand-wood/10 dark:border-brand-light/10 relative group">
            <iframe 
              src="https://maps.google.com/maps?q=Tanjungsari,+Desa+Ngesrep,+Kecamatan+Ngemplak,+Kabupaten+Boyolali,+Jawa+Tengah+57375&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0"
            ></iframe>
          </AnimateOnScroll>

          {/* Reviews Side */}
          <AnimateOnScroll direction="right" className="flex flex-col space-y-8">
            <div className="bg-brand-cream dark:bg-zinc-900 p-8 md:p-10 rounded-sm shadow-sm border border-brand-wood/5 dark:border-brand-light/5">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-wood/10 dark:border-brand-light/10">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md p-3 shrink-0">
                   {/* Google G icon SVG */}
                   <svg viewBox="0 0 24 24" className="w-full h-full">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                   </svg>
                </div>
                <div>
                  <h3 className="text-xl font-serif text-brand-dark dark:text-brand-light">Google Reviews</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-dark dark:text-brand-light font-bold">
                      {reviewsData?.rating ? reviewsData.rating.toFixed(1) : "-"}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${reviewsData?.rating && star <= Math.round(reviewsData.rating) ? "fill-brand-gold text-brand-gold" : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"}`} 
                        />
                      ))}
                    </div>
                    {reviewsData?.user_ratings_total && (
                      <span className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                        ({reviewsData.user_ratings_total})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-brand-dark/50 dark:text-brand-light/50">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm font-medium">Memuat ulasan asli dari Google...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-md flex flex-col items-center text-center">
                  <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                  <h4 className="text-red-700 dark:text-red-400 font-semibold mb-2">Integrasi Terputus</h4>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">{error}</p>
                  <p className="text-xs text-red-500/80 dark:text-red-400/80">
                    Tambahkan <code className="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">GOOGLE_PLACES_API_KEY</code> dan <code className="bg-red-100 dark:bg-red-900/30 px-1 py-0.5 rounded">GOOGLE_PLACE_ID</code> ke file .env Anda untuk menampilkan ulasan.
                  </p>
                </div>
              ) : reviewsData?.reviews?.length > 0 ? (
                <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {reviewsData.reviews.map((review: any, i: number) => (
                    <div key={i} className="space-y-2 pb-6 border-b border-brand-wood/5 dark:border-brand-light/5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.profile_photo_url} 
                            alt={review.author_name} 
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-sm font-semibold text-brand-dark dark:text-brand-light">{review.author_name}</p>
                            <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">{review.relative_time_description}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 fill-brand-gold text-brand-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-brand-dark/50 dark:text-brand-light/50">
                  <p className="text-sm font-medium">Belum ada ulasan untuk lokasi ini.</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-brand-wood/10 dark:border-brand-light/10">
                <a 
                  href="https://maps.google.com/?q=Tanjungsari,+Desa+Ngesrep,+Kecamatan+Ngemplak,+Kabupaten+Boyolali,+Jawa+Tengah+57375" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-dark dark:bg-brand-light text-brand-light dark:text-brand-dark font-medium text-sm hover:bg-brand-wood dark:hover:bg-brand-cream transition-colors rounded-sm"
                >
                  Beri Ulasan di Google Maps <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-brand-wood text-brand-light p-8 md:p-10 rounded-sm shadow-sm flex flex-col items-center text-center">
              <MapPin className="w-8 h-8 text-brand-gold mb-4" />
              <h3 className="text-xl font-serif mb-3">Alamat Workshop</h3>
              <p className="text-brand-light/80 text-sm leading-relaxed mb-6">
                Tanjungsari, Desa Ngesrep,<br />
                Kecamatan Ngemplak, Kabupaten Boyolali,<br />
                Jawa Tengah 57375
              </p>
              <a 
                href="https://maps.google.com/?q=Tanjungsari,+Desa+Ngesrep,+Kecamatan+Ngemplak,+Kabupaten+Boyolali,+Jawa+Tengah+57375" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors text-sm font-medium rounded-sm"
              >
                DAPATKAN PETUNJUK ARAH
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
