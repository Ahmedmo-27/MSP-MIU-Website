import React, { memo, useMemo, useState } from 'react';
import './PageBase.css';
import BoardHeader from './Board/BoardHeader';
import ProfileCard from '../components/ProfileCard';
import DepartmentMenu from './Board/DepartmentMenu';
import './Board/Board.css';

import img5 from '../assets/Images/card.jpg';

const boardMembers = [
  {
    id: 1,
    name: 'Ahmed Mostafa',
    role: 'Software Development Head',
    department: 1, 
    image: img5
  },
  {
    id: 2,
    name: 'Michael Hisham',
    role: 'Software Development Co-Head',
    department: 1, 
  },
  {
    id: 3,
    name: 'Habiba Ehab',
    role: 'Software Development Co-Head',
    department: 1, 
  },
  {
    id: 5,
    name: 'Mohamed Wael',
    role: 'President',
    department: 8,
  },
  {
    id: 4,
    name: 'Mohamed Hesham',
    role: 'Vice President',
    department: 7,
  },
  {
    id: 6,
    name: 'Mahmoud Mamdouh',
    role: 'Founder',
    department: 9,
  },
  {
    id: 7,
    name: 'Mohamed Essam',
    role: 'Technical Training Head',
    department: 2,
  },
  {
    id: 8,
    name: 'Shahd Waleed',
    role: 'Technical Training Co-Head',
    department: 2,
  },
  {
    id: 9,
    name: 'Youssef Hussien',
    role: 'Technical Training Co-Head',
    department: 2,
  },
  {
    id: 10,
    name: 'Abdelkader Adnan',
    role: 'Technical Training Co-Head',
    department: 2,
  },
  {
    id: 11,
    name: 'Diaa',
    role: 'Media & Content Creation Head',
    department: 3,
  },
];

const ROLE_ORDER = { 'Founder': 1, 'President': 2, 'Vice President': 3 };
const DEPT_ORDER = { 9: 1, 8: 2, 7: 3 };

const Board = memo(() => {
  const [selectedDepartment, setSelectedDepartment] = useState(1);

  const groupedMembers = useMemo(() => {
    // Filter members
    let members = boardMembers;
    if (selectedDepartment !== null) {
      if (selectedDepartment === 'president-vp') {
        members = boardMembers.filter(m => m.department === 7 || m.department === 8);
      } else {
        members = boardMembers.filter(m => m.department === selectedDepartment);
      }
    }

    // Group by department and role
    const groups = {};
    members.forEach(member => {
      const deptId = member.department;
      if (!groups[deptId]) groups[deptId] = { heads: [], coHeads: [] };
      
      const role = member.role.toLowerCase();
      const isSpecial = ['founder', 'president', 'vice president'].includes(member.role.toLowerCase());
      const isHead = role.includes('head') && !role.includes('co-head');
      
      if (isHead || isSpecial) {
        groups[deptId].heads.push(member);
      } else {
        groups[deptId].coHeads.push(member);
      }
    });

    // Sort heads within each group
    Object.values(groups).forEach(group => {
      group.heads.sort((a, b) => (ROLE_ORDER[a.role] || 999) - (ROLE_ORDER[b.role] || 999));
    });
    
    return groups;
  }, [selectedDepartment]);

  const sortedDepartments = Object.entries(groupedMembers).sort(([a], [b]) => {
    const orderA = DEPT_ORDER[a] || 999;
    const orderB = DEPT_ORDER[b] || 999;
    return (orderA !== 999 && orderB !== 999) ? orderA - orderB : 
           (orderA !== 999) ? -1 : (orderB !== 999) ? 1 : parseInt(a) - parseInt(b);
  });

  return (
    <section className="PageBase">
      <BoardHeader />
      <DepartmentMenu 
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
      />
      <section className="BoardMembers">
        <div key={selectedDepartment} className="BoardMembers__grid">
          {sortedDepartments.map(([deptId, group]) => (
            <div key={deptId} className="BoardMembers__department-group">
              {group.heads.map((member, index) => (
                <div 
                  key={member.id} 
                  className="BoardMembers__card BoardMembers__card--head BoardMembers__card--animate"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProfileCard
                    avatarUrl={member.image}
                    name={member.name}
                    title={member.role}
                    showUserInfo={false}
                    behindGlowEnabled={false}
                    innerGradient="linear-gradient(135deg, rgba(142, 194, 240, 0.3), rgba(3, 169, 244, 0.2))"
                  />
                </div>
              ))}
              {group.coHeads.length > 0 && (
                <div className="BoardMembers__coheads-container">
                  {group.coHeads.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="BoardMembers__card BoardMembers__card--cohead BoardMembers__card--animate"
                      style={{ animationDelay: `${(group.heads.length + index) * 0.1}s` }}
                    >
                      <ProfileCard
                        avatarUrl={member.image}
                        name={member.name}
                        title={member.role}
                        showUserInfo={false}
                        behindGlowEnabled={false}
                        innerGradient="linear-gradient(135deg, rgba(142, 194, 240, 0.3), rgba(3, 169, 244, 0.2))"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
});

Board.displayName = 'Board';

export default Board;