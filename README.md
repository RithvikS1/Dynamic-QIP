# QIP Payout Calculator

A dynamic Quality Improvement Program (QIP) payout calculator built with React and Next.js featuring an ultra-minimalist design.

## Features

- **Dynamic Input Controls**: Adjust number of clinics, benchmarks, and key parameters using sliders and input fields
- **Real-time Calculations**: Automatic recalculation of payouts as you modify inputs
- **Ultra-minimalist UI**: Clean, Apple Numbers-inspired design with minimal visual clutter
- **Interactive Charts**: Bar and pie charts showing payout breakdowns and distributions
- **CSV Export**: Export calculated results to CSV format for further analysis
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## QIP Calculation Logic

The calculator implements the complete QIP payout formula:

1. **Base Share**: `B_i = V_i^γ / Σ(V_j^γ)`
2. **Performance Factor**: `PF_i,k = 1 + α × max(0, (R_i,k - R_b,k) / R_b,k)`
3. **Combined Performance Factor**: Weighted average or simple average of all benchmark performance factors
4. **Adjusted Share**: `AS_i = B_i × PF_i`
5. **Normalized Adjusted Share**: `NAS_i = AS_i / Σ(AS_j)`
6. **Main Pool Payout**: `Payout_main_i = NAS_i × P_T × (1 - β)`
7. **Improvement Factor**: `Improvement_i,k = max(0, (R_i,k - R_prev,i,k) / R_prev,i,k)`
8. **Bonus Payout**: `Bonus_i = (Improvement_i / Σ(Improvement_j)) × P_T × β`
9. **Final Payout**: `Payout_i = Payout_main_i + Bonus_i`

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying to Vercel

1. Push this repo to GitHub
2. In Vercel, import the GitHub repo and set project name to `DynamicQIP`
3. Deploy. Public URLs:
   - Main UI: `/`
   - Formula: `/QIP_Payout_Formula.html`
   - About: `/about`

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Set Parameters**: Adjust the total payout pool, bonus percentage, and use sliders to control performance sensitivity (α) and volume weighting (γ)

2. **Configure Benchmarks**: Set the number of benchmarks and define their target rates and weights

3. **Enter Clinic Data**: Input volume, current performance rates, and previous year rates for each clinic

4. **View Results**: The payout calculations update automatically in the results table and charts

5. **Export Data**: Click "Export CSV" to download the results for external analysis

## Technology Stack

- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom ultra-minimalist design
- **Charts**: Chart.js with react-chartjs-2
- **Language**: TypeScript for type safety
- **Build Tool**: Next.js built-in bundler

## Design Philosophy

The UI follows an ultra-minimalist design philosophy inspired by Apple Numbers and Figma:

- **Colors**: White background (#FFFFFF), blue primary (#3B82F6), light gray secondary (#E5E7EB), dark gray text (#111827)
- **Typography**: Inter font family with medium weight headings and regular weight labels
- **Layout**: Clean single-page dashboard with left inputs and right outputs
- **Components**: Subtle shadows, clean tables with alternating row colors, and minimal visual clutter

## License

This project is open source and available under the MIT License.