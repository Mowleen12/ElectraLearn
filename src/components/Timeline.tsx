import { useState } from 'react';
import { UserPlus, Megaphone, Vote, BarChart3, ChevronRight, ChevronLeft, Map, FileCheck, ShieldCheck } from 'lucide-react';
import './Timeline.css';

const steps = [
  {
    id: 1,
    title: 'Voter Registration & Electoral Roll',
    icon: UserPlus,
    color: '#3b82f6',
    description: 'The foundation of the democratic process is the Electoral Roll. Every Indian citizen aged 18 or above as of the qualifying date can register as a voter in the constituency where they ordinarily reside.',
    details: 'Voter registration is a continuous process managed by the Election Commission. Citizens can register online via the NVSP portal (voters.eci.gov.in) using Form 6, or by visiting their local Booth Level Officer (BLO). Upon successful registration, the ECI issues an Electoral Photo Identity Card (EPIC). The process also includes regular purification of the rolls—removing deceased voters (Form 7) and correcting details (Form 8). Aadhaar linking is currently voluntary to weed out duplicate entries.'
  },
  {
    id: 2,
    title: 'Model Code of Conduct (MCC)',
    icon: ShieldCheck,
    color: '#a855f7',
    description: 'The moment the Election Commission of India announces the election schedule, the Model Code of Conduct (MCC) comes into immediate effect, binding the government, political parties, and all candidates.',
    details: 'The MCC is a unique set of guidelines designed to ensure a level playing field and free, fair elections. It prevents the ruling party from misusing official government machinery, state transport, or public funds for campaigning. It strictly prohibits hate speech, appeals to caste or communal feelings, and the announcement of new financial grants or infrastructure projects that could unduly influence voters. Any violation can lead to strict censure or candidate disqualification by the ECI.'
  },
  {
    id: 3,
    title: 'Nomination & Campaigning',
    icon: Megaphone,
    color: '#a855f7',
    description: 'Candidates must officially enter the race by filing their nomination papers with the Returning Officer (RO). This initiates the vibrant and highly regulated campaign period.',
    details: 'Along with their nomination, candidates must file an affidavit (Form 26) declaring their criminal antecedents, assets, liabilities, and educational qualifications, which is made public for voter awareness. After a scrutiny period and withdrawal deadline, the final list of contestants is published. The campaigning period is characterized by massive rallies, door-to-door canvassing, and digital outreach. It legally ends 48 hours before the conclusion of polling (the "silent period"), allowing voters a calm environment to make their decision.'
  },
  {
    id: 4,
    title: 'Polling Day (Matdan)',
    icon: Vote,
    color: '#f97316',
    description: 'Millions of citizens exercise their democratic right on Polling Day. Due to the country’s vast size and security needs, general elections are typically conducted in multiple phases.',
    details: 'Voters arrive at their designated polling booths and present their EPIC or an alternative approved photo ID. To prevent double voting, an indelible ink mark is applied to the voter\'s left index finger. The vote is cast using an Electronic Voting Machine (EVM). Alongside the EVM sits the VVPAT (Voter Verifiable Paper Audit Trail) machine, which prints a slip visible for 7 seconds, allowing the voter to verify that their vote was recorded correctly before it drops into a sealed box.'
  },
  {
    id: 5,
    title: 'Counting of Votes & Results',
    icon: BarChart3,
    color: '#22c55e',
    description: 'On the scheduled counting day, the sealed EVMs are opened under heavy security and the strict supervision of the Returning Officer and candidate-appointed Counting Agents.',
    details: 'The counting process is highly transparent. Votes are tallied round by round for each constituency. In case of disputes, VVPAT slips from randomly selected polling stations are physically counted to verify the EVM electronic tally. The candidate securing the highest number of valid votes in a constituency is declared the winner (First-Past-The-Post system). In the Lok Sabha (lower house of Parliament), a political party or pre-poll alliance must secure at least 272 out of 543 seats to achieve a simple majority.'
  },
  {
    id: 6,
    title: 'Government Formation',
    icon: FileCheck,
    color: '#22c55e',
    description: 'The final phase involves translating the electoral mandate into a functioning government. The President of India plays a crucial constitutional role in this process.',
    details: 'Once the final results are gazetted by the ECI, the President invites the leader of the party or coalition that has secured a majority in the Lok Sabha to form the government. The leader is officially sworn in as the Prime Minister. Following this, the Prime Minister selects members of Parliament to serve in the Council of Ministers (the Cabinet). The new government then takes charge, outlines its legislative agenda, and the newly elected Parliament convenes for its first session.'
  }
];

export function Timeline() {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="card p-6 md:p-8 animate-fade-in relative z-10">
      <div className="timeline-section-header">
        <span className="timeline-section-badge">
          <Map size={12} /> Indian Election Journey
        </span>
        <h2 className="timeline-section-title">How Indian Elections Work</h2>
        <p className="timeline-section-subtitle">Step through each phase of India's General (Lok Sabha) Election — from registration to government formation.</p>
      </div>

      <div className="timeline-progress-container mb-8">
        <div className="timeline-progress-bar">
          <div
            className="timeline-progress-fill"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="timeline-nodes">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive    = index === activeStep;
            const isCompleted = index < activeStep;
            return (
              <button
                key={step.id}
                className={`timeline-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setActiveStep(index)}
                aria-label={`Go to step: ${step.title}`}
              >
                <div className="node-icon-wrapper">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <span className="node-label md:block">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="timeline-content-card card overflow-hidden border-2" style={{ borderColor: steps[activeStep].color }}>
        <div className="p-8 md:p-12 w-full flex flex-col justify-center bg-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${steps[activeStep].color}, transparent)` }}></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="step-badge shadow-md" style={{ backgroundColor: steps[activeStep].color }}>{activeStep + 1}</div>
            <h3 className="step-title text-2xl md:text-3xl font-extrabold" style={{ color: steps[activeStep].color }}>{steps[activeStep].title}</h3>
          </div>
          <p className="step-description mb-8 text-xl font-medium text-gray-800 leading-relaxed border-l-4 pl-6 italic" style={{ borderLeftColor: steps[activeStep].color }}>{steps[activeStep].description}</p>
          <div className="details-box bg-gray-50 border-t-4 p-6 md:p-8 rounded-xl shadow-sm" style={{ borderTopColor: steps[activeStep].color }}>
            <p className="details-label flex items-center gap-2 mb-3 font-bold text-gray-700 text-sm uppercase tracking-wider">💡 Comprehensive Details</p>
            <p className="details-text text-gray-700 leading-loose text-lg">{steps[activeStep].details}</p>
          </div>
        </div>
      </div>

      <div className="timeline-controls mt-6">
        <button className="btn btn-outline" onClick={prevStep} disabled={activeStep === 0}>
          <ChevronLeft size={18} /> Previous
        </button>
        <button className="btn btn-primary" onClick={nextStep} disabled={activeStep === steps.length - 1} style={{ backgroundColor: steps[activeStep].color }}>
          Next Phase <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
