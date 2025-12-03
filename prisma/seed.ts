import bcrypt from "bcryptjs";
import { PrismaClient, SavedStatus } from "@prisma/client";

const prisma = new PrismaClient();

const baseOpportunities = [
  {
    title: "Cybersecurity Operations Support",
    agency: "Department of Defense",
    department: "Air Force",
    solicitationNumber: "RFP-24-CS-001",
    noticeType: "Solicitation",
    naicsCodes: ["541512", "541519"],
    pscCodes: ["D310", "R499"],
    setAside: "Small Business",
    placeOfPerformance: "San Antonio, TX",
    estimatedValueMin: 2000000,
    estimatedValueMax: 5000000,
    responseDeadline: 30,
    postedDate: -5,
    url: "https://sam.gov/opp/cyber-ops",
    description: "Provide 24/7 cybersecurity monitoring, incident response, and defensive cyber operations for Air Force assets.",
    rawText:
      "The Air Force requires managed cybersecurity operations including SIEM, SOC staffing, continuous monitoring, and incident response playbooks.",
    status: "Open",
  },
  {
    title: "Logistics Analytics Platform",
    agency: "Department of Homeland Security",
    department: "CBP",
    solicitationNumber: "RFP-24-LOG-104",
    noticeType: "Solicitation",
    naicsCodes: ["541611", "541614"],
    pscCodes: ["R706"],
    setAside: "Open",
    placeOfPerformance: "Remote",
    estimatedValueMin: 1500000,
    estimatedValueMax: 3500000,
    responseDeadline: 21,
    postedDate: -2,
    url: "https://sam.gov/opp/logistics-analytics",
    description: "Develop analytics dashboards for supply chain visibility and customs enforcement logistics.",
    rawText: "DHS seeks a secure cloud-native analytics platform with data pipelines, BI, and role-based access.",
    status: "Open",
  },
  {
    title: "Cloud Migration Services",
    agency: "General Services Administration",
    department: "Technology Transformation Services",
    solicitationNumber: "GSA-24-CLOUD-22",
    noticeType: "Sources Sought",
    naicsCodes: ["541512", "541618"],
    pscCodes: ["D399"],
    setAside: "8(a)",
    placeOfPerformance: "Washington, DC",
    estimatedValueMin: 1000000,
    estimatedValueMax: 2500000,
    responseDeadline: 18,
    postedDate: -1,
    url: "https://sam.gov/opp/cloud-migration",
    description: "Market research for partners to migrate legacy applications to FedRAMP High cloud.",
    rawText: "GSA TTS plans phased migration with zero-trust principles and modern DevSecOps pipelines.",
    status: "Open",
  },
  {
    title: "Data Science BPA",
    agency: "Department of Health and Human Services",
    department: "NIH",
    solicitationNumber: "HHS-DS-2024-09",
    noticeType: "Solicitation",
    naicsCodes: ["541511", "541715"],
    pscCodes: ["DA10"],
    setAside: "Open",
    placeOfPerformance: "Bethesda, MD",
    estimatedValueMin: 5000000,
    estimatedValueMax: 12000000,
    responseDeadline: 35,
    postedDate: -7,
    url: "https://sam.gov/opp/data-science-bpa",
    description: "Multiple-award BPA for AI/ML model development, data engineering, and analytics ops.",
    rawText: "NIH is establishing a BPA to support research analytics, secure data lakes, and scientific computing.",
    status: "Open",
  },
  {
    title: "Facilities Management",
    agency: "Department of Veterans Affairs",
    department: "Facilities",
    solicitationNumber: "VA-FM-2024-02",
    noticeType: "Presolicitation",
    naicsCodes: ["561210"],
    pscCodes: ["M1AB"],
    setAside: "SDVOSB",
    placeOfPerformance: "Denver, CO",
    estimatedValueMin: 750000,
    estimatedValueMax: 1800000,
    responseDeadline: 25,
    postedDate: -3,
    url: "https://sam.gov/opp/va-facilities",
    description: "Operations and maintenance for VA medical campus facilities and utilities.",
    rawText: "SDVOSB set-aside for full O&M scope including HVAC, electrical, janitorial, and groundskeeping.",
    status: "Open",
  },
  {
    title: "AI-Powered Document Analysis",
    agency: "Department of Justice",
    department: "FBI",
    solicitationNumber: "DOJ-AI-4401",
    noticeType: "Solicitation",
    naicsCodes: ["541512", "541990"],
    pscCodes: ["D318"],
    setAside: "Small Business",
    placeOfPerformance: "Quantico, VA",
    estimatedValueMin: 1200000,
    estimatedValueMax: 2600000,
    responseDeadline: 27,
    postedDate: -6,
    url: "https://sam.gov/opp/ai-doc-analysis",
    description: "Deploy AI models to classify, redact, and summarize investigative documents.",
    rawText: "FBI needs secure NLP pipelines with human-in-the-loop review and audit logging.",
    status: "Open",
  },
  {
    title: "Network Modernization",
    agency: "Department of State",
    department: "IRM",
    solicitationNumber: "STATE-NET-88",
    noticeType: "Solicitation",
    naicsCodes: ["517111", "541513"],
    pscCodes: ["DG11"],
    setAside: "Open",
    placeOfPerformance: "Global",
    estimatedValueMin: 6000000,
    estimatedValueMax: 15000000,
    responseDeadline: 40,
    postedDate: -10,
    url: "https://sam.gov/opp/network-modernization",
    description: "Modernize WAN/LAN across embassies with SD-WAN, zero-trust access, and observability.",
    rawText: "Solution should include managed network services, telemetry, and resilient architectures for overseas posts.",
    status: "Open",
  },
  {
    title: "Call Center Optimization",
    agency: "Social Security Administration",
    department: "Customer Service",
    solicitationNumber: "SSA-CC-120",
    noticeType: "Solicitation",
    naicsCodes: ["541611"],
    pscCodes: ["R799"],
    setAside: "WOSB",
    placeOfPerformance: "Remote",
    estimatedValueMin: 900000,
    estimatedValueMax: 1400000,
    responseDeadline: 19,
    postedDate: -4,
    url: "https://sam.gov/opp/ssa-call-center",
    description: "Optimize contact center operations with AI routing, QA, and workforce management.",
    rawText: "SSA seeks omnichannel routing, analytics, and agent assist tooling with strong CX metrics.",
    status: "Open",
  },
  {
    title: "Geospatial Data Integration",
    agency: "USDA",
    department: "Forest Service",
    solicitationNumber: "USDA-GEO-77",
    noticeType: "Solicitation",
    naicsCodes: ["541370", "541511"],
    pscCodes: ["T001"],
    setAside: "Open",
    placeOfPerformance: "Boise, ID",
    estimatedValueMin: 800000,
    estimatedValueMax: 1600000,
    responseDeadline: 24,
    postedDate: -8,
    url: "https://sam.gov/opp/usda-geo",
    description: "Integrate geospatial datasets for wildfire risk modeling and forest health monitoring.",
    rawText: "Forest Service requires data pipelines, geospatial APIs, and visualization for mission teams.",
    status: "Open",
  },
  {
    title: "AI Contract Triage",
    agency: "Department of Energy",
    department: "Procurement",
    solicitationNumber: "DOE-AI-320",
    noticeType: "Sources Sought",
    naicsCodes: ["541512", "541611"],
    pscCodes: ["R603"],
    setAside: "Open",
    placeOfPerformance: "Remote",
    estimatedValueMin: 500000,
    estimatedValueMax: 1200000,
    responseDeadline: 16,
    postedDate: -2,
    url: "https://sam.gov/opp/doe-contract-triage",
    description: "Market research for AI system to classify contract clauses and risks.",
    rawText: "DOE is exploring NLP to triage clauses, suggest redlines, and flag compliance gaps.",
    status: "Open",
  },
];

