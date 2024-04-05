import groq from 'groq';

export const HOME_QUERY = groq`*[_id == "home"][0]{ title, siteTitle }`;

export const RECORDS_QUERY = groq`*[_type == "record"][0...12]|order(title asc){
    _id,
    _type,
    title,
    releaseDate,
    "slug": slug.current,
    "artist": artist->name,
    image
  } | order(releaseDate desc)`;

export const RECORD_QUERY = groq`*[_type == "record" && slug.current == $slug][0]{
  _id,
  title,
  releaseDate,
  // GROQ can re-shape data in the request!
  "slug": slug.current,
  "artist": artist->name,
  // coalesce() returns the first value that is not null
  // so we can ensure we have at least a zero
  "likes": coalesce(likes, 0),
  "dislikes": coalesce(dislikes, 0),
  // for simplicity in this demo these are typed as "any"
  // we can make them type-safe with a little more work
  // https://www.simeongriggs.dev/type-safe-groq-queries-for-sanity-data-with-zod
  image,
  content,
  // this is how we extract values from arrays
  tracks[]{
    _key,
    title,
    duration
  }
}`;
export const CAROUSELS_QUERY = groq`*[_type == "home"][0]{
  isShowCarousels,
  carouselsList{
    _type,
    "carousels":carousels[]{
      ...,
      "carouselItems": carouselItems[]{
        ...,
        _type == 'image' => {
        ...,
        "altText": asset->altText,
        "blurDataURL": asset->metadata.lqip,
        'height': asset->metadata.dimensions.height,
        'url': asset->url,
        'width': asset->metadata.dimensions.width,
        'hashURL': asset-> metadata.blurHash
        }
      }
    }
  }
}`;
