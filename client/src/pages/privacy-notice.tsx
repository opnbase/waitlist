import React, { useEffect } from 'react';
import { privacyPolicyContent } from '../lib/privacy-policy-content';

const emailToken = `[${privacyPolicyContent.email}]`;

const PrivacyNoticePage = () => {
  useEffect(() => {
    document.title = 'Opnbase - privacy notice';
  }, []);

  return (
    <div className="flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 min-h-screen text-white">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center sm:text-left">
          {privacyPolicyContent.title}
        </h1>
        <p className="text-sm text-neutral-400 mb-8 text-center sm:text-left">
          Last updated: {privacyPolicyContent.lastUpdated}
        </p>

        <div className="text-neutral-300 space-y-6 leading-relaxed">
          {privacyPolicyContent.sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.heading && (
                <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
                  {section.heading}
                </h2>
              )}

              {section.content.split('\n').map((line, lineIdx) =>
                line.trim().startsWith('- ') ? (
                  <li key={lineIdx} className="ml-6 list-disc">
                    {line.trim().substring(2).trim()}
                  </li>
                ) : (
                  <p key={lineIdx} className="mb-2">
                    {line.includes('[View on GitHub]') ? (
                      <a
                        href={privacyPolicyContent.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View on GitHub
                      </a>
                    ) : line.includes(emailToken) ? (
                      <>
                        {line.split(emailToken).map((part, i) =>
                          i === 0 ? (
                            part
                          ) : (
                            <React.Fragment key={i}>
                              <a
                                href={`mailto:${privacyPolicyContent.email}`}
                                className="text-blue-400 hover:underline"
                              >
                                {privacyPolicyContent.email}
                              </a>
                              {part}
                            </React.Fragment>
                          )
                        )}
                      </>
                    ) : (
                      line
                    )}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyNoticePage;
