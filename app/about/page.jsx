"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui";

const impactFeatures = [
  {
    icon: "emoji_people",
    title: "Empowering Residents",
    description: "Your voice matters",
  },
  {
    icon: "groups",
    title: "Building Community",
    description: "Stronger together",
  },
  {
    icon: "trending_up",
    title: "Driving Change",
    description: "Making a difference",
  },
];

const stats = [
  { label: "Issues Resolved", value: "1,204" },
  { label: "Active Members", value: "5,800+" },
  { label: "Resolution Time", value: "48 Hrs" },
];

const successStories = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoFPWHOjWTk0DjIuQlgr0ZiyzOGYJUvM1VvgcTZdAF92aPdl9wh770vRqFnfKiRndvBwjryXkAQiVMAgZeMpWAbimg3Aei7cHfwGEWd1CnlslEdePlK3ckTv5zDYYujymBotNUdKFHPMMe0qbZnKfPu6h95CUwU9wFeY5JsF_kbHqd3Ec8BLV8m8ZNbKYS8iDMIut5-f_-mB945Dj3_RSxKTOpJcopiDgErPIBzJ1Wo9ePZYwwvGqAZsdIAJ2boy28_Y6DoluFKVs",
    alt: "A newly cleaned up park area with volunteers",
    title: "Park Cleanup Success",
    description:
      "Residents organized through the app to clean and revitalize the local park.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3cuGn9ep6nZ33n8ZzDKHSTYW03nMadOjnleWoLqh_68YiI4QrK4hAwWqCcQ5lCvhYKNG051r8DLKzCk-E1PeV2YHe-n8e-tebRXAAIUPv_sKuoFl0GDdkk0Gb1z9rlfWfd_oyzAHRu_lAWkHyO-OQqurBhG-Y0DeHNAR59knlvBo12lVL22Lb4Vt1W8sXDCbsIyDJxjzZfSsUuKEn96B1H0ZwCx3mIGdorgO0-jx5mOR6Zy9zNy__rG6uJeBpTtQTgD1s5W4KkkQ",
    alt: "A smooth, newly paved road",
    title: "Pothole on Main St Fixed",
    description:
      "Multiple reports led to swift action from the city to repair a major pothole.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNJFpVb2EEJq8Jj-zwH0vxGRyKAlQZ4v1B2wl-jtodrtt_2DSo7LAkaA00vww79iup3dKQpe33f0TqvhhCEyZK61w96TxdhvY71-eEGtJVeyOzgAPuDuOJH3wdQTlSjOBtNnnj_rzjiKJPrxGmQsYhPcYm4E97S69FGI-ZDyPxvPjHsUWTbVik4dcBfHkKiWfGOB448eZ55Z8IXTz8WHnrdEqrE9TWb5fQn6yLbcTlLVgHNQcXIvJgTFUD5foEMtOITKxbGvOuHB8",
    alt: "A colorful new mural on a previously blank wall",
    title: "Community Mural Project",
    description:
      "A collaborative project to cover graffiti with a beautiful piece of public art.",
  },
];

const testimonials = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLB4AexUKyZjlXBbt5W-Hk3tkdt-dYXR405nl1bU2F708HdEiMhrOm7y_a_j8nnP4ZUStLZgtydly9O1tZnHrqQ6Dd5G5JZx6nbVRTbIc-ZO_92wc6L5NG7716npdFpnsmJdd29OYjDq3TRgvS2tHYamfK7CT1pfNVFUiP3cyP0_yTJNplt1t9Mc41VZqopBJ9sezPL9Y-RMZNd3GnOTOEB-F8rCX_kM5iGwvIzhTSFeqd8uMJTtTIr8bJaQFmhaVNgKDHMzpUels",
    alt: "Profile picture of Laxmi Timsina",
    name: "Laxmi Timsina",
    role: "Resident",
    quote:
      "It's amazing to see how quickly things get done now. TownSpark makes me feel like I have a real voice in my community.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Mpt0SzRw8NLWXCdHFqyWNCZewA82lRVzZUCx4w7HgVUhpOkf6zOe96OE3hezgkT-BpIsHrpDSpzElN4dvS0-Vcuk-POZfVCHNU1s3Xc-3AFzrl-E9oQsrqeZsbcACR3MZ1RNPE01dwVkJKQD44QlKT7Jqx2CxlajlPi5yRCC9w8MJnJ2LOTFMy0-J7LwnoPQeC70OsXDw10Ky0f-j0GBqwPDKdUDg3r6n6STfl61EvYlMbRnrwJVhBokbjYKcgV0-vEcYXrQ2ko",
    alt: "Profile picture of Ram Bahadur",
    name: "Ram Bahadur",
    role: "City Official",
    quote:
      "This app has streamlined our workflow. We can now address citizen reports more efficiently than ever before.",
  },
];

