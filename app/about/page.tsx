'use client'

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h2 className="text-2xl font-medium text-text mb-4">About DynamicQIP</h2>
      <p className="text-gray-700 leading-7">
        In today’s QIP system, large clinics take most of the payout pool simply by meeting benchmarks, with little incentive to improve further. Smaller clinics, meanwhile, often can’t reach those benchmarks at all, leaving them excluded even if they make meaningful progress. Our dynamic QIP model changes that by rewarding both high performance and measurable improvement. Clinics can earn bonuses not just for hitting targets, but for pushing their scores higher year over year — and earn even more when they outperform benchmarks. Sensitivity settings let you control how much weight improvement carries, while volume weighting ensures big clinics can’t dominate purely on size. This creates a healthy tug-of-war — smaller clinics push harder to close the gap, while larger clinics are motivated to keep improving to maintain their lead — driving quality upward across the entire health system.
      </p>
    </div>
  );
}


