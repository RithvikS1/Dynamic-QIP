'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    MathJax: any
  }
}

export default function FormulaPage() {
  useEffect(() => {
    const scriptId = 'mathjax-script'
    if (!document.getElementById(scriptId)) {
      window.MathJax = {
        tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']] },
      }
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
      script.async = true
      script.onload = () => {
        window.MathJax?.typeset?.()
      }
      document.head.appendChild(script)
    } else {
      window.MathJax?.typeset?.()
    }
  }, [])

  const eqFinal = String.raw`\[ P_i = \left( \frac{V_i^{\gamma} \, PF_i}{\sum_j V_j^{\gamma} \, PF_j} \right) P_T (1-\beta) \;+\; \left( \frac{I_i}{\sum_j I_j} \right) P_T \, \beta \]`
  const eqBase = String.raw`\[ B_i = \frac{V_i^{\gamma}}{\sum_j V_j^{\gamma}} \quad ; \quad AS_i = B_i \cdot PF_i \quad ; \quad NAS_i = \frac{AS_i}{\sum_j AS_j} \]`
  const eqPFk = String.raw`\[ PF_{i,k} = 1 + \alpha \cdot \max\!\left(0,\; \frac{R_{i,k} - R_{b,k}}{R_{b,k}}\right) \]`
  const eqPF = String.raw`\[ PF_i = \sum_k w_k \, PF_{i,k} \quad \text{(weighted; } \sum_k w_k = 1\text{)} \]`
  const eqPFNoWeights = String.raw`\( PF_i = \text{average of } PF_{i,k} \text{ over } k \quad \text{(no weights)} \)`
  const eqImpK = String.raw`\[ Improvement_{i,k} = \max\!\left(0,\; \frac{R_{i,k} - R_{\\text{prev},i,k}}{R_{\\text{prev},i,k}}\right) \]`
  const eqImp = String.raw`\[ I_i = \sum_k w_k \, Improvement_{i,k} \quad \text{(weighted; } \sum_k w_k = 1\text{)} \]`
  const eqImpNoWeights = String.raw`\( I_i = \text{average of } Improvement_{i,k} \text{ over } k \quad \text{(no weights)} \)`
  const eqMainBonus = String.raw`\[ Payout_{\\text{main},i} = NAS_i \\cdot P_T \\cdot (1-\\beta) \\quad ; \\quad Bonus_i = \\left( \\frac{I_i}{\\sum_j I_j} \\right) P_T \\cdot \\beta \\]`

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-medium text-text mb-1">QIP Payout Formula</h1>
      <p className="text-gray-600 mb-4">Fully formatted equation and definitions for distribution of funds across clinics.</p>

      <div className="flex items-center gap-3 mb-6">
        <button
          className="btn px-3 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-blue-600"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
        <span className="text-sm text-gray-500">Tip: In the print dialog, choose “Save as PDF”.</span>
      </div>

      <h2 className="text-xl font-medium text-text mb-2">Final Payout</h2>
      <div className="border border-secondary rounded-xl p-4 bg-white">
        <p>{eqFinal}</p>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          <li>
            <strong>Main Pool Component</strong>: {String.raw`\( \left( \frac{V_i^{\gamma} PF_i}{\sum_j V_j^{\gamma} PF_j} \right) P_T (1-\beta) \)`}
          </li>
          <li>
            <strong>Bonus Pool Component</strong>: {String.raw`\( \left( \frac{I_i}{\sum_j I_j} \right) P_T \, \beta \)`}
          </li>
        </ul>
      </div>

      <hr className="my-6 border-secondary" />

      <h2 className="text-xl font-medium text-text mb-2">Components</h2>

      <h3 className="text-base font-medium text-text mt-5 mb-1">Base Share and Normalization</h3>
      <p>{eqBase}</p>

      <h3 className="text-base font-medium text-text mt-5 mb-1">Performance Factor per Benchmark</h3>
      <p>{eqPFk}</p>

      <h3 className="text-base font-medium text-text mt-5 mb-1">Combined Performance Factor (Clinic {String.raw`\(i\)`})</h3>
      <p className="inline-block text-xs px-3 py-1 rounded-full border border-secondary text-gray-500">Weights {String.raw`\(w_k\)`} are enforced to sum to 1 in the UI; otherwise simple average.</p>
      <p className="mt-2">{eqPF}</p>
      <p>{eqPFNoWeights}</p>

      <h3 className="text-base font-medium text-text mt-5 mb-1">Improvement per Benchmark and Total Improvement</h3>
      <p>{eqImpK}</p>
      <p className="inline-block text-xs px-3 py-1 rounded-full border border-secondary text-gray-500">Improvement is weighted by benchmark priorities, similar to performance factors.</p>
      <p className="mt-2">{eqImp}</p>
      <p>{eqImpNoWeights}</p>

      <h3 className="text-base font-medium text-text mt-5 mb-1">Main and Bonus Payouts</h3>
      <p>{eqMainBonus}</p>

      <hr className="my-6 border-secondary" />

      <h2 className="text-xl font-medium text-text mb-2">Variables and Symbols</h2>
      <ul className="list-disc ml-6 text-gray-700">
        <li>{String.raw`\(P_i\)`}: Final payout for clinic {String.raw`\(i\)`}</li>
        <li>{String.raw`\(Payout_{\\text{main},i}\)`}: Main pool payout for clinic {String.raw`\(i\)`}</li>
        <li>{String.raw`\(Bonus_i\)`}: Bonus payout for clinic {String.raw`\(i\)`}</li>
        <li>{String.raw`\(V_i\)`}: Clinic {String.raw`\(i\)`} volume (e.g., number of patients)</li>
        <li>{String.raw`\(R_{i,k}\)`}: Clinic {String.raw`\(i\)`}'s current rate on benchmark {String.raw`\(k\)`}</li>
        <li>{String.raw`\(R_{b,k}\)`}: Benchmark target rate for benchmark {String.raw`\(k\)`}</li>
        <li>{String.raw`\(R_{\\text{prev},i,k}\)`}: Clinic {String.raw`\(i\)`}'s previous rate on benchmark {String.raw`\(k\)`}</li>
        <li>{String.raw`\(w_k\)`}: Weight for benchmark {String.raw`\(k\)`} (optional; if none provided, all benchmarks weighted equally)</li>
        <li>{String.raw`\(PF_{i,k}\)`}: Performance factor for clinic {String.raw`\(i\)`} on benchmark {String.raw`\(k\)`}</li>
        <li>{String.raw`\(PF_i\)`}: Combined performance factor for clinic {String.raw`\(i\)`} (weighted or simple average of {String.raw`\(PF_{i,k}\)`})</li>
        <li>{String.raw`\(B_i\)`}: Base share for clinic {String.raw`\(i\)`} from volume weighting</li>
        <li>{String.raw`\(AS_i\)`}: Adjusted share for clinic {String.raw`\(i\)`} prior to normalization</li>
        <li>{String.raw`\(NAS_i\)`}: Normalized adjusted share for clinic {String.raw`\(i\)`}</li>
        <li>{String.raw`\(I_i\)`}: Total improvement score for clinic {String.raw`\(i\)`}</li>
        <li>{String.raw`\(P_T\)`}: Total payout pool</li>
        <li>{String.raw`\(\\beta\)`}: Bonus percentage (fraction in {String.raw`\([0,1]\)`})</li>
        <li>{String.raw`\(\\alpha\)`}: Performance sensitivity parameter</li>
        <li>{String.raw`\(\\gamma\)`}: Volume weighting parameter</li>
      </ul>
    </div>
  )
}


