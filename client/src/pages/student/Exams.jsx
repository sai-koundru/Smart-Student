import React, { useState } from 'react';
import { Globe, MapPin, Building2, ChevronRight } from 'lucide-react';

export default function Exams() {
  const [activeTab, setActiveTab] = useState('before');

  const beforeBTech = [
    { name: 'JEE Main', body: 'NTA', category: 'India', desc: 'NITs, IIITs, GFTIs admission', scope: 'Engineer at top govt colleges' },
    { name: 'JEE Advanced', body: 'IITs', category: 'India', desc: 'Admission into Indian Institutes of Technology', scope: 'Engineer at IITs (India\'s best)' },
    { name: 'TS EAMCET', body: 'TSCHE', category: 'State', desc: 'Engineering admission in Telangana colleges', scope: 'Engineer in TS colleges' },
    { name: 'AP EAMCET', body: 'APSCHE', category: 'State', desc: 'Engineering admission in Andhra Pradesh', scope: 'Engineer in AP colleges' },
    { name: 'BITSAT', body: 'BITS Pilani', category: 'Private', desc: 'Admission to BITS campuses', scope: 'Engineer at BITS (elite private)' },
    { name: 'COMEDK', body: 'Karnataka', category: 'State', desc: 'Engineering in Karnataka colleges', scope: 'Engineer in Karnataka' },
    { name: 'SAT', body: 'College Board', category: 'International', desc: 'Undergraduate admission in US universities', scope: 'Undergraduate in US' },
    { name: 'ACT', body: 'ACT Inc', category: 'International', desc: 'Undergraduate admission in US/Canada', scope: 'Undergraduate in US/Canada' },
    { name: 'A-Levels', body: 'Cambridge', category: 'International', desc: 'University admission in UK', scope: 'Undergraduate in UK' },
    { name: 'IELTS', body: 'British Council', category: 'International', desc: 'English proficiency for studying abroad', scope: 'Study abroad eligibility' },
    { name: 'TOEFL', body: 'ETS', category: 'International', desc: 'English proficiency for US universities', scope: 'Study in US eligibility' },
    { name: 'SSC CHSL', body: 'SSC', category: 'Govt Job', desc: 'Combined Higher Secondary Level', scope: 'LDC, Court Clerk, Postal Assistant (Govt)' },
    { name: 'RRB NTPC', body: 'Indian Railways', category: 'Govt Job', desc: 'Non-Technical Popular Categories', scope: 'Railway Clerk, Station Master (Govt)' }
  ];

  const afterBTech = [
    { name: 'GATE', body: 'IITs/IISc', category: 'India', desc: 'Graduate Aptitude Test in Engineering', scope: 'M.Tech at IITs/NITs, PSU jobs (ONGC, BHEL, ISRO)' },
    { name: 'CAT', body: 'IIMs', category: 'India', desc: 'Common Admission Test for MBA', scope: 'MBA at IIMs, top management career' },
    { name: 'GRE', body: 'ETS', category: 'International', desc: 'Graduate Record Examinations', scope: 'MS/PhD in USA, Canada, Europe' },
    { name: 'GMAT', body: 'GMAC', category: 'International', desc: 'Graduate Management Admission Test', scope: 'MBA abroad (Harvard, Stanford, etc.)' },
    { name: 'TOEFL', body: 'ETS', category: 'International', desc: 'Test of English as a Foreign Language', scope: 'English proficiency for studying abroad' },
    { name: 'IELTS', body: 'British Council', category: 'International', desc: 'International English Language Testing System', scope: 'English proficiency for UK, Australia, Canada' },
    { name: 'UPSC CSE', body: 'UPSC', category: 'Govt Job', desc: 'Civil Services Examination', scope: 'IAS, IPS, IFS, IRS Officers (India\'s top govt jobs)' },
    { name: 'SSC CGL', body: 'SSC', category: 'Govt Job', desc: 'Combined Graduate Level', scope: 'Tax Inspector, Auditor, Sub-Inspector (Govt)' },
    { name: 'IBPS PO', body: 'IBPS', category: 'Govt Job', desc: 'Probationary Officer in Public Banks', scope: 'Bank Probationary Officer' },
    { name: 'SBI PO', body: 'SBI', category: 'Govt Job', desc: 'Probationary Officer in SBI', scope: 'State Bank Officer' },
    { name: 'ISRO Scientist', body: 'ISRO', category: 'Govt Job', desc: 'Scientist/Engineer Centralized Recruitment', scope: 'Scientist/Engineer at Indian Space Research Organisation' },
    { name: 'DRDO SET', body: 'DRDO', category: 'Govt Job', desc: 'Scientist Entry Test', scope: 'Scientist at Defence Research Organisation' }
  ];

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'International': return 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500';
      case 'Govt Job': return 'bg-amber-100 text-amber-700 border-l-4 border-amber-500';
      case 'India': return 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500';
      default: return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'International': return <Globe size={16} className="mr-1" />;
      case 'Govt Job': return <Building2 size={16} className="mr-1" />;
      default: return <MapPin size={16} className="mr-1" />;
    }
  };

  const examsList = activeTab === 'before' ? beforeBTech : afterBTech;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          📝 Exams Guide
        </h1>
        <p className="text-gray-500">Explore competitive exams for your career path</p>
      </div>

      <div className="flex bg-white rounded-xl p-1 shadow-sm w-max border border-gray-100">
        <button
          onClick={() => setActiveTab('before')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'before'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Before B.Tech
        </button>
        <button
          onClick={() => setActiveTab('after')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'after'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          After B.Tech
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examsList.map((exam, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
            <div className={`p-6 flex-1 flex flex-col ${getCategoryStyles(exam.category).split(' ')[3]}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {exam.name}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryStyles(exam.category).split(' ').slice(0, 2).join(' ')}`}>
                  {getCategoryIcon(exam.category)}
                  {exam.category}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1 font-medium">Conducting Body:</p>
                <p className="text-sm text-gray-800">{exam.body}</p>
              </div>
              
              <div className="mb-4 flex-1">
                <p className="text-sm text-gray-500 mb-1 font-medium">Eligibility/Info:</p>
                <p className="text-sm text-gray-800">{exam.desc}</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 mt-auto border border-emerald-100">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">
                  What you can become
                </p>
                <p className="text-sm font-semibold text-emerald-800 flex items-start">
                  <ChevronRight size={16} className="mr-1 mt-0.5 shrink-0" />
                  {exam.scope}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
