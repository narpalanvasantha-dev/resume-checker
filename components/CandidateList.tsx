import React, { useState } from 'react';
import { Candidate } from '../types';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.timestamp - a.timestamp);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'Shortlisted': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'Rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Score</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedCandidates.map((candidate) => (
              <React.Fragment key={candidate.id}>
                <tr className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{candidate.name}</div>
                    <div className="text-sm text-slate-500">{candidate.email}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{candidate.role || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${candidate.score > 75 ? 'bg-emerald-500' : candidate.score < 50 ? 'bg-red-500' : 'bg-amber-500'}`}
                          style={{ width: `${candidate.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{candidate.score}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={candidate.status} />
                      <span className={`text-sm font-medium ${
                        candidate.status === 'Shortlisted' ? 'text-emerald-700' : 
                        candidate.status === 'Rejected' ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {candidate.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleExpand(candidate.id)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                    >
                      {expandedId === candidate.id ? 'Hide' : 'Details'}
                      {expandedId === candidate.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
                
                {/* Expandable Details */}
                {expandedId === candidate.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase">AI Analysis</h4>
                          <p className="text-sm text-slate-600 leading-relaxed mb-4">{candidate.analysis}</p>
                          
                          <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase">Identified Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                          <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase">Source Data</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-slate-400 font-semibold mb-1">RESUME SNIPPET</p>
                              <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded max-h-24 overflow-y-auto">
                                {candidate.resumeText}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 font-semibold mb-1">JOB DESCRIPTION</p>
                              <p className="text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded max-h-24 overflow-y-auto">
                                {candidate.jobDescription}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;