const now = new Date();

function deadline(daysFromNow: number) {
  const d = new Date(now);
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

function posted(daysAgo: number) {
  const d = new Date(now);
  d.setDate(d.getDate() + daysAgo);
  return d;
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@govai.test" },
    update: {},
    create: {
      email: "demo@govai.test",
      name: "Demo User",
      passwordHash,
      role: "user",
      emailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@govai.test" },
    update: {},
    create: {
      email: "admin@govai.test",
      name: "Site Admin",
      passwordHash,
      role: "admin",
      emailVerified: true,
    },
  });

  const variants = ["A", "B", "C"];
  const expanded = variants.flatMap((variant, variantIdx) =>
    baseOpportunities.map((op, idx) => ({
      samId: `${op.solicitationNumber}-${variant}`,
      title: `${op.title} ${variant}`,
      agency: op.agency,
      department: op.department,
      solicitationNumber: `${op.solicitationNumber}-${variant}`,
      noticeType: op.noticeType,
      naicsCodes: op.naicsCodes,
      pscCodes: op.pscCodes,
      setAside: op.setAside,
      placeOfPerformance: op.placeOfPerformance,
      estimatedValueMin: op.estimatedValueMin,
      estimatedValueMax: op.estimatedValueMax,
      responseDeadline: deadline(op.responseDeadline + variantIdx * 5),
      postedDate: posted(op.postedDate - variantIdx),
      url: `${op.url}?v=${variant}`,
      description: op.description,
      rawText: op.rawText,
      status: op.status,
    }))
  );

  await prisma.opportunity.deleteMany();
  await prisma.opportunity.createMany({ data: expanded });

  const opportunities = await prisma.opportunity.findMany({ take: 30 });

  await prisma.attachment.deleteMany();
  await prisma.attachment.createMany({
    data: opportunities.slice(0, 5).map((opp, idx) => ({
      opportunityId: opp.id,
      fileName: `attachment-${idx + 1}.pdf`,
      fileType: "application/pdf",
      fileSize: 512000,
      url: `${opp.url}/files/spec-${idx + 1}.pdf`,
    })),
  });

  await prisma.savedOpportunity.deleteMany();
  await prisma.savedOpportunity.createMany({
    data: [
      {
        userId: demoUser.id,
        opportunityId: opportunities[0]?.id ?? "",
        status: SavedStatus.Evaluating,
        notes: "Fits our past performance in SOC operations.",
        priority: "high",
      },
      {
        userId: demoUser.id,
        opportunityId: opportunities[1]?.id ?? "",
        status: SavedStatus.Pursuing,
        notes: "Need teaming partner for SDVOSB.",
        priority: "medium",
      },
      {
        userId: demoUser.id,
        opportunityId: opportunities[2]?.id ?? "",
        status: SavedStatus.Submitted,
        notes: "Proposal drafted - waiting on pricing.",
        priority: "medium",
      },
    ].filter((entry) => entry.opportunityId !== ""),
  });

  await prisma.savedSearch.deleteMany();
  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId: demoUser.id,
      name: "Cyber + AI",
      query: "cybersecurity operations with AI assist",
      filters: {
        agency: ["Department of Defense"],
        naicsCodes: ["541512", "541519"],
        setAside: "Small Business",
      },
      frequency: "daily",
      lastRunAt: new Date(),
    },
  });

  await prisma.alertSubscription.deleteMany();
  await prisma.alertSubscription.create({
    data: {
      userId: demoUser.id,
      savedSearchId: savedSearch.id,
      deliveryChannel: "email",
      isActive: true,
    },
  });

  await prisma.proposalDraft.deleteMany();
  if (opportunities[0]) {
    await prisma.proposalDraft.create({
      data: {
        userId: demoUser.id,
        opportunityId: opportunities[0].id,
        title: "Cyber Ops Draft",
        sections: [
          { heading: "Executive Summary", content: "Overview of our cyber operations team." },
          { heading: "Technical Approach", content: "SOC playbooks, automation, threat hunting." },
        ],
        status: "Draft",
      },
    });
  }

  console.log(`Seeded ${opportunities.length} opportunities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
