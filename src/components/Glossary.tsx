import { useState } from 'react';
import { Search, BookA, ChevronRight, ChevronLeft } from 'lucide-react';
import './Glossary.css';

type Term = { term: string; definition: string; article: string; image: string };

const terms: Term[] = [
  {
    term: "ECI — Election Commission of India",
    definition: "An autonomous constitutional authority (Article 324) responsible for administering and supervising all elections to Parliament, State Legislatures, and the offices of President and Vice President of India.",
    article: "The Election Commission of India (ECI) was established in 1950. It is a permanent constitutional body tasked with the monumental responsibility of conducting free and fair elections in the world's largest democracy. It oversees the entire election process for the Lok Sabha, Rajya Sabha, State Legislative Assemblies, and the offices of the President and Vice President. The ECI is completely independent of the executive to ensure impartiality.",
    image: "/src/assets/eci_headquarters.png"
  },
  {
    term: "EVM (Electronic Voting Machine)",
    definition: "A battery-operated, tamper-proof device used to record votes in Indian elections. Manufactured by BEL and ECIL, EVMs replaced paper ballots progressively from 1999 onwards.",
    article: "First conceived in 1977 and progressively introduced, the EVM revolutionized Indian elections by virtually eliminating booth capturing and invalid votes. An EVM consists of a Control Unit and a Balloting Unit connected by a cable. They are standalone machines, not connected to the internet, making them highly secure against remote hacking. They run on a 6-volt alkaline battery, ensuring they work even in areas without electricity.",
    image: "/src/assets/evm_vvpat.png"
  },
  {
    term: "VVPAT (Voter Verifiable Paper Audit Trail)",
    definition: "A device attached to EVMs that generates a printed paper slip showing the party symbol and candidate name voted for. The slip is visible to the voter for 7 seconds before falling into a sealed box.",
    article: "Introduced to enhance transparency and build voter confidence, the VVPAT machine sits alongside the EVM. When a voter presses a button on the EVM, the VVPAT prints a slip containing the serial number, name, and symbol of the chosen candidate. This slip is visible through a transparent window for exactly 7 seconds before it drops into a sealed drop box. In case of a dispute, these slips can be counted.",
    image: "/src/assets/evm_vvpat.png"
  },
  {
    term: "EPIC (Voter ID Card)",
    definition: "Electoral Photo Identity Card issued by ECI to registered voters. It serves as the primary proof of identity at polling booths, though 12 alternative photo IDs are also accepted.",
    article: "The EPIC was introduced in 1993 to prevent electoral fraud and impersonation. It acts as the definitive proof of your status as a registered voter. Modern EPICs are printed on PVC cards with security features like a hologram and barcode. While possessing an EPIC is highly recommended, citizens can still vote using 12 other ECI-approved photo identity documents provided their name is on the electoral roll.",
    image: "/src/assets/voter_id_card.png"
  },
  {
    term: "Lok Sabha",
    definition: "The lower house of India's Parliament, also called the House of the People. It consists of 543 directly elected members. A party needs 272+ seats for a simple majority to form the Central Government.",
    article: "The Lok Sabha, or the House of the People, is the focal point of the Indian democratic system. Members of Parliament (MPs) are directly elected by the citizens of India under the universal adult suffrage system. The country is divided into 543 parliamentary constituencies. The political party or coalition that commands a majority (at least 272 seats) gets to form the central government and choose the Prime Minister.",
    image: "/src/assets/indian_parliament.png"
  },
  {
    term: "Rajya Sabha",
    definition: "The upper house of Parliament, or the Council of States. It has a maximum of 250 members, of which 238 are elected by State Legislative Assemblies and 12 are nominated by the President.",
    article: "The Rajya Sabha, or the Council of States, represents the states and union territories of India at the central level. Unlike the Lok Sabha, its members are indirectly elected by the elected members of the State Legislative Assemblies. It acts as a revising chamber, providing a second look at legislation passed by the Lok Sabha, and ensures the federal structure of the country is respected.",
    image: "/src/assets/indian_parliament.png"
  },
  {
    term: "Vidhan Sabha",
    definition: "The State Legislative Assembly, the lower house of a state legislature. Members of the Vidhan Sabha (MLAs) are directly elected by voters in their respective constituencies.",
    article: "The Vidhan Sabha is the equivalent of the Lok Sabha at the state level. Members of the Legislative Assembly (MLAs) are directly elected by the voters of their respective assembly constituencies. The majority party in the Vidhan Sabha forms the state government, led by the Chief Minister. State elections dictate policies on crucial localized issues like police, public health, and agriculture.",
    image: "/src/assets/indian_parliament.png"
  },
  {
    term: "Model Code of Conduct (MCC)",
    definition: "A set of guidelines issued by ECI, effective from the date of election announcement until results are declared. It governs the conduct of political parties, candidates, and the government to ensure free and fair elections.",
    article: "The Model Code of Conduct is a unique innovation of the Indian electoral system. It is not a law, but a consensus-driven code of ethics agreed upon by all political parties. It ensures a level playing field by preventing the ruling party from misusing official machinery for campaigning. The MCC strictly prohibits hate speech, communal appeals, and the announcement of new financial grants or projects that could influence voters.",
    image: "/src/assets/mcc_enforcement.png"
  },
  {
    term: "Constituency",
    definition: "A geographical unit whose voters elect one representative (MP or MLA). India has 543 Lok Sabha constituencies and over 4,000 Vidhan Sabha constituencies, delimited by the Delimitation Commission.",
    article: "A constituency is the bedrock of the representative democratic system. India's vast geography and population are divided into distinct territorial areas called constituencies. The goal is to ensure that each constituency has roughly the same population, meaning every vote carries equal weight. Constituencies are categorized as General, SC (Scheduled Castes), or ST (Scheduled Tribes) based on reservation policies.",
    image: "/src/assets/legal_document.png"
  },
  {
    term: "Returning Officer (RO)",
    definition: "An officer appointed by ECI for each constituency, responsible for overseeing the entire election process — from accepting nominations to declaring results.",
    article: "The Returning Officer is the statutory authority conducting the election in a specific constituency. Usually a District Magistrate or a senior civil servant, the RO is the ultimate local authority on election day. They handle candidate nominations, scrutinize them, allocate symbols, oversee the polling stations, supervise the vote counting process, and finally, officially declare the winning candidate.",
    image: "/src/assets/legal_document.png"
  },
  {
    term: "NOTA (None Of The Above)",
    definition: "An option on the EVM ballot, introduced after a 2013 Supreme Court order, allowing voters to reject all candidates without abstaining. NOTA votes are counted but the candidate with the most votes still wins.",
    article: "Introduced after a landmark Supreme Court judgment, NOTA gives voters the power to express their dissatisfaction with all the candidates contesting in their constituency. While NOTA does not currently have the 'right to reject' (meaning even if NOTA gets the highest votes, the candidate with the second-highest votes is declared the winner), it serves as a powerful democratic tool to register a negative opinion.",
    image: "/src/assets/voting_hand.png"
  },
  {
    term: "Indelible Ink",
    definition: "A purple-black ink applied to a voter's left index finger at polling booths to prevent double voting. Manufactured at the Mysore Paints and Varnish Limited factory, it cannot be removed for several weeks.",
    article: "The indelible ink is a hallmark of the Indian election process, preventing proxy voting and double voting. The formula is a closely guarded secret, containing silver nitrate which reacts with the skin and UV light to form a mark that cannot be washed off with soap, liquids, or chemicals for weeks. It is proudly manufactured solely by Mysore Paints and Varnish Limited.",
    image: "/src/assets/voting_hand.png"
  },
  {
    term: "BLO (Booth Level Officer)",
    definition: "A government official assigned to each polling booth to maintain the electoral roll, assist in voter registration (Form 6), deletion of deceased voters, and address voters' grievances locally.",
    article: "The Booth Level Officer (BLO) is the grassroots representative of the Election Commission. They are usually local government employees like teachers or Anganwadi workers who are deeply familiar with their specific polling area. They are the first point of contact for citizens wanting to add, delete, or correct their names on the electoral roll, ensuring the voter list is accurate and up-to-date.",
    image: "/src/assets/registration.png"
  },
  {
    term: "Delimitation Commission",
    definition: "A statutory body constituted by the Government of India to redraw the boundaries of Lok Sabha and Vidhan Sabha constituencies based on census data, ensuring roughly equal population per seat.",
    article: "As populations grow and migrate, constituency sizes become imbalanced. The Delimitation Commission is tasked with redrawing the boundaries of Lok Sabha and Assembly constituencies to reflect recent census data. This ensures the democratic principle of 'One Person, One Vote, One Value' is maintained. Their orders have the force of law and cannot be challenged in any court.",
    image: "/src/assets/legal_document.png"
  },
  {
    term: "Affidavit (Form 26)",
    definition: "A mandatory self-declaration filed by every election candidate disclosing criminal records, assets, liabilities, and educational qualifications. False declarations can lead to disqualification.",
    article: "In a bid to clean up politics and provide voters with necessary information, the Supreme Court mandated that every candidate must file Form 26 along with their nomination papers. This affidavit publicly discloses the candidate's criminal antecedents (if any), assets, liabilities, and educational background. This allows citizens to make an informed choice before casting their vote.",
    image: "/src/assets/legal_document.png"
  },
  {
    term: "Representation of the People Act, 1951",
    definition: "The key legislation governing the conduct of elections in India, covering voter registration, election schedules, conduct of polls, election offences, disputes, and disqualification of candidates.",
    article: "The RPA 1951 is the primary legal framework that details exactly how elections are to be conducted. It covers the qualifications and disqualifications for membership of Parliament and state legislatures, the administrative machinery for conducting elections, the registration of political parties, and the definition of corrupt practices and electoral offences. It is the rulebook of Indian democracy.",
    image: "/src/assets/legal_document.png"
  }
].sort((a, b) => a.term.localeCompare(b.term));

export function Glossary() {
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const filtered = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.definition.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedTerm) {
    return (
      <div className="article-view animate-fade-in bg-white rounded-2xl shadow-xl overflow-hidden mb-8 relative z-20">
        <div className="article-body p-8 md:p-16 max-w-3xl mx-auto bg-white relative">
          <div className="text-center mb-10">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Glossary Article</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">{selectedTerm.term}</h1>
            <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed italic border-y border-gray-100 py-6">
              {selectedTerm.definition}
            </p>
          </div>
          
          <div className="text-gray-800 leading-loose text-lg md:text-xl text-justify">
            {selectedTerm.article.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-6">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-16 pt-10 border-t border-gray-200 flex justify-center">
            <button 
              className="btn flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md transition-all font-semibold"
              onClick={() => setSelectedTerm(null)}
            >
              <ChevronLeft size={18} /> Return
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 md:p-8 animate-fade-in relative z-10">
      <div className="glossary-header">
        <div>
          <span className="glossary-section-badge">
            <BookA size={12} /> Dictionary
          </span>
          <h2 className="glossary-section-title">Indian Election Glossary</h2>
          <p className="glossary-section-subtitle">{terms.length} key terms to understand India's electoral process. Click any term to read its full article.</p>
        </div>

        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input
            className="search-input"
            type="text"
            placeholder="Search terms…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search glossary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glossary-empty">
          <p>No terms found for "<strong>{search}</strong>".</p>
        </div>
      ) : (
        <div className="glossary-grid">
          {filtered.map((t, idx) => (
            <div key={idx} className="glossary-term-card interactive-card" onClick={() => setSelectedTerm(t)}>
              <div className="flex justify-between items-start">
                <h3 className="term-title">{t.term}</h3>
                <ChevronRight size={18} className="text-blue-500 opacity-50 ml-2 mt-1 shrink-0" />
              </div>
              <p className="term-definition line-clamp-2">{t.definition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
