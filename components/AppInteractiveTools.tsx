import React, { useState } from 'react';

interface AppInteractiveToolsProps {
  toolType: string;
  toolName: string;
  primaryColor: string;
  accentColor: string;
  onSendToAI?: (prompt: string) => void;
}

export const AppInteractiveTools: React.FC<AppInteractiveToolsProps> = ({
  toolType,
  toolName,
  primaryColor,
  accentColor,
  onSendToAI
}) => {
  // Generic states for different tools
  // General AI Planner
  const [genTaskGoal, setGenTaskGoal] = useState('Launch Multi-Platform App Series');
  const [genPriority, setGenPriority] = useState('High');
  const [genHours, setGenHours] = useState('14');
  const [genDeliverable, setGenDeliverable] = useState('Software Release Roadmap');
  const [genResult, setGenResult] = useState<any | null>(null);

  // Medical Emergency & Diagnostics (MedCare Pro)
  const [careAgeGroup, setCareAgeGroup] = useState('Adult (18-64)');
  const [careCluster, setCareCluster] = useState('Chest Discomfort & Dyspnea');
  const [careHeartRate, setCareHeartRate] = useState('98');
  const [careSpO2, setCareSpO2] = useState('96');
  const [careTemp, setCareTemp] = useState('98.6');
  const [careResult, setCareResult] = useState<any | null>(null);

  // Non-Profit Impact & Grants (CausePilot)
  const [npBudget, setNpBudget] = useState('250000');
  const [npGrantReq, setNpGrantReq] = useState('50000');
  const [npCostPerBeneficiary, setNpCostPerBeneficiary] = useState('125');
  const [npRetentionRate, setNpRetentionRate] = useState('68');
  const [npResult, setNpResult] = useState<any | null>(null);

  // Legal
  const [legalPartyA, setLegalPartyA] = useState('Acme Corp');
  const [legalPartyB, setLegalPartyB] = useState('Jane Doe');
  const [legalState, setLegalState] = useState('Delaware');
  const [legalTerm, setLegalTerm] = useState('2');
  const [legalResult, setLegalResult] = useState<string | null>(null);

  // Medical
  const [medMeds, setMedMeds] = useState('Lisinopril, Ibuprofen');
  const [medSymptoms, setMedSymptoms] = useState('Headache, mild dizziness');
  const [medSystolic, setMedSystolic] = useState('135');
  const [medDiastolic, setMedDiastolic] = useState('85');
  const [medResult, setMedResult] = useState<any | null>(null);

  // Injury
  const [injMedBills, setInjMedBills] = useState('8500');
  const [injLostWages, setInjLostWages] = useState('3200');
  const [injPropDamage, setInjPropDamage] = useState('6000');
  const [injPainLevel, setInjPainLevel] = useState('3');
  const [injResult, setInjResult] = useState<any | null>(null);

  // Real estate
  const [rePrice, setRePrice] = useState('450000');
  const [reDown, setReDown] = useState('20');
  const [reRate, setReRate] = useState('6.75');
  const [reRent, setReRent] = useState('3400');
  const [reExp, setReExp] = useState('900');
  const [reResult, setReResult] = useState<any | null>(null);

  // Finance
  const [finStart, setFinStart] = useState('25000');
  const [finMonthly, setFinMonthly] = useState('1200');
  const [finRate, setFinRate] = useState('8.5');
  const [finYears, setFinYears] = useState('25');
  const [finResult, setFinResult] = useState<any | null>(null);

  // Tax
  const [taxGross, setTaxGross] = useState('135000');
  const [taxExpenses, setTaxExpenses] = useState('24000');
  const [taxMiles, setTaxMiles] = useState('8500');
  const [taxResult, setTaxResult] = useState<any | null>(null);

  // Dental
  const [dentProc, setDentProc] = useState('crown');
  const [dentCoverage, setDentCoverage] = useState('50');
  const [dentResult, setDentResult] = useState<any | null>(null);

  // Chiro
  const [chiroHours, setChiroHours] = useState('8');
  const [chiroPain, setChiroPain] = useState('moderate');
  const [chiroResult, setChiroResult] = useState<any | null>(null);

  // Auto
  const [autoCode, setAutoCode] = useState('P0420');
  const [autoQuote, setAutoQuote] = useState('1250');
  const [autoResult, setAutoResult] = useState<any | null>(null);

  // Roofing
  const [roofSqFt, setRoofSqFt] = useState('2400');
  const [roofPitch, setRoofPitch] = useState('6/12');
  const [roofMaterial, setRoofMaterial] = useState('architectural');
  const [roofResult, setRoofResult] = useState<any | null>(null);

  // HVAC
  const [hvacSqFt, setHvacSqFt] = useState('2200');
  const [hvacZone, setHvacZone] = useState('moderate');
  const [hvacSeer, setHvacSeer] = useState('18');
  const [hvacResult, setHvacResult] = useState<any | null>(null);

  // IT Support
  const [itPorts, setItPorts] = useState('22, 80, 443, 3389');
  const [itOs, setItOs] = useState('linux');
  const [itResult, setItResult] = useState<any | null>(null);

  // Insurance
  const [insIncome, setInsIncome] = useState('110000');
  const [insMortgage, setInsMortgage] = useState('320000');
  const [insKids, setInsKids] = useState('2');
  const [insResult, setInsResult] = useState<any | null>(null);

  // Security
  const [secDoors, setSecDoors] = useState('3');
  const [secWindows, setSecWindows] = useState('12');
  const [secSqFt, setSecSqFt] = useState('2500');
  const [secResult, setSecResult] = useState<any | null>(null);

  // Credit
  const [credScore, setCredScore] = useState('610');
  const [credBalance, setCredBalance] = useState('8500');
  const [credLimit, setCredLimit] = useState('12000');
  const [credResult, setCredResult] = useState<any | null>(null);

  // Fitness
  const [fitWeight, setFitWeight] = useState('225');
  const [fitReps, setFitReps] = useState('6');
  const [fitDays, setFitDays] = useState('4');
  const [fitResult, setFitResult] = useState<any | null>(null);

  // Nutrition
  const [nutrWeight, setNutrWeight] = useState('180');
  const [nutrHeight, setNutrHeight] = useState('70');
  const [nutrAge, setNutrAge] = useState('32');
  const [nutrGoal, setNutrGoal] = useState('cut');
  const [nutrResult, setNutrResult] = useState<any | null>(null);

  // Landscape
  const [landLength, setLandLength] = useState('40');
  const [landWidth, setLandWidth] = useState('20');
  const [landDepth, setLandDepth] = useState('3');
  const [landResult, setLandResult] = useState<any | null>(null);

  // Vet
  const [vetType, setVetType] = useState('dog');
  const [vetWeight, setVetWeight] = useState('45');
  const [vetItem, setVetItem] = useState('chocolate');
  const [vetResult, setVetResult] = useState<any | null>(null);

  // Immigration
  const [immDegree, setImmDegree] = useState('masters');
  const [immExp, setImmExp] = useState('5');
  const [immSponsor, setImmSponsor] = useState('yes');
  const [immResult, setImmResult] = useState<any | null>(null);

  // Calculations
  const calculateTool = () => {
    switch (toolType) {
      case 'general_calc': {
        const hrs = parseFloat(genHours) || 8;
        const phase1Hours = (hrs * 0.25).toFixed(1);
        const phase2Hours = (hrs * 0.40).toFixed(1);
        const phase3Hours = (hrs * 0.20).toFixed(1);
        const phase4Hours = (hrs * 0.15).toFixed(1);
        setGenResult({
          goal: genTaskGoal,
          priority: genPriority,
          totalHours: `${hrs} hrs`,
          deliverable: genDeliverable,
          phases: [
            { name: '1. Scoping & Intelligence Gathering', hours: `${phase1Hours} hrs`, focus: 'Requirements, constraints, input assets, and acceptance criteria' },
            { name: '2. Core Construction & Architecture', hours: `${phase2Hours} hrs`, focus: 'Primary implementation, deep work sessions, and zero-distraction execution' },
            { name: '3. Verification & Quality Audit', hours: `${phase3Hours} hrs`, focus: 'Edge-case stress testing, compliance checks, and cross-platform verification' },
            { name: '4. Delivery & Operational Handoff', hours: `${phase4Hours} hrs`, focus: 'Distribution release, automated tracking, and milestone confirmation' }
          ],
          aiPrompt: `Act as my executive productivity partner. Help me execute '${genTaskGoal}' (${genPriority} Priority) with '${genDeliverable}' as the final artifact within ${hrs} allocated hours.`
        });
        break;
      }
      case 'medcare_calc': {
        const hr = parseInt(careHeartRate) || 80;
        const spo2 = parseInt(careSpO2) || 98;
        const temp = parseFloat(careTemp) || 98.6;

        let esiLevel = 'ESI Level 3 (Urgent - Two Resources Needed)';
        let urgencyColor = 'text-amber-400';
        let alertMessage = 'Vitals within moderate limits. Recommend clinical evaluation and monitoring.';

        if (spo2 < 90 || hr > 130 || hr < 45 || (careCluster.toLowerCase().includes('chest') && (spo2 < 94 || hr > 110))) {
          esiLevel = 'ESI Level 1 - Immediate Resuscitation / Emergent';
          urgencyColor = 'text-rose-400';
          alertMessage = 'CRITICAL ALERT: Vitals or presentation indicate severe physiological distress. Call 911 / activate emergency medical response immediately.';
        } else if (spo2 < 94 || hr > 115 || temp > 103.0) {
          esiLevel = 'ESI Level 2 - High Risk / Emergent Evaluation';
          urgencyColor = 'text-orange-400';
          alertMessage = 'HIGH RISK: Acute presentation requires rapid physician assessment within 15 minutes.';
        } else if (spo2 >= 95 && hr >= 60 && hr <= 100 && temp < 100.4) {
          esiLevel = 'ESI Level 4 - Less Urgent / Stable';
          urgencyColor = 'text-emerald-400';
          alertMessage = 'Vital signs stable. Standard urgent care or outpatient physician follow-up appropriate.';
        }

        setCareResult({
          esiLevel,
          urgencyColor,
          alertMessage,
          ageGroup: careAgeGroup,
          cluster: careCluster,
          vitalsSummary: `HR: ${hr} bpm | SpO2: ${spo2}% | Temp: ${temp}°F`,
          protocolStep: `1. Continuous pulse oximetry & vitals monitoring.\n2. Obtain 12-lead ECG if cardiac or chest involvement.\n3. Secure patent airway and intravenous access if indicated.\n4. Screen current prescription contraindications.`
        });
        break;
      }
      case 'nonprofit_calc': {
        const budget = parseFloat(npBudget) || 100000;
        const grant = parseFloat(npGrantReq) || 25000;
        const unitCost = parseFloat(npCostPerBeneficiary) || 100;
        const retention = parseFloat(npRetentionRate) || 60;

        const served = Math.floor(grant / Math.max(1, unitCost));
        const grantShare = ((grant / Math.max(1, budget + grant)) * 100).toFixed(1);
        const projectedLifetimeGain = (grant * (1 + (retention / 100) * 1.5)).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

        setNpResult({
          beneficiariesServed: served.toLocaleString(),
          grantSharePct: `${grantShare}% of expanded program budget`,
          projectedLifetimeValue: projectedLifetimeGain,
          complianceAudit: [
            'IRS Form 990 Public Support Test (min 33.3% public donations)',
            'Segregated Grant Escrow Accounting for Restricted Funds',
            'Independent Board of Directors Governance (min 3 unrelated voting members)',
            'Annual Impact Metric & Beneficiary Verification Log'
          ]
        });
        break;
      }
      case 'legal_calc': {
        const text = `MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Mutual Non-Disclosure Agreement is entered into by and between ${legalPartyA} and ${legalPartyB} under the laws of the State of ${legalState}.\n\n1. PURPOSE: The parties wish to explore business and development opportunities.\n2. CONFIDENTIALITY PERIOD: This Agreement and the duty of confidentiality shall remain binding for a period of ${legalTerm} years from the date of disclosure.\n3. GOVERNING LAW: Governed by the statutes of ${legalState}.\n4. INJUNCTIVE RELIEF: Both parties agree monetary damages may be inadequate.\n\n[Form generated via Don's Legal Series. AI review recommended before signing.]`;
        setLegalResult(text);
        break;
      }
      case 'medical_calc': {
        const sys = parseInt(medSystolic) || 120;
        const dia = parseInt(medDiastolic) || 80;
        let bpStatus = 'Normal (<120/80)';
        if (sys >= 140 || dia >= 90) bpStatus = 'Stage 2 Hypertension (Consult Doctor)';
        else if (sys >= 130 || dia >= 80) bpStatus = 'Stage 1 Hypertension';
        else if (sys >= 120 && dia < 80) bpStatus = 'Elevated';

        const hasInteraction = medMeds.toLowerCase().includes('lisinopril') && medMeds.toLowerCase().includes('ibuprofen');
        setMedResult({
          bpStatus,
          interactionWarning: hasInteraction 
            ? '⚠️ ALERT: NSAIDs (Ibuprofen) can reduce the antihypertensive effect of ACE inhibitors (Lisinopril) and increase renal toxicity risks.'
            : 'No direct major critical contraindication flagged in standard screening list.',
          triageLevel: (sys >= 160 || dia >= 100) ? 'High Priority' : 'Standard Routine'
        });
        break;
      }
      case 'injury_calc': {
        const bills = parseFloat(injMedBills) || 0;
        const wages = parseFloat(injLostWages) || 0;
        const prop = parseFloat(injPropDamage) || 0;
        const painMult = parseFloat(injPainLevel) || 2;
        const specials = bills + wages;
        const generalDamages = specials * painMult;
        const totalEstimated = specials + generalDamages + prop;
        setInjResult({
          specials: specials.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          generals: generalDamages.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          lowRange: (totalEstimated * 0.8).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          highRange: (totalEstimated * 1.35).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
          estimatedDemand: totalEstimated.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        });
        break;
      }
      case 'real_estate_calc': {
        const price = parseFloat(rePrice) || 400000;
        const downPct = parseFloat(reDown) || 20;
        const rate = (parseFloat(reRate) || 6.5) / 100 / 12;
        const rent = parseFloat(reRent) || 3000;
        const exp = parseFloat(reExp) || 800;

        const loan = price * (1 - downPct / 100);
        const n = 360;
        const monthlyMortgage = (loan * (rate * Math.pow(1 + rate, n))) / (Math.pow(1 + rate, n) - 1);
        const monthlyCashflow = rent - monthlyMortgage - exp;
        const annualNOI = (rent - exp) * 12;
        const capRate = (annualNOI / price) * 100;
        const initialCash = (price * (downPct / 100)) + 8000; // closing costs
        const cashOnCash = ((monthlyCashflow * 12) / initialCash) * 100;

        setReResult({
          mortgage: monthlyMortgage.toFixed(2),
          cashflow: monthlyCashflow.toFixed(2),
          capRate: capRate.toFixed(2),
          cashOnCash: cashOnCash.toFixed(2),
          noi: annualNOI.toFixed(2)
        });
        break;
      }
      case 'finance_calc': {
        const principal = parseFloat(finStart) || 0;
        const monthly = parseFloat(finMonthly) || 0;
        const r = (parseFloat(finRate) || 8) / 100 / 12;
        const months = (parseInt(finYears) || 20) * 12;

        let total = principal;
        for (let i = 0; i < months; i++) {
          total = (total + monthly) * (1 + r);
        }
        const totalContributed = principal + (monthly * months);
        const interestEarned = total - totalContributed;
        const annualSafeWithdrawal = total * 0.04;

        setFinResult({
          finalBalance: total.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          contributed: totalContributed.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          interest: interestEarned.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          annualIncome: annualSafeWithdrawal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        });
        break;
      }
      case 'tax_calc': {
        const gross = parseFloat(taxGross) || 0;
        const exp = parseFloat(taxExpenses) || 0;
        const miles = parseFloat(taxMiles) || 0;
        const mileageDeduction = miles * 0.67; // 2024-2026 IRS rate
        const netProfit = Math.max(0, gross - exp - mileageDeduction);
        const seTax = netProfit * 0.9235 * 0.153;
        const federalIncomeEst = netProfit * 0.18;
        const totalTaxEst = seTax + federalIncomeEst;
        const quarterlyPayment = totalTaxEst / 4;

        setTaxResult({
          mileageDeduction: mileageDeduction.toFixed(2),
          netProfit: netProfit.toFixed(2),
          seTax: seTax.toFixed(2),
          totalTaxEst: totalTaxEst.toFixed(2),
          quarterlyPayment: quarterlyPayment.toFixed(2)
        });
        break;
      }
      case 'dental_calc': {
        const procCosts: Record<string, number> = {
          clean: 180,
          fill: 250,
          crown: 1400,
          rootcanal: 1600,
          implant: 3800,
          extract: 350
        };
        const base = procCosts[dentProc] || 1000;
        const cov = parseFloat(dentCoverage) || 0;
        const insPays = base * (cov / 100);
        const outOfPocket = base - insPays;
        setDentResult({
          basePrice: `$${base}`,
          insPays: `$${insPays.toFixed(0)}`,
          outOfPocket: `$${outOfPocket.toFixed(0)}`
        });
        break;
      }
      case 'chiro_calc': {
        const hrs = parseInt(chiroHours) || 8;
        let score = 100 - (hrs * 6);
        if (chiroPain === 'severe') score -= 30;
        if (chiroPain === 'moderate') score -= 15;
        score = Math.max(20, Math.min(100, score));
        setChiroResult({
          score,
          risk: score > 75 ? 'Low Risk' : score > 50 ? 'Moderate Posture Strain' : 'High Spinal Ergonomic Stress',
          recommendation: score < 60 
            ? 'Recommend 45-minute standing desk intervals, lumbar cushion, and thoracic extension foam rolling.'
            : 'Ergonomic baseline is stable. Maintain dynamic movement breaks every 60 minutes.'
        });
        break;
      }
      case 'auto_calc': {
        const codes: Record<string, { desc: string, avgCost: string, urgency: string }> = {
          'P0420': { desc: 'Catalytic Converter System Efficiency Below Threshold (Bank 1)', avgCost: '$950 - $1,800', urgency: 'Moderate (Smog Fail)' },
          'P0300': { desc: 'Random/Multiple Cylinder Misfire Detected', avgCost: '$250 - $850 (Plugs/Coils)', urgency: 'High (Engine Damage Risk)' },
          'P0171': { desc: 'System Too Lean (Bank 1) - Vacuum Leak / MAF Sensor', avgCost: '$150 - $450', urgency: 'Moderate' },
          'P0442': { desc: 'Evaporative Emission Control System Small Leak (Gas Cap/Purge)', avgCost: '$75 - $250', urgency: 'Low' }
        };
        const match = codes[autoCode.toUpperCase()] || { desc: `Diagnostic code ${autoCode}`, avgCost: '$200 - $800', urgency: 'Standard Inspection' };
        const quoteNum = parseFloat(autoQuote) || 0;
        setAutoResult({
          desc: match.desc,
          avgBenchmark: match.avgCost,
          urgency: match.urgency,
          quoteFairness: quoteNum > 1500 ? 'Quote is on the higher tier. Seek second itemized opinion.' : 'Quote aligns with standard book time and OEM parts.'
        });
        break;
      }
      case 'roof_calc': {
        const sqft = parseFloat(roofSqFt) || 2000;
        const pitchMult: Record<string, number> = { '4/12': 1.054, '6/12': 1.118, '8/12': 1.202, '12/12': 1.414 };
        const mult = pitchMult[roofPitch] || 1.12;
        const actualSqFt = sqft * mult * 1.10; // 10% waste
        const squares = actualSqFt / 100;
        const perSquareCost = roofMaterial === 'metal' ? 850 : roofMaterial === 'architectural' ? 450 : 350;
        const totalEst = squares * perSquareCost;
        setRoofResult({
          squares: squares.toFixed(1),
          actualArea: Math.round(actualSqFt),
          costEst: totalEst.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        });
        break;
      }
      case 'hvac_calc': {
        const sqft = parseFloat(hvacSqFt) || 2000;
        const tons = (sqft / 500); // approx 500 sq ft per ton
        const btu = tons * 12000;
        const seer = parseFloat(hvacSeer) || 16;
        const baselineSeer = 10;
        const savingsPct = ((seer - baselineSeer) / seer) * 100;
        const estTenYearSavings = (savingsPct / 100) * 1200 * 10;
        setHvacResult({
          tons: tons.toFixed(1),
          btu: Math.round(btu).toLocaleString(),
          savingsPct: Math.round(savingsPct),
          tenYearSavings: estTenYearSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        });
        break;
      }
      case 'it_calc': {
        const portList = itPorts.split(',').map(p => p.trim());
        const openCritical = portList.filter(p => ['22', '3389', '23', '21', '445'].includes(p));
        const script = `# Hardened iptables firewall configuration\n# Generated by Don's IT Defense Suite\niptables -F\niptables -P INPUT DROP\niptables -P FORWARD DROP\niptables -P OUTPUT ACCEPT\niptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\niptables -A INPUT -i lo -j ACCEPT\n${portList.map(p => `iptables -A INPUT -p tcp --dport ${p} -m limit --limit 25/minute -j ACCEPT`).join('\n')}\n# Drop all invalid packets\niptables -A INPUT -m state --state INVALID -j DROP`;
        setItResult({
          riskCount: openCritical.length,
          criticalPorts: openCritical.join(', ') || 'None',
          firewallScript: script
        });
        break;
      }
      case 'insurance_calc': {
        const inc = parseFloat(insIncome) || 80000;
        const mort = parseFloat(insMortgage) || 250000;
        const kids = parseInt(insKids) || 0;
        const recommendedLife = (inc * 10) + mort + (kids * 100000);
        const estMonthly = (recommendedLife / 1000000) * 45; // benchmark term 20yr 35yo
        setInsResult({
          recommendedCoverage: recommendedLife.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
          estMonthlyPremium: estMonthly.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) + '/mo',
          incomeProtection: (inc * 10).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
        });
        break;
      }
      case 'security_calc': {
        const d = parseInt(secDoors) || 2;
        const w = parseInt(secWindows) || 8;
        const sq = parseInt(secSqFt) || 2000;
        const cameras = Math.max(3, Math.ceil(sq / 700) + d);
        const motionSensors = Math.ceil(sq / 600);
        const score = Math.min(95, 40 + (d * 10) + (w * 2));
        setSecResult({
          score: `${score}/100`,
          camerasNeeded: cameras,
          doorSensors: d,
          windowSensors: w,
          motionSensors
        });
        break;
      }
      case 'credit_calc': {
        const curScore = parseInt(credScore) || 600;
        const bal = parseFloat(credBalance) || 5000;
        const lim = parseFloat(credLimit) || 8000;
        const util = (bal / lim) * 100;
        const projectedScoreGain = util > 50 ? 45 : util > 30 ? 25 : 10;
        const letter = `CREDIT BUREAU DISPUTE NOTICE (SECTION 609 FCRA)\n\nTo: Equifax / Experian / TransUnion\nDate: ${new Date().toLocaleDateString()}\n\nRE: Formal Request for Physical Verification of Disputed Item\n\nUnder Section 609 of the Fair Credit Reporting Act (15 U.S.C. § 1681g), I am exercising my right to request complete physical verifiable documentation supporting the negative entries listed on my credit report.\n\nPlease provide original contract copies or remove the unsubstantiated entries within the statutory 30-day window.\n\nSincerely,\n[Consumer Name]\nSSN: XXX-XX-XXXX`;
        setCredResult({
          utilization: util.toFixed(1) + '%',
          projectedGain: `+${projectedScoreGain} to +${projectedScoreGain + 20} Points`,
          newEstScore: curScore + projectedScoreGain,
          letter
        });
        break;
      }
      case 'fitness_calc': {
        const w = parseFloat(fitWeight) || 200;
        const r = parseInt(fitReps) || 5;
        // Epley formula: 1RM = w * (1 + r/30)
        const oneRm = w * (1 + r / 30);
        setFitResult({
          oneRm: Math.round(oneRm),
          p90: Math.round(oneRm * 0.9),
          p80: Math.round(oneRm * 0.8),
          p70: Math.round(oneRm * 0.7),
          split: fitDays === '4' ? '4-Day Upper / Lower Split (Hypertrophy + Strength)' : fitDays === '3' ? '3-Day Full Body Compound Focus' : '5-Day Push / Pull / Legs / Upper / Lower'
        });
        break;
      }
      case 'nutrition_calc': {
        const wLbs = parseFloat(nutrWeight) || 175;
        const hIn = parseFloat(nutrHeight) || 70;
        const age = parseInt(nutrAge) || 30;
        // Mifflin-St Jeor
        const wKg = wLbs * 0.453592;
        const hCm = hIn * 2.54;
        const bmr = (10 * wKg) + (6.25 * hCm) - (5 * age) + 5;
        const tdee = bmr * 1.45; // moderate activity
        const targetCal = nutrGoal === 'cut' ? tdee - 500 : nutrGoal === 'bulk' ? tdee + 350 : tdee;
        const protein = wLbs * 1.0;
        const fat = (targetCal * 0.25) / 9;
        const carbs = (targetCal - (protein * 4) - (fat * 9)) / 4;
        setNutrResult({
          tdee: Math.round(tdee),
          targetCalories: Math.round(targetCal),
          protein: Math.round(protein) + 'g',
          carbs: Math.round(carbs) + 'g',
          fat: Math.round(fat) + 'g'
        });
        break;
      }
      case 'landscape_calc': {
        const l = parseFloat(landLength) || 30;
        const w = parseFloat(landWidth) || 15;
        const d = parseFloat(landDepth) || 3;
        const sqft = l * w;
        // Cu Yards = (sqft * depthInches / 12) / 27
        const cuYards = (sqft * (d / 12)) / 27;
        const bags = cuYards * 13.5; // 2 cu ft bags
        const costEst = cuYards * 45; // $45/yard delivered
        setLandResult({
          sqft,
          cuYards: cuYards.toFixed(2),
          bagsNeeded: Math.ceil(bags),
          costEst: costEst.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        });
        break;
      }
      case 'vet_calc': {
        const wt = parseFloat(vetWeight) || 40;
        const isDog = vetType === 'dog';
        const safeBenadryl = wt * 1.0; // 1mg per lb
        setVetResult({
          safeBenadryl: `${safeBenadryl.toFixed(0)} mg every 8 hours`,
          toxicWarning: vetItem.toLowerCase().includes('choco') || vetItem.toLowerCase().includes('xylitol') || vetItem.toLowerCase().includes('grape')
            ? '🚨 HIGH TOXICITY WARNING: Ingestion of chocolate, xylitol, grapes/raisins or lilies (cats) requires immediate emergency vet intervention.'
            : 'Monitor pet for vomiting, lethargy, or excessive salivation. Keep hydrated.'
        });
        break;
      }
      case 'immigration_calc': {
        const hasMasters = immDegree === 'masters' || immDegree === 'phd';
        const hasExp = parseInt(immExp) >= 5;
        const hasSponsor = immSponsor === 'yes';
        let topVisa = 'H-1B Specialty Occupation';
        if (hasMasters && hasExp) topVisa = 'EB-2 National Interest Waiver (NIW) or EB-2 PERM';
        if (immDegree === 'phd') topVisa = 'EB-1A / EB-1B Extraordinary Ability';
        else if (!hasSponsor && hasMasters) topVisa = 'EB-2 NIW Self-Petition';

        setImmResult({
          topVisa,
          checklist: ['Valid Passport (6+ mo)', 'Official Academic Transcripts & Degree Evaluation', 'Letters of Employment & Reference', 'Curriculum Vitae / Publications / Citations', 'Form I-140 / ETA-9089 Documentation']
        });
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
          <h4 className="text-xs font-black uppercase tracking-widest text-white">{toolName}</h4>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400 border border-slate-700">
          OFFLINE READY • ACCURATE
        </span>
      </div>

      {/* Tool Forms */}
      {toolType === 'general_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Task or Project Goal</label>
              <input value={genTaskGoal} onChange={e => setGenTaskGoal(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Key Deliverable Artifact</label>
              <input value={genDeliverable} onChange={e => setGenDeliverable(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Priority Level</label>
              <select value={genPriority} onChange={e => setGenPriority(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="Critical">Critical (Immediate Focus)</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Strategic">Strategic Long-term</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Time Allocated (Hours)</label>
              <input type="number" value={genHours} onChange={e => setGenHours(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Generate Structured Execution Roadmap
          </button>
          {genResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-xs font-bold">Total Budget: <span className="text-white">{genResult.totalHours}</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {genResult.priority} Priority
                </span>
              </div>
              <div className="space-y-2">
                {genResult.phases.map((ph: any, i: number) => (
                  <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-start gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-white">{ph.name}</div>
                      <div className="text-[10px] text-slate-400">{ph.focus}</div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{ph.hours}</span>
                  </div>
                ))}
              </div>
              {onSendToAI && (
                <button onClick={() => onSendToAI(genResult.aiPrompt)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 pt-1 block">
                  ⚡ Send Roadmap to Gemini AI for Deep Step-by-Step Execution →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {toolType === 'medcare_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Patient Demographic</label>
              <select value={careAgeGroup} onChange={e => setCareAgeGroup(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="Adult (18-64)">Adult (18-64)</option>
                <option value="Pediatric (0-12)">Pediatric (0-12)</option>
                <option value="Adolescent (13-17)">Adolescent (13-17)</option>
                <option value="Geriatric (65+)">Geriatric (65+)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Primary Clinical Cluster</label>
              <select value={careCluster} onChange={e => setCareCluster(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="Chest Discomfort & Dyspnea">Chest Discomfort & Dyspnea (Cardiac/Resp)</option>
                <option value="Acute Abdominal Pain">Acute Abdominal Pain</option>
                <option value="Neurological Deficit / Altered Mental">Neurological Deficit / Altered Mental Status</option>
                <option value="Acute Musculoskeletal Trauma">Acute Musculoskeletal Trauma</option>
                <option value="Severe Allergic Reaction">Severe Allergic Reaction / Anaphylaxis</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Heart Rate (BPM)</label>
              <input type="number" value={careHeartRate} onChange={e => setCareHeartRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Oxygen Saturation (%)</label>
              <input type="number" value={careSpO2} onChange={e => setCareSpO2(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Temp (°F)</label>
              <input type="number" step="0.1" value={careTemp} onChange={e => setCareTemp(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Analyze Emergency Acuity & Protocols
          </button>
          {careResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold text-xs">Emergency Acuity Index:</span>
                <span className={`font-black text-xs ${careResult.urgencyColor}`}>{careResult.esiLevel}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-semibold">
                {careResult.alertMessage}
              </div>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                {careResult.vitalsSummary}
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl whitespace-pre-wrap font-mono text-[10px] text-slate-300">
                {careResult.protocolStep}
              </div>
              {onSendToAI && (
                <button onClick={() => onSendToAI(`Provide emergency clinical triage differential and protocol guidance for:\nPatient: ${careAgeGroup}\nCluster: ${careCluster}\n${careResult.vitalsSummary}\nAcuity: ${careResult.esiLevel}`)} className="text-[10px] font-bold text-sky-400 hover:text-sky-300 pt-1 block">
                  ⚡ Send Case to Gemini Clinical AI for Differential Review →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {toolType === 'nonprofit_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Annual Org Budget ($)</label>
              <input type="number" value={npBudget} onChange={e => setNpBudget(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Requested Grant Size ($)</label>
              <input type="number" value={npGrantReq} onChange={e => setNpGrantReq(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Cost Per Beneficiary ($)</label>
              <input type="number" value={npCostPerBeneficiary} onChange={e => setNpCostPerBeneficiary(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Donor Retention Rate (%)</label>
              <input type="number" value={npRetentionRate} onChange={e => setNpRetentionRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Grant Allocation & 501(c)(3) Impact
          </button>
          {npResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Direct Beneficiaries Served</div>
                  <div className="text-base font-black text-emerald-400">{npResult.beneficiariesServed}</div>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Projected Multi-Year Value</div>
                  <div className="text-base font-black text-amber-400">{npResult.projectedLifetimeValue}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">501(c)(3) Statutory Compliance Checklist</div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {npResult.complianceAudit.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {onSendToAI && (
                <button onClick={() => onSendToAI(`Draft a persuasive 501(c)(3) grant narrative justifying a $${npGrantReq} grant to serve ${npResult.beneficiariesServed} beneficiaries at $${npCostPerBeneficiary} per person with ${npRetentionRate}% retention.`)} className="text-[10px] font-bold text-amber-400 hover:text-amber-300 pt-1 block">
                  ⚡ Send Parameters to Gemini AI to Draft Formal Grant Proposal →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tool Forms */}
      {toolType === 'legal_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Disclosing Party</label>
              <input value={legalPartyA} onChange={e => setLegalPartyA(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Receiving Party</label>
              <input value={legalPartyB} onChange={e => setLegalPartyB(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Governing State</label>
              <input value={legalState} onChange={e => setLegalState(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Generate NDA & Clause Draft
          </button>
          {legalResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-[11px] text-slate-300 whitespace-pre-wrap">
              <div>{legalResult}</div>
              {onSendToAI && (
                <button onClick={() => onSendToAI(`Please analyze this NDA draft for risks:\n\n${legalResult}`)} className="text-[10px] font-sans font-bold text-amber-400 hover:underline">
                  ⚡ Send to AI for Risk & Ambiguity Audit →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {toolType === 'medical_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Current Medications</label>
              <input value={medMeds} onChange={e => setMedMeds(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Symptoms Reported</label>
              <input value={medSymptoms} onChange={e => setMedSymptoms(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Systolic BP (mmHg)</label>
              <input type="number" value={medSystolic} onChange={e => setMedSystolic(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Diastolic BP (mmHg)</label>
              <input type="number" value={medDiastolic} onChange={e => setMedDiastolic(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Screen Interactions & Vitals
          </button>
          {medResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Blood Pressure Category:</span>
                <span className="font-black text-amber-400">{medResult.bpStatus}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                {medResult.interactionWarning}
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'injury_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Medical Bills ($)</label>
              <input type="number" value={injMedBills} onChange={e => setInjMedBills(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Lost Wages ($)</label>
              <input type="number" value={injLostWages} onChange={e => setInjLostWages(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Vehicle Damage ($)</label>
              <input type="number" value={injPropDamage} onChange={e => setInjPropDamage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Pain Severity (1-5x)</label>
              <select value={injPainLevel} onChange={e => setInjPainLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="1.5">1.5x (Minor soft tissue)</option>
                <option value="2.5">2.5x (Moderate whiplash)</option>
                <option value="3.5">3.5x (Severe / injections)</option>
                <option value="5.0">5.0x (Surgical / permanent)</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Settlement Range
          </button>
          {injResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Special Damages</div>
                <div className="text-sm font-black text-white">{injResult.specials}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Pain & Suffering</div>
                <div className="text-sm font-black text-amber-400">{injResult.generals}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Estimated Demand</div>
                <div className="text-sm font-black text-emerald-400">{injResult.estimatedDemand}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Settlement Bracket</div>
                <div className="text-xs font-mono text-slate-300">{injResult.lowRange} - {injResult.highRange}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'real_estate_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Price ($)</label>
              <input type="number" value={rePrice} onChange={e => setRePrice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Down Pay %</label>
              <input type="number" value={reDown} onChange={e => setReDown(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Rate %</label>
              <input type="number" step="0.1" value={reRate} onChange={e => setReRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monthly Rent ($)</label>
              <input type="number" value={reRent} onChange={e => setReRent(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Expenses/mo ($)</label>
              <input type="number" value={reExp} onChange={e => setReExp(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate ROI & Cap Rate
          </button>
          {reResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Monthly Mortgage</div>
                <div className="text-sm font-black text-white">${reResult.mortgage}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Net Cash Flow</div>
                <div className={`text-sm font-black ${parseFloat(reResult.cashflow) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${reResult.cashflow}/mo</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cap Rate</div>
                <div className="text-sm font-black text-amber-400">{reResult.capRate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cash-on-Cash ROI</div>
                <div className="text-sm font-black text-indigo-400">{reResult.cashOnCash}%</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'finance_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Starting Balance ($)</label>
              <input type="number" value={finStart} onChange={e => setFinStart(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monthly Deposit ($)</label>
              <input type="number" value={finMonthly} onChange={e => setFinMonthly(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Annual Return %</label>
              <input type="number" step="0.5" value={finRate} onChange={e => setFinRate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Timeline (Years)</label>
              <input type="number" value={finYears} onChange={e => setFinYears(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Simulate Compound Wealth
          </button>
          {finResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Portfolio</div>
                <div className="text-base font-black text-emerald-400">{finResult.finalBalance}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Contributed</div>
                <div className="text-sm font-bold text-white">{finResult.contributed}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Compound Interest</div>
                <div className="text-sm font-black text-amber-400">+{finResult.interest}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">4% Rule Annual Pay</div>
                <div className="text-sm font-black text-indigo-400">{finResult.annualIncome}/yr</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'tax_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">1099 Gross Revenue ($)</label>
              <input type="number" value={taxGross} onChange={e => setTaxGross(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Business Expenses ($)</label>
              <input type="number" value={taxExpenses} onChange={e => setTaxExpenses(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Business Miles Driven</label>
              <input type="number" value={taxMiles} onChange={e => setTaxMiles(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Audit Deductions & Quarterly Tax
          </button>
          {taxResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Mileage Write-off</div>
                <div className="text-sm font-black text-white">${taxResult.mileageDeduction}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Net Taxable Profit</div>
                <div className="text-sm font-black text-amber-400">${taxResult.netProfit}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Self-Employment Tax</div>
                <div className="text-sm font-black text-rose-400">${taxResult.seTax}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Est. Quarterly Payment</div>
                <div className="text-sm font-black text-emerald-400">${taxResult.quarterlyPayment}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'dental_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Procedure</label>
              <select value={dentProc} onChange={e => setDentProc(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="clean">Cleaning & Exam ($180)</option>
                <option value="fill">Composite Filling ($250)</option>
                <option value="crown">Porcelain Crown ($1,400)</option>
                <option value="rootcanal">Molar Root Canal ($1,600)</option>
                <option value="implant">Single Dental Implant ($3,800)</option>
                <option value="extract">Surgical Extraction ($350)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Dental Insurance Coverage %</label>
              <input type="number" value={dentCoverage} onChange={e => setDentCoverage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Out-of-Pocket Estimate
          </button>
          {dentResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Procedure</div>
                <div className="text-sm font-bold text-white">{dentResult.basePrice}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Insurance Paid</div>
                <div className="text-sm font-bold text-emerald-400">{dentResult.insPays}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Your Out-of-Pocket</div>
                <div className="text-base font-black text-amber-400">{dentResult.outOfPocket}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'chiro_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Daily Sitting Desk Hours</label>
              <input type="number" value={chiroHours} onChange={e => setChiroHours(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Current Neck/Spine Discomfort</label>
              <select value={chiroPain} onChange={e => setChiroPain(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="none">None / Mild</option>
                <option value="moderate">Moderate Stiffness</option>
                <option value="severe">Severe / Shooting Nerve Pain</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Evaluate Posture & Spine Risk
          </button>
          {chiroResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ergonomic Score:</span>
                <span className="text-base font-black text-amber-400">{chiroResult.score}/100 ({chiroResult.risk})</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">{chiroResult.recommendation}</p>
            </div>
          )}
        </div>
      )}

      {toolType === 'auto_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">OBD-II Fault Code</label>
              <input value={autoCode} onChange={e => setAutoCode(e.target.value)} placeholder="e.g. P0420, P0300" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white uppercase font-mono" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Mechanic Quote ($)</label>
              <input type="number" value={autoQuote} onChange={e => setAutoQuote(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Decode OBD-II & Audit Quote
          </button>
          {autoResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="font-bold text-white">{autoResult.desc}</div>
              <div className="flex justify-between text-slate-400">
                <span>Fair Repair Benchmark:</span>
                <span className="font-mono text-emerald-400">{autoResult.avgBenchmark}</span>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                {autoResult.quoteFairness}
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'roof_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Home Sq Ft</label>
              <input type="number" value={roofSqFt} onChange={e => setRoofSqFt(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Roof Pitch</label>
              <select value={roofPitch} onChange={e => setRoofPitch(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="4/12">4/12 Low Pitch</option>
                <option value="6/12">6/12 Standard Pitch</option>
                <option value="8/12">8/12 Steep Pitch</option>
                <option value="12/12">12/12 Very Steep</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Material</label>
              <select value={roofMaterial} onChange={e => setRoofMaterial(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="3tab">3-Tab Asphalt ($350/sq)</option>
                <option value="architectural">Architectural Shingle ($450/sq)</option>
                <option value="metal">Standing Seam Metal ($850/sq)</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Roofing Squares & Cost
          </button>
          {roofResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Squares</div>
                <div className="text-sm font-black text-amber-400">{roofResult.squares} Squares</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Actual Surface Area</div>
                <div className="text-sm font-bold text-white">{roofResult.actualArea} sq ft</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Est. Total Job Cost</div>
                <div className="text-base font-black text-emerald-400">{roofResult.costEst}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'hvac_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Home Sq Ft</label>
              <input type="number" value={hvacSqFt} onChange={e => setHvacSqFt(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Climate Zone</label>
              <select value={hvacZone} onChange={e => setHvacZone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="cool">Northern (Cool)</option>
                <option value="moderate">Central (Moderate)</option>
                <option value="hot">Southern (Hot/Humid)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">New System SEER2</label>
              <input type="number" value={hvacSeer} onChange={e => setHvacSeer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Sizing & Energy Savings
          </button>
          {hvacResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Recommended Size</div>
                <div className="text-sm font-black text-indigo-400">{hvacResult.tons} Tons ({hvacResult.btu} BTU)</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Efficiency Boost</div>
                <div className="text-sm font-bold text-emerald-400">+{hvacResult.savingsPct}% Savings</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">10-Yr Electric Savings</div>
                <div className="text-base font-black text-amber-400">{hvacResult.tenYearSavings}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'it_calc' && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Active Server Ports</label>
            <input value={itPorts} onChange={e => setItPorts(e.target.value)} placeholder="22, 80, 443, 3389" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" />
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Generate Hardened Firewall Rules
          </button>
          {itResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-[11px]">
              <div className="flex justify-between text-xs font-sans">
                <span className="text-slate-400">Critical Open Ports Flagged:</span>
                <span className="text-rose-400 font-black">{itResult.criticalPorts}</span>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                {itResult.firewallScript}
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'insurance_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Annual Income ($)</label>
              <input type="number" value={insIncome} onChange={e => setInsIncome(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Mortgage Debt ($)</label>
              <input type="number" value={insMortgage} onChange={e => setInsMortgage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Children / Dependents</label>
              <input type="number" value={insKids} onChange={e => setInsKids(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Life Coverage Needs
          </button>
          {insResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Recommended Policy</div>
                <div className="text-base font-black text-emerald-400">{insResult.recommendedCoverage}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">10-Yr Income Replacement</div>
                <div className="text-sm font-bold text-white">{insResult.incomeProtection}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Est. 20-Yr Term Cost</div>
                <div className="text-sm font-black text-amber-400">{insResult.estMonthlyPremium}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'security_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Exterior Doors</label>
              <input type="number" value={secDoors} onChange={e => setSecDoors(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Ground Windows</label>
              <input type="number" value={secWindows} onChange={e => setSecWindows(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Square Feet</label>
              <input type="number" value={secSqFt} onChange={e => setSecSqFt(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Audit Perimeter & Camera Layout
          </button>
          {secResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Security Score</div>
                <div className="text-base font-black text-emerald-400">{secResult.score}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Recommended Cameras</div>
                <div className="text-sm font-black text-amber-400">{secResult.camerasNeeded} HD PoE</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Motion Detectors</div>
                <div className="text-sm font-bold text-white">{secResult.motionSensors} Units</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'credit_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Current FICO Score</label>
              <input type="number" value={credScore} onChange={e => setCredScore(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Credit Card Balance ($)</label>
              <input type="number" value={credBalance} onChange={e => setCredBalance(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Credit Limit ($)</label>
              <input type="number" value={credLimit} onChange={e => setCredLimit(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Simulate FICO & Draft 609 Letter
          </button>
          {credResult && (
            <div className="mt-4 space-y-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Current Utilization</div>
                  <div className="text-sm font-bold text-rose-400">{credResult.utilization}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Projected Score Gain</div>
                  <div className="text-sm font-black text-emerald-400">{credResult.projectedGain}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Target FICO</div>
                  <div className="text-base font-black text-amber-400">{credResult.newEstScore}</div>
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[10px] text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {credResult.letter}
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'fitness_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Weight Lifted (lbs)</label>
              <input type="number" value={fitWeight} onChange={e => setFitWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Reps Completed</label>
              <input type="number" value={fitReps} onChange={e => setFitReps(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Weekly Training Days</label>
              <select value={fitDays} onChange={e => setFitDays(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="3">3 Days (Full Body)</option>
                <option value="4">4 Days (Upper / Lower)</option>
                <option value="5">5 Days (PPL / Upper Lower)</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate 1RM & Training Loads
          </button>
          {fitResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">1 Rep Max (1RM)</div>
                <div className="text-base font-black text-amber-400">{fitResult.oneRm} lbs</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">90% Load (Heavy)</div>
                <div className="text-sm font-bold text-white">{fitResult.p90} lbs</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">80% Load (Hypertrophy)</div>
                <div className="text-sm font-bold text-emerald-400">{fitResult.p80} lbs</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">70% Load (Speed)</div>
                <div className="text-sm font-bold text-indigo-400">{fitResult.p70} lbs</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'nutrition_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Weight (lbs)</label>
              <input type="number" value={nutrWeight} onChange={e => setNutrWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Height (inches)</label>
              <input type="number" value={nutrHeight} onChange={e => setNutrHeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Age</label>
              <input type="number" value={nutrAge} onChange={e => setNutrAge(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Goal</label>
              <select value={nutrGoal} onChange={e => setNutrGoal(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="cut">Fat Loss (-500 cal)</option>
                <option value="maintain">Maintain Weight</option>
                <option value="bulk">Lean Muscle (+350 cal)</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate TDEE & Macro Targets
          </button>
          {nutrResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Daily Target</div>
                <div className="text-base font-black text-amber-400">{nutrResult.targetCalories} kcal</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Protein Target</div>
                <div className="text-sm font-black text-emerald-400">{nutrResult.protein}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Carbohydrates</div>
                <div className="text-sm font-bold text-white">{nutrResult.carbs}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Healthy Fats</div>
                <div className="text-sm font-bold text-indigo-400">{nutrResult.fat}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'landscape_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Bed Length (ft)</label>
              <input type="number" value={landLength} onChange={e => setLandLength(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Bed Width (ft)</label>
              <input type="number" value={landWidth} onChange={e => setLandWidth(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Depth (inches)</label>
              <input type="number" value={landDepth} onChange={e => setLandDepth(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Calculate Mulch & Soil Volume
          </button>
          {landResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-around text-center">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Area</div>
                <div className="text-sm font-bold text-white">{landResult.sqft} sq ft</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Cubic Yards</div>
                <div className="text-base font-black text-amber-400">{landResult.cuYards} Yards</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">2 Cu.Ft Bags</div>
                <div className="text-sm font-black text-emerald-400">{landResult.bagsNeeded} Bags</div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolType === 'vet_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Pet Type</label>
              <select value={vetType} onChange={e => setVetType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="dog">Canine (Dog)</option>
                <option value="cat">Feline (Cat)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Weight (lbs)</label>
              <input type="number" value={vetWeight} onChange={e => setVetWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Substance / Triage</label>
              <input value={vetItem} onChange={e => setVetItem(e.target.value)} placeholder="e.g. Chocolate, Benadryl" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Check Dosage & Toxicity Safety
          </button>
          {vetResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Safe Benadryl Weight Baseline:</span>
                <span className="font-mono text-emerald-400">{vetResult.safeBenadryl}</span>
              </div>
              <p className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-amber-300 leading-relaxed text-xs">
                {vetResult.toxicWarning}
              </p>
            </div>
          )}
        </div>
      )}

      {toolType === 'immigration_calc' && (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Highest Degree</label>
              <select value={immDegree} onChange={e => setImmDegree(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree (STEM/Non-STEM)</option>
                <option value="phd">Ph.D. / Doctorate</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Years Work Experience</label>
              <input type="number" value={immExp} onChange={e => setImmExp(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">US Employer Sponsor?</label>
              <select value={immSponsor} onChange={e => setImmSponsor(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                <option value="yes">Yes (Employer Petition)</option>
                <option value="no">No (Self-Petition NIW)</option>
              </select>
            </div>
          </div>
          <button onClick={calculateTool} className="w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[11px] text-white transition-all hover:opacity-90" style={{ backgroundColor: primaryColor }}>
            Evaluate Visa Categories & Checklist
          </button>
          {immResult && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Top Recommended Pathway:</span>
                <span className="text-sm font-black text-emerald-400">{immResult.topVisa}</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Core Document Checklist</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                  {immResult.checklist.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
