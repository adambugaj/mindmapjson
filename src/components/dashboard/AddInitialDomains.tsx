import React, { useEffect } from "react";
import { addMultipleDomains } from "../../lib/domainStorage";

const domainUrls = [
  "finansowyplac.pl",
  "kredytjuzdzis.pl",
  "kredytoweprzypadki.pl",
  "kredytnazycie.pl",
  "https://toseemore.pl",
  "https://access-technology.net",
  "https://LatestExam.de",
  "https://ushops.net",
  "https://seekphp.com",
  "https://bpmplumbing.com",
  "https://serwisantdrukarek.pl",
  "https://dermatologholistyczny.pl",
  "xcomputer.site",
  "latestexam.de",
  "randkawedwoje.pl",
  "portalrandkowy24.pl",
];

interface AddInitialDomainsProps {
  onComplete: () => void;
}

const AddInitialDomains: React.FC<AddInitialDomainsProps> = ({
  onComplete,
}) => {
  useEffect(() => {
    // Add all domains
    addMultipleDomains(domainUrls);

    // Call the onComplete callback
    onComplete();
  }, [onComplete]);

  return null; // This component doesn't render anything
};

export default AddInitialDomains;
