interface PrivacySection {
  heading: string;
  content: string;
}

interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  githubLink: string;
  email: string;
  sections: PrivacySection[];
}

const email = "hello@opnbase.com";

export const privacyPolicyContent: PrivacyPolicyContent = {
    title: "Privacy Notice",
    lastUpdated: "June 19, 2025",
    githubLink: "https://github.com/opnbase",
    email, 
    sections: [
        {
            heading: "", 
            content: `This website is currently in active development and operates as a waitlist-based preview for an unreleased product. As part of our effort to improve the site and gain insights into user engagement, we collect and store certain technical information from all visitors.`
        },
        {
            heading: "Data Collected",
            content: `The following data may be collected and stored when you access the site:
            \n- Browser user agent
            \n- Screen resolution and dimensions
            \n- Timezone
            \n- Preferred language
            \n- Operating system or platform
            \n- IP address (when available)
            \n- A generated fingerprint hash used for anonymous visit tracking`
        },
        {
            heading: "Purpose of Data Collection",
            content: `This information is used exclusively for analytical and diagnostic purposes to help us understand how users interact with our platform. It enables us to measure usage patterns, detect technical issues, and plan improvements prior to release.`
        },
        {
            heading: "Personally Identifiable Information (PII)",
            content: `We do not collect any personally identifiable information (PII) unless explicitly provided by you (e.g., through a waitlist signup form). All data is handled securely and is not shared with third parties.`
        },
        {
            heading: "Transparency and Open Source",
            content: `As this is an open-source project, the methods of data collection and storage are transparently available in our public codebase: [View on GitHub](https://github.com/opnbase)`
        },
        {
            heading: "Contact Us",
            content: `If you have any questions or concerns regarding how we handle data, feel free to contact us at [${email}].`
        }
    ]
};