export default function AboutPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TownSpark - Our Impact",
          text: "Check out how TownSpark is making a difference in communities!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-dark/80 p-4 pb-2 backdrop-blur-sm justify-between sticky-top-app-bar">
        <button
          onClick={handleBack}
          className="text-white flex size-12 shrink-0 items-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined text-2xl">
            arrow_back_ios_new
          </span>
        </button>
        <h1 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          About TownSpark
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={handleShare}
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-2xl">
              ios_share
            </span>
          </button>
        </div>
      </div>

      {/* HeaderImage */}
      <div className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3 px-4">
          <div
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-background-dark @[480px]:rounded-lg min-h-80 rounded-lg"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYLePKEYEgtX6u5B2boYxpJEgZ399mWY3eJsoGsJobE1zF_C5z1cDzjYOOpsARqb_VgijTqfHV3YBrx6WkZovwfxlxs1QST-8xd9D0o7OCGrqzNj5FbzAjG5KqU6XSp5FZuf-oS8_ljxjZSvJVELlLnzWxzXqWZpfYTmc2V6r97yrV_dYj5HDI0_mqWrTbgKWkmbBTmYvUaVUn_2yzDPblMC0Nxpbou6Zw7Matr5ksrQIIk_gyWzEP8C4X4HKmrhvpS6SGTOSmybs")`,
            }}
          >
            <div className="flex p-6">
              <p className="text-white tracking-light text-[28px] font-bold leading-tight">
                Connecting neighbors to build a better TownSpark, together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TextGrid - Impact Features */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {impactFeatures.map((feature, index) => (
          <div
            key={index}
            className="flex flex-1 gap-3 rounded-lg border border-white/10 bg-[#1A262C] p-4 flex-col"
          >
            <span className="material-symbols-outlined text-primary text-2xl">
              {feature.icon}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-base font-bold leading-tight">
                {feature.title}
              </h2>
              <p className="text-white/60 text-sm font-normal leading-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 p-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-white/10 bg-[#1A262C]"
          >
            <p className="text-white/80 text-base font-medium leading-normal">
              {stat.label}
            </p>
            <p className="text-white tracking-light text-3xl font-bold leading-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* SectionHeader for Success Stories */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Success Stories
      </h2>

      {/* Success Stories Carousel */}
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {successStories.map((story, index) => (
          <div key={index} className="flex flex-col min-w-[280px] snap-start">
            <img
              className="rounded-lg h-40 w-full object-cover"
              alt={story.alt}
              src={story.image}
            />
            <div className="pt-3">
              <h3 className="text-white font-bold">{story.title}</h3>
              <p className="text-white/60 text-sm mt-1">{story.description}</p>
              <Link
                href="#"
                className="text-primary font-bold text-sm mt-2 inline-block hover:underline"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* SectionHeader for Testimonials */}
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        What People Are Saying
      </h2>

      {/* Testimonials */}
      <div className="flex flex-col gap-4 p-4 pt-0">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="rounded-lg border border-white/10 bg-[#1A262C] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full object-cover"
                alt={testimonial.alt}
                src={testimonial.image}
              />
              <div>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-white/60 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-white/80">&ldquo;{testimonial.quote}&rdquo;</p>
          </div>
        ))}
      </div>

      {/* Spacer for CTA */}
      <div className="h-28"></div>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark to-transparent">
        <Link href="/register">
          <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            Join the Community
          </button>
        </Link>
      </div>
    </div>
  );
}
