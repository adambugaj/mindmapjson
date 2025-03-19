import React, { useEffect } from "react";
import { addMultipleDomains } from "../../lib/domainStorage";

interface AddInitialDomainsProps {
  onComplete: () => void;
}

const AddInitialDomains: React.FC<AddInitialDomainsProps> = ({
  onComplete,
}) => {
  useEffect(() => {
    // Domain data with DA/DR values
    const domainData = [
      { url: "finansowyplac.pl", da: 21 },
      { url: "kredytjuzdzis.pl", da: 22 },
      { url: "kredytoweprzypadki.pl", da: 22 },
      { url: "kredytnazycie.pl", da: 22 },
      { url: "toseemore.pl", da: 8, dr: 32 },
      { url: "access-technology.net", da: 11 },
      { url: "LatestExam.de", da: 14 },
      { url: "ushops.net", da: 16 },
      { url: "seekphp.com", da: 7 },
      { url: "bpmplumbing.com", da: 14 },
      { url: "serwisantdrukarek.pl", da: 7 },
      { url: "dermatologholistyczny.pl", da: 12 },
      { url: "xcomputer.site" },
      { url: "latestexam.de", da: 14 },
      { url: "randkawedwoje.pl" },
      { url: "portalrandkowy24.pl" },
    ];

    // Add all domains
    addMultipleDomains(domainData);

    // Call the onComplete callback
    onComplete();
  }, [onComplete]);

  return null; // This component doesn't render anything
};

export default AddInitialDomains;
