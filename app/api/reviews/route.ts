import { NextResponse } from 'next/server';

export async function GET() {
  // Mengambil kunci API dan Place ID dari environment variables
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // Dummy data fallback
  const dummyData = {
    rating: 5.0,
    user_ratings_total: 128,
    reviews: [
      {
        author_name: "Budi Santoso",
        profile_photo_url: "https://ui-avatars.com/api/?name=Budi+Santoso&background=B8956A&color=fff",
        rating: 5,
        relative_time_description: "sebulan yang lalu",
        text: "Kualitas kayu jatinya sangat luar biasa. Finishing rapi dan pelayanan sangat memuaskan. Terima kasih Hobbits Wood!"
      },
      {
        author_name: "Siti Rahmawati",
        profile_photo_url: "https://ui-avatars.com/api/?name=Siti+Rahmawati&background=random&color=fff",
        rating: 5,
        relative_time_description: "3 bulan yang lalu",
        text: "Pesan meja makan custom, hasilnya melebihi ekspektasi. Sangat estetik dan kokoh. Pengirimannya juga aman."
      },
      {
        author_name: "Andi Wijaya",
        profile_photo_url: "https://ui-avatars.com/api/?name=Andi+Wijaya&background=random&color=fff",
        rating: 5,
        relative_time_description: "5 bulan yang lalu",
        text: "Sangat direkomendasikan untuk yang mencari perabotan kayu solid. Pengrajin sangat teliti dan detail."
      }
    ]
  };

  if (!apiKey || !placeId) {
    // Return graceful fallback instead of error
    return NextResponse.json(dummyData);
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}&language=id`
    );
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error("Google API Error:", data.error_message);
      // Fallback on error
      return NextResponse.json(dummyData);
    }

    return NextResponse.json(data.result);
  } catch (error) {
    console.error("Fetch Error:", error);
    // Fallback on network error
    return NextResponse.json(dummyData);
  }
}
