import React, { useMemo } from 'react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ProfileCardComponent = ({
  avatarUrl = '<Placeholder for avatar URL>',
  innerGradient,
  behindGlowEnabled = true,
  className = '',
  miniAvatarUrl,
  name,
  title,
  showUserInfo = true
}) => {
  const cardStyle = useMemo(
    () => ({
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT
    }),
    [innerGradient]
  );

  return (
    <div className={`pc-card-wrapper ${className}`.trim()} style={cardStyle}>
      {behindGlowEnabled && <div className="pc-behind" />}
      <div className="pc-card-shell">
        <section className="pc-card">
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              <img
                className="avatar"
                src={avatarUrl}
                alt="avatar"
                loading="lazy"
                onError={e => {
                  const t = e.target;
                  t.style.display = 'none';
                }}
              />
              {showUserInfo && (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      <img
                        src={miniAvatarUrl || avatarUrl}
                        alt="mini avatar"
                        loading="lazy"
                        onError={e => {
                          const t = e.target;
                          t.style.opacity = '0.5';
                          t.src = avatarUrl;
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {(name || title) && (
              <div className="pc-content">
                <div className="pc-details">
                  {name && <h3>{name}</h3>}
                  {title && <p>{title}</p>}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
