'use client'

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h2 className="text-2xl font-medium text-text mb-4">About DynamicQIP</h2>
      <p className="text-gray-700 leading-7">
        In today’s QIP system, large clinics take most of the payout pool simply by meeting benchmarks, with little incentive to improve once those targets are reached. Smaller clinics, meanwhile, often can’t hit the benchmarks at all, leaving them excluded even if they make meaningful progress. Our dynamic QIP model changes that by rewarding both high performance and measurable improvement — including gains made after a clinic has already surpassed the benchmark. Clinics earn payouts in two ways: either by improving their scores year over year, regardless of whether they’ve reached the benchmark, or by earning additional payouts for surpassing the benchmark, with rewards that grow the further they exceed it. The model takes a wide range of inputs for each clinic — including volume, benchmark rates, previous performance, target rates, benchmark weights, and adjustable parameters for performance sensitivity, bonus percentage, and volume weighting — giving full control over how payouts are calculated. Sensitivity settings let you control how much weight improvement carries, while volume weighting ensures big clinics can’t dominate purely on size. This creates a healthy tug-of-war: smaller clinics push harder to close the gap, while larger clinics are motivated to keep improving past the benchmark to protect their lead — driving quality upward across the entire health system.
      </p>
    </div>
  );
}


