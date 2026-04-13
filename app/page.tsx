import CompanySitesBoard from "./ui/company-sites-board";

const companySites = [
  "https://ai.crispai.ca",
  "https://aielevatechallenge.crispai.ca",
  "https://aitwin.crispai.ca",
  "https://all.crispai.ca",
  "https://appointmentbooking.crispai.ca",
  "https://bootcamp.crispai.ca",
  "https://businessagent.crispai.ca",
  "https://businessintelligenceagent.crispai.ca",
  "https://canvaslms.crispai.ca",
  "https://certificates.crispai.ca",
  "https://crispwrite.crispai.ca",
  "https://customgpts.crispai.ca",
  "https://emailscrapper.crispai.ca",
  "https://labs.crispai.ca",
  "https://marketplace.crispai.ca",
  "https://n8n.crispai.ca",
  "https://reflections.crispai.ca",
  "https://toolsio.crispai.ca",
  "https://utm.crispai.ca",
] as const;

export default function Page() {
  return <CompanySitesBoard sites={[...companySites]} />;
}
