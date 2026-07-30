import storySlide1 from '../assets/story-slideshow/slide-1.png';
import storySlide2 from '../assets/story-slideshow/slide-2.png';
import storySlide3 from '../assets/story-slideshow/slide-3.png';
import storySlide4 from '../assets/story-slideshow/slide-4.png';
import storySlide5 from '../assets/story-slideshow/slide-5.png';
import story2Slide1 from '../assets/story-slideshow/story-2-slide-1.png';
import story2Slide2 from '../assets/story-slideshow/story-2-slide-2.png';
import story2Slide3 from '../assets/story-slideshow/story-2-slide-3.png';
import story2Slide4 from '../assets/story-slideshow/story-2-slide-4.png';
import story2Slide5 from '../assets/story-slideshow/story-2-slide-5.png';
import story2Slide6 from '../assets/story-slideshow/story-2-slide-6.png';
import story2Slide7 from '../assets/story-slideshow/story-2-slide-7.png';

const passoverImages = [storySlide1, storySlide2, storySlide3, storySlide4, storySlide5];
const workshopImages = [
  story2Slide1,
  story2Slide2,
  story2Slide3,
  story2Slide4,
  story2Slide5,
  story2Slide6,
  story2Slide7,
];

export type CommunityStory = {
  id: string;
  title: string;
  time: string;
  images: string[];
};

export const COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: 'passover-youth-1',
    title: 'אירוע פסח לנוער',
    time: 'עכשיו',
    images: passoverImages,
  },
  {
    id: 'passover-youth-2',
    title: 'בניית חנוכיות לילדים',
    time: 'עכשיו',
    images: workshopImages,
  },
  {
    id: 'passover-youth-3',
    title: 'אירוע פסח לנוער',
    time: 'עכשיו',
    images: passoverImages,
  },
  {
    id: 'passover-youth-4',
    title: 'אירוע פסח לנוער',
    time: 'עכשיו',
    images: passoverImages,
  },
];
