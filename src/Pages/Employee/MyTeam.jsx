import { useEffect, useState } from 'react';
import { employeeAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const MyTeam = () => {
  const [companies, setCompanies] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(0);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [teamResponse, birthdayResponse] = await Promise.all([
        employeeAPI.getMyTeam(),
        employeeAPI.getTeamBirthdays()
      ]);
      setCompanies(teamResponse.data.companies);
      setBirthdays(birthdayResponse.data.birthdays);
    } catch (error) {
      toast.error('Failed to fetch team data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (companies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Team</h1>
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">You are not affiliated with any company yet</p>
        </div>
      </div>
    );
  }

  const currentCompany = companies[selectedCompany];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Team</h1>

      {/* Company Tabs */}
      {companies.length > 1 && (
        <div className="tabs tabs-boxed mb-6">
          {companies.map((company, index) => (
            <button
              key={index}
              className={`tab ${selectedCompany === index ? 'tab-active' : ''}`}
              onClick={() => setSelectedCompany(index)}
            >
              {company.companyName}
            </button>
          ))}
        </div>
      )}

      {/* Upcoming Birthdays */}
      {birthdays.length > 0 && (
        <div className="alert alert-info mb-6">
          <div>
            <h3 className="font-bold">🎂 Upcoming Birthdays This Month</h3>
            <ul className="mt-2">
              {birthdays.map((birthday, index) => (
                <li key={index}>
                  {birthday.name} - {new Date(birthday.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Team Members */}
      {currentCompany.teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No other team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCompany.teamMembers.map((member) => (
            <div key={member._id} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="avatar">
                  <div className="w-24 rounded-full">
                    <img src={member.profileImage || 'https://i.ibb.co/hL3hMHY/default-avatar.png'} alt={member.name} />
                  </div>
                </div>
                <h2 className="card-title">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-xs text-gray-500">
                  Joined: {new Date(member.affiliationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeam;