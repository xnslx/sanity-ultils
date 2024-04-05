import { artistType } from '~/sanity/schema/artistType';
import { genreType } from '~/sanity/schema/genreType';
import { homeType } from '~/sanity/schema/homeType';
import { recordType } from '~/sanity/schema/recordType';
import { trackType } from '~/sanity/schema/trackType';
import { postType } from '~/sanity/schema/postType';
import { authorType } from '~/sanity/schema/authorType';
import { singlePostType } from './singlePostType';
import { tagsType } from './tagsType';
import { carouselType } from './carouselType';
import { carouselsType } from './carouselsType';
import { videoType } from './videoType';
export default [
  homeType,
  postType,
  authorType,
  singlePostType,
  tagsType,
  carouselType,
  carouselsType,
  videoType,
];
